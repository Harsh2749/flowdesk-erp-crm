import { Customer, CustomerStatus, CustomerType } from '@prisma/client';

export interface CustomerResponseDto {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  businessName: string;
  gstNumber: string | null;
  customerType: CustomerType;
  address: string | null;
  status: CustomerStatus;
  followUpDate: Date | null;
  notes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toCustomerResponse = (customer: Customer): CustomerResponseDto => ({
  id: customer.id,
  name: customer.name,
  phone: customer.phone,
  email: customer.email,
  businessName: customer.businessName,
  gstNumber: customer.gstNumber,
  customerType: customer.customerType,
  address: customer.address,
  status: customer.status,
  followUpDate: customer.followUpDate,
  notes: customer.notes,
  createdById: customer.createdById,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});
