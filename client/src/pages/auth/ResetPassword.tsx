import { Link } from 'react-router-dom';

/** Minimal placeholder — see ForgotPassword.tsx for rationale. */
export default function ResetPassword() {
  return (
    <div className="text-center">
      <h5 className="fw-bold mb-2">Reset password</h5>
      <p className="text-muted small mb-4">
        This link is invalid or password reset is not enabled. Please contact your administrator.
      </p>
      <Link to="/login" className="btn btn-primary w-100">
        Back to Login
      </Link>
    </div>
  );
}
