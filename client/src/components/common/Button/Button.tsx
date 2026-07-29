import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button as BsButton, Spinner } from 'react-bootstrap';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  isLoading = false,
  icon,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <BsButton variant={variant} disabled={isLoading || disabled} {...rest}>
      {isLoading ? (
        <Spinner animation="border" size="sm" className="me-2" />
      ) : (
        icon && <span className="me-2 d-inline-flex align-items-center">{icon}</span>
      )}
      {children}
    </BsButton>
  );
}
