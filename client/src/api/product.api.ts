import axiosInstance from './axios';
import { ApiResponse, Product } from '../types';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  lowStockOnly?: boolean;
  isActive?: boolean;
}

export interface ProductPayload {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock?: number;
  minStock?: number;
  warehouseLocation?: string;
}

export const productApi = {
  list: (params: ProductListParams) =>
    axiosInstance.get<ApiResponse<Product[]>>('/products', { params }),

  getById: (id: string) => axiosInstance.get<ApiResponse<Product>>(`/products/${id}`),

  create: (payload: ProductPayload) =>
    axiosInstance.post<ApiResponse<Product>>('/products', payload),

  update: (id: string, payload: Partial<ProductPayload>) =>
    axiosInstance.put<ApiResponse<Product>>(`/products/${id}`, payload),

  setActive: (id: string, isActive: boolean) =>
    axiosInstance.patch<ApiResponse<Product>>(`/products/${id}/status`, { isActive }),

  delete: (id: string) => axiosInstance.delete<ApiResponse<null>>(`/products/${id}`),
};