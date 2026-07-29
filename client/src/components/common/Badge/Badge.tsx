import { Badge as BsBadge } from 'react-bootstrap';
import { STATUS_BADGE_VARIANT } from '../../../constants';

interface BadgeProps {
  status: string;
  text?: string;
}

export default function Badge({ status, text }: BadgeProps) {
  const variant = STATUS_BADGE_VARIANT[status] || 'secondary';
  return (
    <BsBadge bg={variant} className="fw-medium px-2 py-1">
      {text || status}
    </BsBadge>
  );
}
