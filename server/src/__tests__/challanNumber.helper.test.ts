import { generateChallanNumber } from '../helpers/challanNumber.helper';

describe('generateChallanNumber', () => {
  it('produces a zero-padded, year-scoped sequential number', async () => {
    const year = new Date().getFullYear();
    const tx = { challan: { count: jest.fn().mockResolvedValue(4) } };

    const result = await generateChallanNumber(tx as never);

    expect(result).toBe(`CH-${year}-000005`);
    expect(tx.challan.count).toHaveBeenCalledTimes(1);
  });

  it('starts the sequence at 000001 when no challans exist yet this year', async () => {
    const year = new Date().getFullYear();
    const tx = { challan: { count: jest.fn().mockResolvedValue(0) } };

    const result = await generateChallanNumber(tx as never);

    expect(result).toBe(`CH-${year}-000001`);
  });
});
