import { Spinner } from 'react-bootstrap';

export default function Loader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="merp-loader-overlay">
      <Spinner animation="border" variant="primary" role="status" className="me-2" />
      <span className="text-muted">{label}</span>
    </div>
  );
}
