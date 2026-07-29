import { Followup } from '@prisma/client';

export interface FollowupResponseDto {
  id: string;
  customerId: string;
  note: string;
  followUpDate: Date;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toFollowupResponse = (followup: Followup): FollowupResponseDto => ({
  id: followup.id,
  customerId: followup.customerId,
  note: followup.note,
  followUpDate: followup.followUpDate,
  createdById: followup.createdById,
  createdAt: followup.createdAt,
  updatedAt: followup.updatedAt,
});
