import { buildPaginationMeta, toSkipTake } from '../interfaces/pagination.interface';

describe('pagination.interface', () => {
  describe('buildPaginationMeta', () => {
    it('computes totalPages correctly for an exact multiple', () => {
      expect(buildPaginationMeta(1, 10, 30)).toEqual({
        page: 1,
        limit: 10,
        total: 30,
        totalPages: 3,
      });
    });

    it('rounds totalPages up for a partial last page', () => {
      expect(buildPaginationMeta(2, 10, 25)).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
    });

    it('never returns fewer than 1 total page, even when total is 0', () => {
      expect(buildPaginationMeta(1, 10, 0).totalPages).toBe(1);
    });
  });

  describe('toSkipTake', () => {
    it('returns skip=0 for page 1', () => {
      expect(toSkipTake(1, 10)).toEqual({ skip: 0, take: 10 });
    });

    it('computes skip correctly for later pages', () => {
      expect(toSkipTake(3, 20)).toEqual({ skip: 40, take: 20 });
    });
  });
});
