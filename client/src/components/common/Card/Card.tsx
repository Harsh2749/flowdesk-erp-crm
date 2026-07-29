import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, actions, children, className = '' }: CardProps) {
  return (
    <div className={`merp-card p-3 p-md-4 ${className}`}>
      {(title || actions) && (
        <div className="d-flex align-items-center justify-content-between mb-3">
          {title && <h6 className="mb-0 fw-semibold">{title}</h6>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
