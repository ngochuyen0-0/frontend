// types/user.ts
export interface User {
  id: string;
  avatar?: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'DEFAULT' | 'MOD' | any;
  status: 'ACTIVE' | 'BANNED';
  registrationDate: string;
  lastLogin: string;
  orders: number;
  totalSpent: number;
  coins: number;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  dateRange: [string, string];
}