import { InventoryMovement, MovementType } from '@prisma/client';

export interface InventoryMovementResponseDto {
  id: string;
  productId: string;
  quantity: number;
  movementType: MovementType;
  reason: string;
  createdById: string;
  createdAt: Date;
}

export const toMovementResponse = (movement: InventoryMovement): InventoryMovementResponseDto => ({
  id: movement.id,
  productId: movement.productId,
  quantity: movement.quantity,
  movementType: movement.movementType,
  reason: movement.reason,
  createdById: movement.createdById,
  createdAt: movement.createdAt,
});
