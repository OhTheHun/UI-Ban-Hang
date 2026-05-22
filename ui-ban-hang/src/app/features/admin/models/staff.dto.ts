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
  completedOrderCount: number;
  completedOrderTotalAmount: number;
  lastOrder?: {
    invoiceId: string;
    code: string;
    totalAmount: number;
    status: string;
    createdTime: string;
  } | null;
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
  isActive?: boolean;
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

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UploadAvatarResponse {
  image?: string;
  avatar?: string;
  avatarUrl?: string;
  imageUrl?: string;
  url?: string;
  data?: {
    image?: string;
    avatar?: string;
    avatarUrl?: string;
    imageUrl?: string;
    url?: string;
  };
}
