import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchUsers, 
  fetchUserById, 
  createUserApi, 
  updateUserApi, 
  deleteUserApi
} from '../services/userService';
import type { UserFilters } from '../services/userService';
import type { UserFormData } from '../types/User';

// 查询键
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 获取所有用户
export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: userKeys.list(filters as Record<string, unknown> || {}),
    queryFn: () => fetchUsers(filters),
  });
};

// 获取单个用户
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id, // 只有当id存在时才执行查询
  });
};

// 创建用户
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: UserFormData) => createUserApi(userData),
    onSuccess: () => {
      // 创建成功后，使列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// 更新用户
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UserFormData }) => 
      updateUserApi(id, userData),
    onSuccess: (updatedUser) => {
      // 更新缓存中的用户数据
      queryClient.setQueryData(
        userKeys.detail(updatedUser.id), 
        updatedUser
      );
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// 删除用户
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: (_data, id) => {
      // 从缓存中移除用户
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}; 