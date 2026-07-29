import axiosInstance from './axios';
import { ApiResponse, Challan, ChallanStatus } from '../types';

export interface ChallanListParams {
  page?: number;
  limit?: number;
  status?: ChallanStatus;
  customerId?: string;
}

export interface ChallanItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateChallanPayload {
  customerId: string;
  items: ChallanItemPayload[];
  status?: 'DRAFT' | 'CONFIRMED';
}

export const challanApi = {
  list: (params: ChallanListParams) =>
    axiosInstance.get<ApiResponse<Challan[]>>('/challans', { params }),

  getById: (id: string) => axiosInstance.get<ApiResponse<Challan>>(`/challans/${id}`),

  create: (payload: CreateChallanPayload) =>
    axiosInstance.post<ApiResponse<Challan>>('/challans', payload),

  update: (id: string, payload: { customerId?: string; items?: ChallanItemPayload[] }) =>
    axiosInstance.put<ApiResponse<Challan>>(`/challans/${id}`, payload),

  changeStatus: (id: string, status: ChallanStatus) =>
    axiosInstance.patch<ApiResponse<Challan>>(`/challans/${id}/status`, { status }),
};
