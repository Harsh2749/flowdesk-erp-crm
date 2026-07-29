import { useCallback, useEffect, useState } from 'react';
import { FiArrowDown, FiArrowUp, FiAlertTriangle } from 'react-icons/fi';
import { Tabs, Tab } from 'react-bootstrap';
import Card from '../../components/common/Card/Card';
import Table, { Column } from '../../components/common/Table/Table';
import Pagination from '../../components/common/Pagination/Pagination';
import Button from '../../components/common/Button/Button';
import StockMovementFormModal from '../../components/inventory/StockMovementFormModal';
import { inventoryApi, StockMovementPayload } from '../../api/inventory.api';
import { productApi } from '../../api/product.api';
import { InventoryMovement, PaginationMeta, Product } from '../../types';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';
import { formatDateTime } from '../../utils/format';

export default function InventoryOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [movementsMeta, setMovementsMeta] = useState<PaginationMeta | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'IN' | 'OUT' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { page, goToPage } = usePagination(1, 15);
  const { user } = useAuth();
  const toast = useToast();

  const canWrite = user?.role === 'ADMIN' || user?.role === 'WAREHOUSE';

  const fetchAll = useCallback(() => {
    setIsLoading(true);
    Promise.all([
      productApi.list({ page: 1, limit: 100 }),
      inventoryApi.listMovements(undefined, page, 15),
      inventoryApi.lowStock(1, 20),
    ])
      .then(([productsRes, movementsRes, lowStockRes]) => {
        setProducts(productsRes.data.data ?? []);
        setMovements(movementsRes.data.data ?? []);
        setMovementsMeta(movementsRes.data.meta ?? null);
        setLowStock(lowStockRes.data.data ?? []);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const productNameMap = new Map(products.map((p) => [p.id, p]));
  const activeProducts = products.filter((p) => p.isActive);

  const handleSubmit = async (payload: StockMovementPayload) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'IN') {
        await inventoryApi.stockIn(payload);
        toast.success('Stock added successfully');
      } else {
        await inventoryApi.stockOut(payload);
        toast.success('Stock removed successfully');
      }
      setModalMode(null);
      fetchAll();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const movementColumns: Column<InventoryMovement>[] = [
    {
      header: 'Product',
      accessor: (m) => productNameMap.get(m.productId)?.name || m.productId,
    },
    {
      header: 'Type',
      accessor: (m) => (
        <span className={m.movementType === 'IN' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
          {m.movementType === 'IN' ? <FiArrowUp className="me-1" /> : <FiArrowDown className="me-1" />}
          {m.movementType}
        </span>
      ),
    },
    { header: 'Quantity', accessor: (m) => m.quantity },
    { header: 'Reason', accessor: (m) => m.reason },
    { header: 'Date', accessor: (m) => formatDateTime(m.createdAt) },
  ];

  const lowStockColumns: Column<Product>[] = [
    { header: 'Product', accessor: (p) => p.name },
    { header: 'SKU', accessor: (p) => p.sku },
    { header: 'Current Stock', accessor: (p) => <span className="text-danger fw-semibold">{p.currentStock}</span> },
    { header: 'Min Stock', accessor: (p) => p.minStock },
    { header: 'Location', accessor: (p) => p.warehouseLocation || '—' },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="merp-page-title">Inventory</h1>
          <p className="merp-page-subtitle mb-0">Stock movements and low-stock alerts</p>
        </div>
        {canWrite && (
          <div className="d-flex gap-2">
            <Button variant="success" icon={<FiArrowUp />} onClick={() => setModalMode('IN')}>
              Stock In
            </Button>
            <Button variant="warning" icon={<FiArrowDown />} onClick={() => setModalMode('OUT')}>
              Stock Out
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <FiAlertTriangle className="text-danger" />
          <h6 className="mb-0 fw-semibold">Low Stock Alerts ({lowStock.length})</h6>
        </div>
        <Table
          columns={lowStockColumns}
          data={lowStock}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          emptyMessage="No products are currently low on stock"
        />
      </Card>

      <Card>
        <Tabs defaultActiveKey="movements" className="mb-3">
          <Tab eventKey="movements" title="Movement History">
            <Table
              columns={movementColumns}
              data={movements}
              keyExtractor={(m) => m.id}
              isLoading={isLoading}
              emptyMessage="No stock movements recorded yet"
            />
            {movementsMeta && <Pagination meta={movementsMeta} onPageChange={goToPage} />}
          </Tab>
        </Tabs>
      </Card>

      <StockMovementFormModal
        show={modalMode !== null}
        onHide={() => setModalMode(null)}
        onSubmit={handleSubmit}
        products={activeProducts}
        mode={modalMode ?? 'IN'}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}