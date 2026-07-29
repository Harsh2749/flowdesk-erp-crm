import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

export default function Unauthorized() {
  return (
    <div className="text-center">
      <FiLock size={40} className="text-danger mb-3" />
      <h3 className="fw-bold">Access Denied</h3>
      <p className="text-muted mb-4">You don't have permission to view this page.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
}
