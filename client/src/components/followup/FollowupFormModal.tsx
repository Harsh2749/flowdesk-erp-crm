import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../common/Modal/Modal';
import Button from '../../components/common/Button/Button';
import { Followup } from '../../types';
import { toDateInputValue } from '../../utils/format';

interface FollowupFormValues {
  note: string;
  followUpDate: string;
}

interface FollowupFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (values: FollowupFormValues) => Promise<void>;
  initialData?: Followup | null;
  isSubmitting: boolean;
}

export default function FollowupFormModal({
  show,
  onHide,
  onSubmit,
  initialData,
  isSubmitting,
}: FollowupFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FollowupFormValues>();

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? { note: initialData.note, followUpDate: toDateInputValue(initialData.followUpDate) }
          : { followUpDate: toDateInputValue(new Date()) }
      );
    }
  }, [show, initialData, reset]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      title={initialData ? 'Edit Follow-up' : 'Add Follow-up'}
      footer={
        <>
          <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={submitHandler} isLoading={isSubmitting}>
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={submitHandler} noValidate>
        <div className="mb-3">
          <label className="form-label">Follow-up Date</label>
          <input
            type="date"
            className={`form-control ${errors.followUpDate ? 'is-invalid' : ''}`}
            {...register('followUpDate', { required: 'Date is required' })}
          />
          {errors.followUpDate && <div className="invalid-feedback">{errors.followUpDate.message}</div>}
        </div>
        <div className="mb-1">
          <label className="form-label">Note</label>
          <textarea
            className={`form-control ${errors.note ? 'is-invalid' : ''}`}
            rows={3}
            {...register('note', { required: 'Note is required' })}
          />
          {errors.note && <div className="invalid-feedback">{errors.note.message}</div>}
        </div>
      </form>
    </Modal>
  );
}
