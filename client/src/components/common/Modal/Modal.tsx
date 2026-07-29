import { ReactNode } from 'react';
import { Modal as BsModal } from 'react-bootstrap';

interface ModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

export default function Modal({ show, onHide, title, children, footer, size }: ModalProps) {
  return (
    <BsModal show={show} onHide={onHide} centered size={size} backdrop="static">
      <BsModal.Header closeButton>
        <BsModal.Title as="h5">{title}</BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>{children}</BsModal.Body>
      {footer && <BsModal.Footer>{footer}</BsModal.Footer>}
    </BsModal>
  );
}
