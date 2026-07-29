import axiosInstance from './axios';
import { ApiResponse, AuthResponse, User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', payload),

  me: () => axiosInstance.get<ApiResponse<User>>('/auth/me'),
};
