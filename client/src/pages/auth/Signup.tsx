import { Link } from 'react-router-dom';

/**
 * Self-service signup is not part of the assignment scope (only role-based
 * login is required). Kept as a minimal placeholder to match the folder
 * structure — new users are provisioned by an Admin via seed data instead.
 */
export default function Signup() {
  return (
    <div className="text-center">
      <h5 className="fw-bold mb-2">Account creation</h5>
      <p className="text-muted small mb-4">
        New users are provisioned by an administrator. Please contact your admin for access.
      </p>
      <Link to="/login" className="btn btn-primary w-100">
        Back to Login
      </Link>
    </div>
  );
}
