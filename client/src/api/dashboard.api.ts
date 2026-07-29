import axiosInstance from './axios';
import { ApiResponse, DashboardSummary } from '../types';

export const dashboardApi = {
  summary: () => axiosInstance.get<ApiResponse<DashboardSummary>>('/dashboard/summary'),
};
