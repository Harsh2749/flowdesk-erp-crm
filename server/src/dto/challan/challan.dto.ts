import { Challan, ChallanItem, ChallanStatus } from '@prisma/client';

export interface ChallanItemResponseDto {
  id: string;
  productId: string;
  productNameSnapshot: string;
  productSkuSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
}

export interface ChallanResponseDto {
  id: string;
  challanNumber: string;
  customerId: string;
  totalQuantity: number;
  status: ChallanStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  items: ChallanItemResponseDto[];
}

type ChallanWithItems = Challan & { items: ChallanItem[] };

export const toChallanResponse = (challan: ChallanWithItems): ChallanResponseDto => ({
  id: challan.id,
  challanNumber: challan.challanNumber,
  customerId: challan.customerId,
  totalQuantity: challan.totalQuantity,
  status: challan.status,
  createdById: challan.createdById,
  createdAt: challan.createdAt,
  updatedAt: challan.updatedAt,
  items: challan.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productNameSnapshot: item.productNameSnapshot,
    productSkuSnapshot: item.productSkuSnapshot,
    unitPriceSnapshot: Number(item.unitPriceSnapshot),
    quantity: item.quantity,
  })),
});
