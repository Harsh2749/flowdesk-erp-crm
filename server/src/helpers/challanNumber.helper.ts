import { prisma } from '../config/prisma';

/**
 * Generates the next challan number in the format CH-YYYY-000001.
 * Scoped per calendar year so the sequence resets annually.
 *
 * NOTE: this counts existing rows for the year rather than using a separate
 * counter table, so it must always be called from within the same
 * transaction that creates the Challan row to avoid a race between the
 * count and the insert (see challan.service.ts createChallan).
 */
export const generateChallanNumber = async (
  tx: Pick<typeof prisma, 'challan'>
): Promise<string> => {
  const year = new Date().getFullYear();
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const startOfNextYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  const countThisYear = await tx.challan.count({
    where: {
      createdAt: {
        gte: startOfYear,
        lt: startOfNextYear,
      },
    },
  });

  const sequence = String(countThisYear + 1).padStart(6, '0');
  return `CH-${year}-${sequence}`;
};
