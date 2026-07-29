import { followupRepository } from '../repositories/followup.repository';
import { customerRepository } from '../repositories/customer.repository';
import { FollowupResponseDto, toFollowupResponse } from '../dto/followup/followup.dto';
import { CreateFollowupInput, UpdateFollowupInput } from '../validators/followup.validator';
import { NotFoundError } from '../errors/AppError';
import { PaginatedResult, buildPaginationMeta, toSkipTake } from '../interfaces/pagination.interface';

export const followupService = {
  async create(input: CreateFollowupInput, createdById: string): Promise<FollowupResponseDto> {
    const customer = await customerRepository.findById(input.customerId);
    if (!customer) throw new NotFoundError('Customer not found');

    const followup = await followupRepository.create({ ...input, createdById });

    // Keep the customer's headline follow-up date in sync with the latest entry.
    await customerRepository.update(input.customerId, { followUpDate: input.followUpDate });

    return toFollowupResponse(followup);
  },

  async update(id: string, input: UpdateFollowupInput): Promise<FollowupResponseDto> {
    const existing = await followupRepository.findById(id);
    if (!existing) throw new NotFoundError('Follow-up not found');

    const followup = await followupRepository.update(id, input);

    if (input.followUpDate) {
      await customerRepository.update(existing.customerId, { followUpDate: input.followUpDate });
    }

    return toFollowupResponse(followup);
  },

  async listByCustomer(
    customerId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<FollowupResponseDto>> {
    const exists = await followupRepository.customerExists(customerId);
    if (!exists) throw new NotFoundError('Customer not found');

    const { skip, take } = toSkipTake(page, limit);
    const [followups, total] = await Promise.all([
      followupRepository.findByCustomer(customerId, skip, take),
      followupRepository.countByCustomer(customerId),
    ]);

    return {
      data: followups.map(toFollowupResponse),
      meta: buildPaginationMeta(page, limit, total),
    };
  },
};
