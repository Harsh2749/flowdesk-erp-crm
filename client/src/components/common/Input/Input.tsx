import { forwardRef, InputHTMLAttributes } from 'react';
import { Form } from 'react-bootstrap';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
  label?: string;
  error?: string;
  value?: string | number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, ...rest }, ref) => (
  <Form.Group className="mb-3">
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Control ref={ref} isInvalid={!!error} {...rest} />
    {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
  </Form.Group>
));

Input.displayName = 'Input';

export default Input;
