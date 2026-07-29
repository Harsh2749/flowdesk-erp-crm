import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../common/Modal/Modal';
import Input from '../common/Input/Input';
import Select from '../common/Select/Select';
import Button from '../common/Button/Button';
import { Product } from '../../types';
import { StockMovementPayload } from '../../api/inventory.api';

interface StockMovementFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (payload: StockMovementPayload) => Promise<void>;
  products: Product[];
  mode: 'IN' | 'OUT';
  isSubmitting: boolean;
}

export default function StockMovementFormModal({
  show,
  onHide,
  onSubmit,
  products,
  mode,
  isSubmitting,
}: StockMovementFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockMovementPayload>();

  useEffect(() => {
    if (show) reset({ productId: '', quantity: 1, reason: '' });
  }, [show, reset]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({ ...values, quantity: Number(values.quantity) });
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      title={mode === 'IN' ? 'Stock In' : 'Stock Out'}
      footer={
        <>
          <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={mode === 'IN' ? 'success' : 'warning'}
            onClick={submitHandler}
            isLoading={isSubmitting}
          >
            {mode === 'IN' ? 'Add Stock' : 'Remove Stock'}
          </Button>
        </>
      }
    >
      <form onSubmit={submitHandler} noValidate>
        <Select
          label="Product"
          error={errors.productId?.message}
          placeholder="Select a product"
          options={products.map((p) => ({ label: `${p.name} (${p.sku}) — ${p.currentStock} in stock`, value: p.id }))}
          {...register('productId', { required: 'Please select a product' })}
        />
        <Input
          label="Quantity"
          type="number"
          min={1}
          error={errors.quantity?.message}
          {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Must be at least 1' } })}
        />
        <Input
          label="Reason"
          placeholder={mode === 'IN' ? 'e.g. Purchase order received' : 'e.g. Damaged goods, sample'}
          error={errors.reason?.message}
          {...register('reason', { required: 'Reason is required' })}
        />
      </form>
    </Modal>
  );
}
