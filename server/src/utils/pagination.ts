import { PaginationParams } from '../interfaces/pagination.interface';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const parsePagination = (query: Record<string, unknown>): PaginationParams => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const rawLimit = Number(query.limit) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
  return { page, limit };
};
