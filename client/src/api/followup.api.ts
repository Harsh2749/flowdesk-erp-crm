import axiosInstance from './axios';
import { ApiResponse, Followup } from '../types';

export interface FollowupPayload {
  customerId: string;
  note: string;
  followUpDate: string;
}

export const followupApi = {
  listByCustomer: (customerId: string, page = 1, limit = 10) =>
    axiosInstance.get<ApiResponse<Followup[]>>(`/followups/customer/${customerId}`, {
      params: { page, limit },
    }),

  create: (payload: FollowupPayload) =>
    axiosInstance.post<ApiResponse<Followup>>('/followups', payload),

  update: (id: string, payload: Partial<Pick<FollowupPayload, 'note' | 'followUpDate'>>) =>
    axiosInstance.put<ApiResponse<Followup>>(`/followups/${id}`, payload),
};
