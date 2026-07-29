import { Pagination as BsPagination } from 'react-bootstrap';
import { PaginationMeta } from '../../../types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

  return (
    <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
      <span className="text-muted small">
        Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of{' '}
        {meta.total}
      </span>
      <BsPagination className="mb-0">
        <BsPagination.Prev
          disabled={meta.page === 1}
          onClick={() => onPageChange(meta.page - 1)}
        />
        {pages.map((p) => (
          <BsPagination.Item key={p} active={p === meta.page} onClick={() => onPageChange(p)}>
            {p}
          </BsPagination.Item>
        ))}
        <BsPagination.Next
          disabled={meta.page === meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        />
      </BsPagination>
    </div>
  );
}
