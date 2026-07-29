import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Loader from '../../components/common/Loader/Loader';
import FollowupFormModal from '../../components/followup/FollowupFormModal';
import FollowupHistory from '../../components/followup/FollowupHistory';
import { customerApi } from '../../api/customer.api';
import { followupApi, FollowupPayload } from '../../api/followup.api';
import { Customer, Followup } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';
import { formatDate } from '../../utils/format';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFollowup, setEditingFollowup] = useState<Followup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const toast = useToast();
  const canWrite = user?.role === 'ADMIN' || user?.role === 'SALES';

  const fetchAll = useCallback(() => {
    if (!id) return;
    setIsLoading(true);
    Promise.all([customerApi.getById(id), followupApi.listByCustomer(id, 1, 50)])
      .then(([customerRes, followupRes]) => {
        setCustomer(customerRes.data.data ?? null);
        setFollowups(followupRes.data.data ?? []);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreateFollowup = () => {
    setEditingFollowup(null);
    setShowForm(true);
  };

  const openEditFollowup = (followup: Followup) => {
    setEditingFollowup(followup);
    setShowForm(true);
  };

  const handleFollowupSubmit = async (values: { note: string; followUpDate: string }) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      if (editingFollowup) {
        await followupApi.update(editingFollowup.id, values);
        toast.success('Follow-up updated successfully');
      } else {
        const payload: FollowupPayload = { customerId: id, ...values };
        await followupApi.create(payload);
        toast.success('Follow-up added successfully');
      }
      setShowForm(false);
      fetchAll();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!customer) return <p>Customer not found.</p>;

  return (
    <div>
      <Link to="/customers" className="text-muted small d-inline-flex align-items-center gap-1 mb-3">
        <FiArrowLeft /> Back to Customers
      </Link>

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="merp-page-title mb-1">{customer.businessName}</h1>
          <Badge status={customer.status} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <Card title="Customer Details">
            <dl className="row mb-0">
              <dt className="col-5 text-muted fw-normal">Contact</dt>
              <dd className="col-7">{customer.name}</dd>
              <dt className="col-5 text-muted fw-normal">Phone</dt>
              <dd className="col-7">{customer.phone}</dd>
              <dt className="col-5 text-muted fw-normal">Email</dt>
              <dd className="col-7">{customer.email || '—'}</dd>
              <dt className="col-5 text-muted fw-normal">GST Number</dt>
              <dd className="col-7">{customer.gstNumber || '—'}</dd>
              <dt className="col-5 text-muted fw-normal">Type</dt>
              <dd className="col-7">{customer.customerType}</dd>
              <dt className="col-5 text-muted fw-normal">Address</dt>
              <dd className="col-7">{customer.address || '—'}</dd>
              <dt className="col-5 text-muted fw-normal">Next Follow-up</dt>
              <dd className="col-7">{formatDate(customer.followUpDate)}</dd>
              <dt className="col-5 text-muted fw-normal">Notes</dt>
              <dd className="col-7">{customer.notes || '—'}</dd>
            </dl>
          </Card>
        </div>

        <div className="col-lg-7">
          <Card
            title="Follow-up History"
            actions={
              canWrite && (
                <Button icon={<FiPlus />} onClick={openCreateFollowup}>
                  Add Follow-up
                </Button>
              )
            }
          >
            <FollowupHistory followups={followups} onEdit={openEditFollowup} canEdit={canWrite} />
          </Card>
        </div>
      </div>

      <FollowupFormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFollowupSubmit}
        initialData={editingFollowup}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
