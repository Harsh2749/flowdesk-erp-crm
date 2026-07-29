import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiEyeOff, FiEye } from 'react-icons/fi';
import Card from '../../components/common/Card/Card';
import Table, { Column } from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Button from '../../components/common/Button/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import ProductFormModal from '../../components/product/ProductFormModal';
import { productApi, ProductPayload } from '../../api/product.api';
import { PaginationMeta, Product } from '../../types';
import { usePagination } from '../../hooks/usePagination';
import { useSearch } from '../../hooks/useSearch';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';
import { formatCurrency } from '../../utils/format';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deactivateSuggestion, setDeactivateSuggestion] = useState<Product | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  const { term, setTerm, debouncedTerm } = useSearch();
  const { page, limit, goToPage, resetPage } = usePagination();
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = user?.role === 'ADMIN' || user?.role === 'WAREHOUSE';
  const canDelete = user?.role === 'ADMIN';

  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    productApi
      .list({ page, limit, search: debouncedTerm || undefined })
      .then(({ data }) => {
        setProducts(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (payload: ProductPayload) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Editing an existing product never sends currentStock — that's only
        // adjustable via Inventory > Stock In/Out, so it's stripped here.
        const { currentStock, ...rest } = payload;
        void currentStock;
        await productApi.update(editingProduct.id, rest);
        toast.success('Product updated successfully');
      } else {
        await productApi.create(payload);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      fetchProducts();
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
      await productApi.delete(deleteTarget.id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        // Product has inventory movements and/or challan history — hard
        // delete is intentionally blocked (see product.service.ts). Offer
        // deactivation instead of just showing an error and dead-ending.
        const target = deleteTarget;
        setDeleteTarget(null);
        setDeactivateSuggestion(target);
      } else {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (product: Product, isActive: boolean) => {
    setIsTogglingActive(true);
    try {
      await productApi.setActive(product.id, isActive);
      toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully`);
      setDeactivateSuggestion(null);
      fetchProducts();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsTogglingActive(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      header: 'Product',
      accessor: (p) => (
        <span className={`fw-medium ${!p.isActive ? 'text-muted' : ''}`}>
          {p.name} {!p.isActive && <span className="badge bg-secondary ms-1">Inactive</span>}
        </span>
      ),
    },
    { header: 'SKU', accessor: (p) => p.sku },
    { header: 'Category', accessor: (p) => p.category },
    { header: 'Unit Price', accessor: (p) => formatCurrency(p.unitPrice) },
    {
      header: 'Stock',
      accessor: (p) => (
        <span className={p.isLowStock ? 'text-danger fw-semibold' : ''}>
          {p.currentStock} {p.isLowStock && <FiAlertTriangle className="ms-1" title="Low stock" />}
        </span>
      ),
    },
    { header: 'Min Stock', accessor: (p) => p.minStock },
    { header: 'Location', accessor: (p) => p.warehouseLocation || '—' },
    {
      header: 'Actions',
      accessor: (p) => (
        <div className="d-flex gap-2">
          {canWrite && (
            <button className="btn btn-sm btn-light" title="Edit" onClick={() => openEditForm(p)}>
              <FiEdit2 />
            </button>
          )}
          {canDelete && (
            <button
              className="btn btn-sm btn-light"
              title={p.isActive ? 'Deactivate' : 'Activate'}
              onClick={() => handleToggleActive(p, !p.isActive)}
            >
              {p.isActive ? <FiEyeOff /> : <FiEye />}
            </button>
          )}
          {canDelete && (
            <button
              className="btn btn-sm btn-light text-danger"
              title="Delete"
              onClick={() => setDeleteTarget(p)}
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
          <h1 className="merp-page-title">Products</h1>
          <p className="merp-page-subtitle mb-0">Manage your product catalog and stock levels</p>
        </div>
        {canWrite && (
          <Button icon={<FiPlus />} onClick={openCreateForm}>
            Add Product
          </Button>
        )}
      </div>

      <Card>
        <div className="mb-3">
          <SearchBar value={term} onChange={setTerm} placeholder="Search by name, SKU, category..." />
        </div>

        <Table
          columns={columns}
          data={products}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          emptyMessage="No products found"
        />

        {meta && <Pagination meta={meta} onPageChange={goToPage} />}
      </Card>

      <ProductFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        show={!!deactivateSuggestion}
        title="Can't Delete This Product"
        message={`"${deactivateSuggestion?.name}" has existing inventory movements or sales challan history, so it can't be permanently deleted — that would erase historical records. Deactivate it instead? It will stop showing up as an option in new stock movements or challans, but all history stays intact.`}
        confirmLabel="Deactivate"
        confirmVariant="warning"
        isLoading={isTogglingActive}
        onConfirm={() => deactivateSuggestion && handleToggleActive(deactivateSuggestion, false)}
        onCancel={() => setDeactivateSuggestion(null)}
      />
    </div>
  );
}