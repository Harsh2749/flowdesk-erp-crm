import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Modal from '../common/Modal/Modal';
import Select from '../common/Select/Select';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import { Customer, Product } from '../../types';
import { CreateChallanPayload } from '../../api/challan.api';
import { formatCurrency } from '../../utils/format';

interface ChallanFormValues {
  customerId: string;
  items: { productId: string; quantity: number }[];
}

interface ChallanFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (payload: CreateChallanPayload) => Promise<void>;
  customers: Customer[];
  products: Product[];
  isSubmitting: boolean;
}

export default function ChallanFormModal({
  show,
  onHide,
  onSubmit,
  customers,
  products,
  isSubmitting,
}: ChallanFormModalProps) {
  const [saveAsDraft, setSaveAsDraft] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChallanFormValues>({
    defaultValues: { customerId: '', items: [{ productId: '', quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  useEffect(() => {
    if (show) {
      reset({ customerId: '', items: [{ productId: '', quantity: 1 }] });
      setSaveAsDraft(true);
    }
  }, [show, reset]);

  const productById = new Map(products.map((p) => [p.id, p]));

  const total = watchedItems.reduce((sum, item) => {
    const product = productById.get(item.productId);
    return sum + (product ? Number(product.unitPrice) * Number(item.quantity || 0) : 0);
  }, 0);

  const submitHandler = (statusOverride: 'DRAFT' | 'CONFIRMED') =>
    handleSubmit(async (values) => {
      await onSubmit({
        customerId: values.customerId,
        items: values.items.map((i) => ({ productId: i.productId, quantity: Number(i.quantity) })),
        status: statusOverride,
      });
    });

  return (
    <Modal
      show={show}
      onHide={onHide}
      title="Create Sales Challan"
      size="lg"
      footer={
        <>
          <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="outline-primary"
            onClick={submitHandler('DRAFT')}
            isLoading={isSubmitting && saveAsDraft}
            onMouseDown={() => setSaveAsDraft(true)}
          >
            Save as Draft
          </Button>
          <Button
            onClick={submitHandler('CONFIRMED')}
            isLoading={isSubmitting && !saveAsDraft}
            onMouseDown={() => setSaveAsDraft(false)}
          >
            Confirm &amp; Reduce Stock
          </Button>
        </>
      }
    >
      <form noValidate>
        <Select
          label="Customer"
          placeholder="Select a customer"
          error={errors.customerId?.message}
          options={customers.map((c) => ({ label: `${c.businessName} — ${c.name}`, value: c.id }))}
          {...register('customerId', { required: 'Please select a customer' })}
        />

        <label className="form-label">Products</label>
        <div className="d-flex flex-column gap-2 mb-3">
          {fields.map((field, index) => (
            <div key={field.id} className="row g-2 align-items-start">
              <div className="col-6">
                <Controller
                  control={control}
                  name={`items.${index}.productId`}
                  rules={{ required: true }}
                  render={({ field: f }) => (
                    <Select
                      placeholder="Select a product"
                      options={products.map((p) => ({
                        label: `${p.name} (${p.sku}) — ${p.currentStock} in stock`,
                        value: p.id,
                      }))}
                      {...f}
                    />
                  )}
                />
              </div>
              <div className="col-4">
                <Input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  {...register(`items.${index}.quantity`, { required: true, min: 1, valueAsNumber: true })}
                />
              </div>
              <div className="col-2 d-flex">
                <button
                  type="button"
                  className="btn btn-light text-danger"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline-primary"
          icon={<FiPlus />}
          onClick={() => append({ productId: '', quantity: 1 })}
        >
          Add Product
        </Button>

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <span className="text-muted">Estimated Total</span>
          <span className="fw-bold fs-5">{formatCurrency(total)}</span>
        </div>
      </form>
    </Modal>
  );
}
