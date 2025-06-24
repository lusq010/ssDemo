export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'lastLogin'>; 