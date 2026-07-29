import { ReactNode } from 'react';
import { Table as BsTable } from 'react-bootstrap';
import Loader from '../Loader/Loader';
import EmptyState from '../EmptyState/EmptyState';

export interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyMessage = 'No records found',
}: TableProps<T>) {
  if (isLoading) return <Loader />;
  if (!data.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="table-responsive">
      <BsTable className="merp-table align-middle mb-0" hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)}>
              {columns.map((col) => (
                <td key={col.header} className={col.className}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </BsTable>
    </div>
  );
}
