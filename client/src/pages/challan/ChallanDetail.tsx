import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Loader from '../../components/common/Loader/Loader';
import Table, { Column } from '../../components/common/Table/Table';
import ChallanStatusActions from '../../components/challan/ChallanStatusActions';
import { challanApi } from '../../api/challan.api';
import { customerApi } from '../../api/customer.api';
import { Challan, ChallanItem, ChallanStatus, Customer } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function ChallanDetail() {
  const { id } = useParams<{ id: string }>();
  const [challan, setChallan] = useState<Challan | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const toast = useToast();
  const canChangeStatus = user?.role === 'ADMIN' || user?.role === 'SALES' || user?.role === 'WAREHOUSE';

  const fetchAll = useCallback(() => {
    if (!id) return;
    setIsLoading(true);
    challanApi
      .getById(id)
      .then(async ({ data }) => {
        const c = data.data ?? null;
        setChallan(c);
        if (c) {
          const custRes = await customerApi.getById(c.customerId);
          setCustomer(custRes.data.data ?? null);
        }
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleChangeStatus = async (status: ChallanStatus) => {
    if (!id) return;
    try {
      await challanApi.changeStatus(id, status);
      toast.success(`Challan ${status.toLowerCase()} successfully`);
      fetchAll();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) return <Loader />;
  if (!challan) return <p>Challan not found.</p>;

  const grandTotal = challan.items.reduce((sum, item) => sum + item.unitPriceSnapshot * item.quantity, 0);

  const itemColumns: Column<ChallanItem>[] = [
    { header: 'Product', accessor: (i) => i.productNameSnapshot },
    { header: 'SKU', accessor: (i) => i.productSkuSnapshot },
    { header: 'Unit Price', accessor: (i) => formatCurrency(i.unitPriceSnapshot) },
    { header: 'Quantity', accessor: (i) => i.quantity },
    { header: 'Subtotal', accessor: (i) => formatCurrency(i.unitPriceSnapshot * i.quantity) },
  ];

  return (
    <div>
      <Link to="/challans" className="text-muted small d-inline-flex align-items-center gap-1 mb-3">
        <FiArrowLeft /> Back to Challans
      </Link>

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="merp-page-title mb-1">{challan.challanNumber}</h1>
          <Badge status={challan.status} />
        </div>
        <ChallanStatusActions
          challan={challan}
          canChangeStatus={canChangeStatus}
          onChangeStatus={handleChangeStatus}
        />
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <Card title="Challan Info">
            <dl className="row mb-0">
              <dt className="col-5 text-muted fw-normal">Customer</dt>
              <dd className="col-7">{customer?.businessName || '—'}</dd>
              <dt className="col-5 text-muted fw-normal">Status</dt>
              <dd className="col-7">
                <Badge status={challan.status} />
              </dd>
              <dt className="col-5 text-muted fw-normal">Total Qty</dt>
              <dd className="col-7">{challan.totalQuantity}</dd>
              <dt className="col-5 text-muted fw-normal">Created</dt>
              <dd className="col-7">{formatDateTime(challan.createdAt)}</dd>
              <dt className="col-5 text-muted fw-normal">Updated</dt>
              <dd className="col-7">{formatDateTime(challan.updatedAt)}</dd>
            </dl>
          </Card>
        </div>

        <div className="col-lg-8">
          <Card title="Line Items">
            <Table columns={itemColumns} data={challan.items} keyExtractor={(i) => i.id} />
            <div className="d-flex justify-content-end mt-3 pt-3 border-top">
              <div className="text-end">
                <div className="text-muted small">Grand Total</div>
                <div className="fw-bold fs-5">{formatCurrency(grandTotal)}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
