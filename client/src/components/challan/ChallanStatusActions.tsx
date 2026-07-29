import { useState } from 'react';
import Button from '../common/Button/Button';
import ConfirmDialog from '../common/ConfirmDialog/ConfirmDialog';
import { Challan, ChallanStatus } from '../../types';

interface ChallanStatusActionsProps {
  challan: Challan;
  canChangeStatus: boolean;
  onChangeStatus: (status: ChallanStatus) => Promise<void>;
}

export default function ChallanStatusActions({
  challan,
  canChangeStatus,
  onChangeStatus,
}: ChallanStatusActionsProps) {
  const [pendingStatus, setPendingStatus] = useState<ChallanStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canChangeStatus || challan.status === 'CANCELLED') return null;

  const handleConfirm = async () => {
    if (!pendingStatus) return;
    setIsSubmitting(true);
    try {
      await onChangeStatus(pendingStatus);
      setPendingStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex gap-2">
        {challan.status === 'DRAFT' && (
          <Button variant="success" onClick={() => setPendingStatus('CONFIRMED')}>
            Confirm Challan
          </Button>
        )}
        <Button variant="outline-danger" onClick={() => setPendingStatus('CANCELLED')}>
          Cancel Challan
        </Button>
      </div>

      <ConfirmDialog
        show={!!pendingStatus}
        title={pendingStatus === 'CONFIRMED' ? 'Confirm Challan' : 'Cancel Challan'}
        message={
          pendingStatus === 'CONFIRMED'
            ? 'This will reduce stock for all items in this challan. Continue?'
            : challan.status === 'CONFIRMED'
              ? 'This will restore stock for all items in this challan. Continue?'
              : 'Are you sure you want to cancel this draft challan?'
        }
        confirmLabel={pendingStatus === 'CONFIRMED' ? 'Confirm' : 'Cancel Challan'}
        confirmVariant={pendingStatus === 'CONFIRMED' ? 'success' : 'danger'}
        isLoading={isSubmitting}
        onConfirm={handleConfirm}
        onCancel={() => setPendingStatus(null)}
      />
    </>
  );
}
