import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Card from '../../components/common/Card/Card';
import Table, { Column } from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Select from '../../components/common/Select/Select';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import CustomerFormModal from '../../components/customer/CustomerFormModal';
import { customerApi, CustomerPayload } from '../../api/customer.api';
import { Customer, CustomerStatus, PaginationMeta } from '../../types';
import { CUSTOMER_STATUSES } from '../../constants';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';
import { formatDate } from '../../utils/format';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { term, setTerm, debouncedTerm } = useSearch();
  const { page, limit, goToPage, resetPage } = usePagination();
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = user?.role === 'ADMIN' || user?.role === 'SALES';
  const canDelete = user?.role === 'ADMIN';

  const fetchCustomers = useCallback(() => {
    setIsLoading(true);
    customerApi
      .list({ page, limit, search: debouncedTerm || undefined, status: statusFilter || undefined })
      .then(({ data }) => {
        setCustomers(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedTerm, statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm, statusFilter]);

  const openCreateForm = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleFormSubmit = async (payload: CustomerPayload) => {
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        await customerApi.update(editingCustomer.id, payload);
        toast.success('Customer updated successfully');
      } else {
        await customerApi.create(payload);
        toast.success('Customer created successfully');
      }
      setShowForm(false);
      fetchCustomers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await customerApi.delete(deleteTarget.id);
      toast.success('Customer deleted successfully');
      setDeleteTarget(null);
      fetchCustomers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Customer>[] = [
    { header: 'Business', accessor: (c) => <span className="fw-medium">{c.businessName}</span> },
    { header: 'Contact', accessor: (c) => c.name },
    { header: 'Phone', accessor: (c) => c.phone },
    { header: 'Type', accessor: (c) => c.customerType },
    { header: 'Status', accessor: (c) => <Badge status={c.status} /> },
    { header: 'Follow-up', accessor: (c) => formatDate(c.followUpDate) },
    {
      header: 'Actions',
      accessor: (c) => (
        <div className="d-flex gap-2">
          <Link to={`/customers/${c.id}`} className="btn btn-sm btn-light" title="View">
            <FiEye />
          </Link>
          {canWrite && (
            <button className="btn btn-sm btn-light" title="Edit" onClick={() => openEditForm(c)}>
              <FiEdit2 />
            </button>
          )}
          {canDelete && (
            <button
              className="btn btn-sm btn-light text-danger"
              title="Delete"
              onClick={() => setDeleteTarget(c)}
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="merp-page-title">Customers</h1>
          <p className="merp-page-subtitle mb-0">Manage your customer relationships</p>
        </div>
        {canWrite && (
          <Button icon={<FiPlus />} onClick={openCreateForm}>
            Add Customer
          </Button>
        )}
      </div>

      <Card>
        <div className="d-flex flex-wrap gap-2 justify-content-between mb-3">
          <SearchBar value={term} onChange={setTerm} placeholder="Search by name, phone, GST..." />
          <div style={{ minWidth: 180 }}>
            <Select
              options={CUSTOMER_STATUSES.map((s) => ({ label: s, value: s }))}
              placeholder="All statuses"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CustomerStatus | '')}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={customers}
          keyExtractor={(c) => c.id}
          isLoading={isLoading}
          emptyMessage="No customers found"
        />

        {meta && <Pagination meta={meta} onPageChange={goToPage} />}
      </Card>

      <CustomerFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.businessName}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
