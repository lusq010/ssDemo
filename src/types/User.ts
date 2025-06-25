export interface User {
  id: string;
  name: string;
  sql_query: string;
  injest_type: 'batch' | 'streaming' | 'incremental' | 'full';
  enabled: boolean;
  created_timestamp: string;
}

export type UserFormData = Omit<User, 'id'>; 