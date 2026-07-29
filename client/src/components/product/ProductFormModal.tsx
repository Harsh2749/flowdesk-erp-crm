import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../common/Modal/Modal';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import { Product } from '../../types';
import { ProductPayload } from '../../api/product.api';

interface ProductFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  initialData?: Product | null;
  isSubmitting: boolean;
}

export default function ProductFormModal({
  show,
  onHide,
  onSubmit,
  initialData,
  isSubmitting,
}: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductPayload>();

  useEffect(() => {
    if (show) {
      reset(
        initialData
          ? {
              name: initialData.name,
              sku: initialData.sku,
              category: initialData.category,
              unitPrice: initialData.unitPrice,
              currentStock: initialData.currentStock,
              minStock: initialData.minStock,
              warehouseLocation: initialData.warehouseLocation ?? '',
            }
          : { currentStock: 0, minStock: 0 }
      );
    }
  }, [show, initialData, reset]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      unitPrice: Number(values.unitPrice),
      currentStock: values.currentStock !== undefined ? Number(values.currentStock) : undefined,
      minStock: values.minStock !== undefined ? Number(values.minStock) : undefined,
    });
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      title={initialData ? 'Edit Product' : 'Add Product'}
      size="lg"
      footer={
        <>
          <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={submitHandler} isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Product'}
          </Button>
        </>
      }
    >
      <form onSubmit={submitHandler} noValidate>
        <div className="row">
          <div className="col-md-6">
            <Input
              label="Product Name"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="SKU / Code"
              error={errors.sku?.message}
              {...register('sku', { required: 'SKU is required' })}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Category"
              error={errors.category?.message}
              {...register('category', { required: 'Category is required' })}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Unit Price"
              type="number"
              step="0.01"
              error={errors.unitPrice?.message}
              {...register('unitPrice', { required: 'Unit price is required', min: 0.01 })}
            />
          </div>
          <div className="col-md-4">
            <Input
              label="Current Stock"
              type="number"
              disabled={!!initialData}
              title={initialData ? 'Use Inventory > Stock In/Out to adjust stock' : undefined}
              {...register('currentStock', { min: 0 })}
            />
          </div>
          <div className="col-md-4">
            <Input label="Minimum Stock" type="number" {...register('minStock', { min: 0 })} />
          </div>
          <div className="col-md-4">
            <Input label="Warehouse Location" {...register('warehouseLocation')} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
