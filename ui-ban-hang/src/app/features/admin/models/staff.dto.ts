export interface StaffDTO {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  image: string;
  role: string;
  isActive: boolean;
  birthday: string;
  identify: string;
  salary: number;
  employeeProfile?: {
    identify: string;
    salary: number;
    date: string;
  };
}

export interface CustomerDTO {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  image: string;
  isActive: boolean;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  birthday: string;
  identify: string;
  salary: number;
}

export interface UpdateUserRequest {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  isActive: boolean;
  birthday: string;
  identify: string;
  salary: number;
}
