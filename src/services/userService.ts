import type { User, UserFormData } from '../types/User';
import { v4 as uuidv4 } from 'uuid';

// Mock initial data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    department: 'IT',
    status: 'active',
    lastLogin: '2023-06-15T10:30:00Z',
    createdAt: '2023-01-10T08:00:00Z'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    role: 'editor',
    department: 'Marketing',
    status: 'active',
    lastLogin: '2023-06-14T14:45:00Z',
    createdAt: '2023-02-05T09:30:00Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'viewer',
    department: 'Finance',
    status: 'inactive',
    lastLogin: '2023-05-20T11:15:00Z',
    createdAt: '2023-03-12T10:45:00Z'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah.davis@example.com',
    role: 'editor',
    department: 'HR',
    status: 'active',
    lastLogin: '2023-06-16T09:00:00Z',
    createdAt: '2023-02-18T11:20:00Z'
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'viewer',
    department: 'Operations',
    status: 'active',
    lastLogin: '2023-06-12T16:30:00Z',
    createdAt: '2023-04-05T13:15:00Z'
  }
];

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 随机延迟时间，模拟网络波动
const randomDelay = () => delay(Math.floor(Math.random() * 500) + 500); // 500-1000ms

// Initialize localStorage with mock data if empty
const initializeUsers = (): void => {
  const storedUsers = localStorage.getItem('users');
  if (!storedUsers) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
};

// 从localStorage获取用户数据
const getUsersFromStorage = (): User[] => {
  initializeUsers();
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// 将用户数据保存到localStorage
const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// API模拟函数 - 获取所有用户
export const fetchUsers = async (): Promise<User[]> => {
  await randomDelay();
  return getUsersFromStorage();
};

// API模拟函数 - 获取单个用户
export const fetchUserById = async (id: string): Promise<User> => {
  await randomDelay();
  const users = getUsersFromStorage();
  const user = users.find(user => user.id === id);
  
  if (!user) {
    throw new Error(`用户不存在 (ID: ${id})`);
  }
  
  return user;
};

// API模拟函数 - 创建用户
export const createUserApi = async (userData: UserFormData): Promise<User> => {
  await randomDelay();
  
  const users = getUsersFromStorage();
  
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    lastLogin: undefined
  };
  
  users.push(newUser);
  saveUsersToStorage(users);
  
  return newUser;
};

// API模拟函数 - 更新用户
export const updateUserApi = async (id: string, userData: UserFormData): Promise<User> => {
  await randomDelay();
  
  const users = getUsersFromStorage();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error(`用户不存在 (ID: ${id})`);
  }
  
  const updatedUser: User = {
    ...users[userIndex],
    ...userData,
  };
  
  users[userIndex] = updatedUser;
  saveUsersToStorage(users);
  
  return updatedUser;
};

// API模拟函数 - 删除用户
export const deleteUserApi = async (id: string): Promise<void> => {
  await randomDelay();
  
  const users = getUsersFromStorage();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    throw new Error(`用户不存在 (ID: ${id})`);
  }
  
  saveUsersToStorage(filteredUsers);
}; 