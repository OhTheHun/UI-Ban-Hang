export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  expireIn: number;
  userId: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  role?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
}
