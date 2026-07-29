import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye } from 'react-icons/fi';
import Card from '../../components/common/Card/Card';
import Table, { Column } from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import Select from '../../components/common/Select/Select';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import ChallanFormModal from '../../components/challan/ChallanFormModal';
import { challanApi, CreateChallanPayload } from '../../api/challan.api';
import { customerApi } from '../../api/customer.api';
import { productApi } from '../../api/product.api';
import { Challan, ChallanStatus, Customer, PaginationMeta, Product } from '../../types';
import { CHALLAN_STATUSES } from '../../constants';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';
import { formatDate } from '../../utils/format';

export default function ChallanList() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ChallanStatus | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { page, limit, goToPage, resetPage } = usePagination();
  const { user } = useAuth();
  const toast = useToast();

  const canCreate = user?.role === 'ADMIN' || user?.role === 'SALES';

  const customerById = new Map(customers.map((c) => [c.id, c]));

  const fetchChallans = useCallback(() => {
    setIsLoading(true);
    challanApi
      .list({ page, limit, status: statusFilter || undefined })
      .then(({ data }) => {
        setChallans(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchChallans();
  }, [fetchChallans]);

  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    Promise.all([
      customerApi.list({ page: 1, limit: 100 }),
      productApi.list({ page: 1, limit: 100, isActive: true }),
    ])
      .then(([customerRes, productRes]) => {
        setCustomers(customerRes.data.data ?? []);
        setProducts(productRes.data.data ?? []);
      })
      .catch((error) => toast.error(getErrorMessage(error)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (payload: CreateChallanPayload) => {
    setIsSubmitting(true);
    try {
      await challanApi.create(payload);
      toast.success(`Challan ${payload.status === 'CONFIRMED' ? 'confirmed' : 'saved as draft'} successfully`);
      setShowForm(false);
      fetchChallans();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Challan>[] = [
    { header: 'Challan #', accessor: (c) => <span className="fw-medium">{c.challanNumber}</span> },
    { header: 'Customer', accessor: (c) => customerById.get(c.customerId)?.businessName || '—' },
    { header: 'Items', accessor: (c) => c.items.length },
    { header: 'Total Qty', accessor: (c) => c.totalQuantity },
    { header: 'Status', accessor: (c) => <Badge status={c.status} /> },
    { header: 'Created', accessor: (c) => formatDate(c.createdAt) },
    {
      header: 'Actions',
      accessor: (c) => (
        <Link to={`/challans/${c.id}`} className="btn btn-sm btn-light" title="View">
          <FiEye />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="merp-page-title">Sales Challans</h1>
          <p className="merp-page-subtitle mb-0">Create and track sales challans</p>
        </div>
        {canCreate && (
          <Button icon={<FiPlus />} onClick={() => setShowForm(true)}>
            New Challan
          </Button>
        )}
      </div>

      <Card>
        <div className="mb-3" style={{ maxWidth: 220 }}>
          <Select
            options={CHALLAN_STATUSES.map((s) => ({ label: s, value: s }))}
            placeholder="All statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ChallanStatus | '')}
          />
        </div>

        <Table
          columns={columns}
          data={challans}
          keyExtractor={(c) => c.id}
          isLoading={isLoading}
          emptyMessage="No challans found"
        />

        {meta && <Pagination meta={meta} onPageChange={goToPage} />}
      </Card>

      <ChallanFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleCreate}
        customers={customers}
        products={products}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}