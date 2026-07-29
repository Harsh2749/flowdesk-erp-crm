import { Link } from 'react-router-dom';

/**
 * Minimal placeholder — the backend implements JWT + bcrypt auth only
 * (no OAuth provider), matching the assignment's "Simple JWT-based
 * authentication is acceptable" requirement.
 */
export default function OAuthCallback() {
  return (
    <div className="text-center">
      <h5 className="fw-bold mb-2">OAuth not configured</h5>
      <p className="text-muted small mb-4">This portal uses email/password login only.</p>
      <Link to="/login" className="btn btn-primary w-100">
        Back to Login
      </Link>
    </div>
  );
}
