import { Link } from 'react-router-dom';

/**
 * Minimal placeholder — password reset flow is outside the required scope
 * (assignment only requires simple JWT login). Contact-admin messaging
 * matches Signup.tsx's approach for consistency.
 */
export default function ForgotPassword() {
  return (
    <div className="text-center">
      <h5 className="fw-bold mb-2">Forgot password</h5>
      <p className="text-muted small mb-4">
        Please contact your administrator to reset your password.
      </p>
      <Link to="/login" className="btn btn-primary w-100">
        Back to Login
      </Link>
    </div>
  );
}
