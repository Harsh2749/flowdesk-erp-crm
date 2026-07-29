import { ChallanStatus, CustomerStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface DashboardSummaryDto {
  customers: {
    total: number;
    leads: number;
    active: number;
  };
  products: {
    total: number;
    lowStock: number;
  };
  challans: {
    draft: number;
    confirmed: number;
    cancelled: number;
  };
  followupsDueToday: number;
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummaryDto> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [
      totalCustomers,
      leadCustomers,
      activeCustomers,
      totalProducts,
      lowStockProducts,
      draftChallans,
      confirmedChallans,
      cancelledChallans,
      followupsDueToday,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: CustomerStatus.LEAD } }),
      prisma.customer.count({ where: { status: CustomerStatus.ACTIVE } }),
      prisma.product.count(),
      prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint as count FROM products WHERE "currentStock" <= "minStock"
      `.then((rows) => Number(rows[0]?.count ?? 0)),
      prisma.challan.count({ where: { status: ChallanStatus.DRAFT } }),
      prisma.challan.count({ where: { status: ChallanStatus.CONFIRMED } }),
      prisma.challan.count({ where: { status: ChallanStatus.CANCELLED } }),
      prisma.followup.count({
        where: { followUpDate: { gte: startOfToday, lt: startOfTomorrow } },
      }),
    ]);

    return {
      customers: { total: totalCustomers, leads: leadCustomers, active: activeCustomers },
      products: { total: totalProducts, lowStock: lowStockProducts },
      challans: { draft: draftChallans, confirmed: confirmedChallans, cancelled: cancelledChallans },
      followupsDueToday,
    };
  },
};
