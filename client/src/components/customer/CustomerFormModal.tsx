import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';
import Button from '../../components/common/Button/Button';
import { CUSTOMER_STATUSES, CUSTOMER_TYPES } from '../../constants';
import { Customer } from '../../types';
import { CustomerPayload } from '../../api/customer.api';
import { toDateInputValue } from '../../utils/format';

interface CustomerFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (payload: CustomerPayload) => Promise<void>;
  initialData?: Customer | null;
  isSubmitting: boolean;
}

export default function CustomerFormModal({
  show,
  onHide,
  onSubmit,
  initialData,
  isSubmitting,
}: CustomerFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerPayload>();

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? {
              name: initialData.name,
              phone: initialData.phone,
              email: initialData.email ?? '',
              businessName: initialData.businessName,
              gstNumber: initialData.gstNumber ?? '',
              customerType: initialData.customerType,
              address: initialData.address ?? '',
              status: initialData.status,
              followUpDate: toDateInputValue(initialData.followUpDate),
              notes: initialData.notes ?? '',
            }
          : { customerType: 'RETAIL', status: 'LEAD' }
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
      title={initialData ? 'Edit Customer' : 'Add Customer'}
      size="lg"
      footer={
        <>
          <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={submitHandler} isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Customer'}
          </Button>
        </>
      }
    >
      <form onSubmit={submitHandler} noValidate>
        <div className="row">
          <div className="col-md-6">
            <Input
              label="Customer Name"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Business Name"
              error={errors.businessName?.message}
              {...register('businessName', { required: 'Business name is required' })}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Mobile Number"
              error={errors.phone?.message}
              {...register('phone', { required: 'Phone is required' })}
            />
          </div>
          <div className="col-md-6">
            <Input label="Email" type="email" {...register('email')} />
          </div>
          <div className="col-md-6">
            <Input label="GST Number (optional)" {...register('gstNumber')} />
          </div>
          <div className="col-md-6">
            <Select
              label="Customer Type"
              error={errors.customerType?.message}
              options={CUSTOMER_TYPES.map((t) => ({ label: t, value: t }))}
              {...register('customerType', { required: true })}
            />
          </div>
          <div className="col-md-6">
            <Select
              label="Status"
              options={CUSTOMER_STATUSES.map((s) => ({ label: s, value: s }))}
              {...register('status')}
            />
          </div>
          <div className="col-md-6">
            <Input label="Follow-up Date" type="date" {...register('followUpDate')} />
          </div>
          <div className="col-12">
            <Input label="Address" {...register('address')} />
          </div>
          <div className="col-12">
            <label className="form-label">Notes</label>
            <textarea className="form-control" rows={3} {...register('notes')} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
