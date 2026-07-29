import axiosInstance from './axios';
import { ApiResponse, Customer, CustomerStatus, CustomerType } from '../types';

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerStatus;
  customerType?: CustomerType;
}

export interface CustomerPayload {
  name: string;
  phone: string;
  email?: string;
  businessName: string;
  gstNumber?: string;
  customerType: CustomerType;
  address?: string;
  status?: CustomerStatus;
  followUpDate?: string;
  notes?: string;
}

export const customerApi = {
  list: (params: CustomerListParams) =>
    axiosInstance.get<ApiResponse<Customer[]>>('/customers', { params }),

  getById: (id: string) => axiosInstance.get<ApiResponse<Customer>>(`/customers/${id}`),

  create: (payload: CustomerPayload) =>
    axiosInstance.post<ApiResponse<Customer>>('/customers', payload),

  update: (id: string, payload: Partial<CustomerPayload>) =>
    axiosInstance.put<ApiResponse<Customer>>(`/customers/${id}`, payload),

  delete: (id: string) => axiosInstance.delete<ApiResponse<null>>(`/customers/${id}`),
};
