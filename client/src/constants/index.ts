import { ChallanStatus, CustomerStatus, CustomerType, Role } from '../types';

export const ROLES: Role[] = ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'];

export const CUSTOMER_TYPES: CustomerType[] = ['RETAIL', 'WHOLESALE', 'DISTRIBUTOR'];

export const CUSTOMER_STATUSES: CustomerStatus[] = ['LEAD', 'ACTIVE', 'INACTIVE'];

export const CHALLAN_STATUSES: ChallanStatus[] = ['DRAFT', 'CONFIRMED', 'CANCELLED'];

export const STATUS_BADGE_VARIANT: Record<string, string> = {
  LEAD: 'warning',
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  DRAFT: 'secondary',
  CONFIRMED: 'success',
  CANCELLED: 'danger',
};

export const STORAGE_KEYS = {
  accessToken: 'merp_access_token',
  refreshToken: 'merp_refresh_token',
  user: 'merp_user',
} as const;

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  customers: '/customers',
  customerDetail: (id: string) => `/customers/${id}`,
  products: '/products',
  inventory: '/inventory',
  challans: '/challans',
  challanDetail: (id: string) => `/challans/${id}`,
} as const;
