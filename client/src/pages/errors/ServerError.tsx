import { FiAlertTriangle } from 'react-icons/fi';

export default function ServerError() {
  return (
    <div className="text-center">
      <FiAlertTriangle size={40} className="text-warning mb-3" />
      <h3 className="fw-bold">Something went wrong</h3>
      <p className="text-muted mb-4">Please try again in a moment.</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>
        Reload page
      </button>
    </div>
  );
}
