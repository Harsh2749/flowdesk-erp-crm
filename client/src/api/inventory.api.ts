import axiosInstance from './axios';
import { ApiResponse, InventoryMovement, Product } from '../types';

export interface StockMovementPayload {
  productId: string;
  quantity: number;
  reason: string;
}

export const inventoryApi = {
  stockIn: (payload: StockMovementPayload) =>
    axiosInstance.post<ApiResponse<InventoryMovement>>('/inventory/stock-in', payload),

  stockOut: (payload: StockMovementPayload) =>
    axiosInstance.post<ApiResponse<InventoryMovement>>('/inventory/stock-out', payload),

  listMovements: (productId?: string, page = 1, limit = 10) =>
    axiosInstance.get<ApiResponse<InventoryMovement[]>>('/inventory/movements', {
      params: { productId, page, limit },
    }),

  lowStock: (page = 1, limit = 10) =>
    axiosInstance.get<ApiResponse<Product[]>>('/inventory/low-stock', { params: { page, limit } }),
};
