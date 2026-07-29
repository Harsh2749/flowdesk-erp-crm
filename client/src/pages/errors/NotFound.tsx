import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="fw-bold" style={{ fontSize: '4rem' }}>
        404
      </h1>
      <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary">
        <FiArrowLeft className="me-2" />
        Back to Dashboard
      </Link>
    </div>
  );
}
