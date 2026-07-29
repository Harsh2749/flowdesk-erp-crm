import { customerRepository, CustomerListFilters } from '../repositories/customer.repository';
import { CustomerResponseDto, toCustomerResponse } from '../dto/customer/customer.dto';
import { CreateCustomerInput, UpdateCustomerInput } from '../validators/customer.validator';
import { NotFoundError } from '../errors/AppError';
import { PaginatedResult, buildPaginationMeta, toSkipTake } from '../interfaces/pagination.interface';

export const customerService = {
  async create(input: CreateCustomerInput, createdById: string): Promise<CustomerResponseDto> {
    const customer = await customerRepository.create({ ...input, createdById });
    return toCustomerResponse(customer);
  },

  async update(id: string, input: UpdateCustomerInput): Promise<CustomerResponseDto> {
    const existing = await customerRepository.findById(id);
    if (!existing) throw new NotFoundError('Customer not found');

    const customer = await customerRepository.update(id, input);
    return toCustomerResponse(customer);
  },

  async getById(id: string): Promise<CustomerResponseDto> {
    const customer = await customerRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer not found');
    return toCustomerResponse(customer);
  },

  async delete(id: string): Promise<void> {
    const existing = await customerRepository.findById(id);
    if (!existing) throw new NotFoundError('Customer not found');
    await customerRepository.delete(id);
  },

  async list(
    filters: CustomerListFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResult<CustomerResponseDto>> {
    const where = customerRepository.buildWhere(filters);
    const { skip, take } = toSkipTake(page, limit);

    const [customers, total] = await Promise.all([
      customerRepository.findMany(where, skip, take),
      customerRepository.count(where),
    ]);

    return {
      data: customers.map(toCustomerResponse),
      meta: buildPaginationMeta(page, limit, total),
    };
  },
};
