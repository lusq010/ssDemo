import type { User, UserFormData } from '../types/User';
import { v4 as uuidv4 } from 'uuid';

// Mock initial data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Daily Sales Report',
    sql_query: 'SELECT * FROM sales WHERE date = CURRENT_DATE',
    injest_type: 'batch',
    enabled: true,
    created_timestamp: '2023-01-10 08:00:00'
  },
  {
    id: '2',
    name: 'Customer Analytics',
    sql_query: 'SELECT customer_id, SUM(purchase_amount) FROM transactions GROUP BY customer_id',
    injest_type: 'streaming',
    enabled: true,
    created_timestamp: '2023-02-05 09:30:00'
  },
  {
    id: '3',
    name: 'Inventory Status',
    sql_query: 'SELECT product_id, quantity FROM inventory WHERE quantity < threshold',
    injest_type: 'incremental',
    enabled: false,
    created_timestamp: '2023-03-12 10:45:00'
  },
  {
    id: '4',
    name: 'User Activity Log',
    sql_query: 'SELECT user_id, action, timestamp FROM user_logs ORDER BY timestamp DESC',
    injest_type: 'full',
    enabled: true,
    created_timestamp: '2023-02-18 11:20:00'
  },
  {
    id: '5',
    name: 'Performance Metrics',
    sql_query: 'SELECT metric_name, value FROM metrics WHERE date BETWEEN :start_date AND :end_date',
    injest_type: 'batch',
    enabled: true,
    created_timestamp: '2023-04-05 13:15:00'
  }
];

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 随机延迟时间，模拟网络波动
const randomDelay = () => delay(Math.floor(Math.random() * 500) + 500); // 500-1000ms

// 强制重新初始化localStorage数据（开发环境使用）
const resetMockData = () => {
  localStorage.setItem('users', JSON.stringify(mockUsers));
  console.log('Mock data has been reset');
};

// 在开发环境中，每次重新加载应用时重置mock数据
// 这样可以确保我们总是有最新的mock数据
if (import.meta.env.DEV) {
  resetMockData();
}

// 从localStorage获取用户数据
const getUsersFromStorage = (): User[] => {
  const users = localStorage.getItem('users');
  if (!users) {
    // 如果没有数据，初始化
    resetMockData();
    return mockUsers;
  }
  return JSON.parse(users);
};

// 将用户数据保存到localStorage
const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// 过滤条件类型定义
export interface UserFilters {
  name?: string;
  injest_type?: string;
  enabled?: boolean;
  date_from?: string;
  date_to?: string;
}

// API模拟函数 - 获取所有用户
export const fetchUsers = async (filters?: UserFilters): Promise<User[]> => {
  await randomDelay();
  let users = getUsersFromStorage();
  
  // 如果有过滤条件，应用过滤
  if (filters) {
    users = users.filter(user => {
      // 按名称过滤（模糊匹配）
      if (filters.name && !user.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      // 按摄取类型过滤
      if (filters.injest_type && user.injest_type !== filters.injest_type) {
        return false;
      }
      
      // 按启用状态过滤
      if (filters.enabled !== undefined && user.enabled !== filters.enabled) {
        return false;
      }
      
      // 按创建时间范围过滤
      if (filters.date_from || filters.date_to) {
        const userDate = new Date(user.created_timestamp);
        
        if (filters.date_from) {
          const fromDate = new Date(filters.date_from);
          if (userDate < fromDate) return false;
        }
        
        if (filters.date_to) {
          const toDate = new Date(filters.date_to);
          // 将结束日期设置为当天的23:59:59
          toDate.setHours(23, 59, 59, 999);
          if (userDate > toDate) return false;
        }
      }
      
      return true;
    });
  }
  
  return users;
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