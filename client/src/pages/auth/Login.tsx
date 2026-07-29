import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errorMessage';
import './Login.css';

interface LoginFormValues {
  email: string;
  password: string;
}

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@minierp.test', password: 'Passw0rd!123' },
  { role: 'Sales', email: 'sales@minierp.test', password: 'Passw0rd!123' },
  { role: 'Warehouse', email: 'warehouse@minierp.test', password: 'Passw0rd!123' },
  { role: 'Accounts', email: 'accounts@minierp.test', password: 'Passw0rd!123' },
];

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success('Logged in successfully');
      const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* ── LEFT SIDE: Illustration ── */}
        <div className="login-left">
          <img src="/pc.png" alt="ERP CRM Illustration" className="login-illustration" />

          {/* ── Demo Accounts Box ── */}
          <div className="demo-accounts-box">
            <h3 className="demo-title">
              <span className="demo-icon">🔑</span> Demo Accounts
            </h3>
            <p className="demo-subtitle">Click any role to auto-fill login form</p>

            <div className="demo-list">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  className="demo-item"
                  onClick={() => fillDemoAccount(acc.email, acc.password)}
                >
                  <span className={`demo-role-badge role-${acc.role.toLowerCase()}`}>
                    {acc.role}
                  </span>
                  <div className="demo-item-details">
                    <span className="demo-email">{acc.email}</span>
                    <span className="demo-password">Passw0rd!123</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: Login Card ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Logo */}
            <div className="login-logo">
              <span className="logo-badge">EC</span>
              <div className="logo-text">
                <strong>FlowDesk</strong>
                <span>ERP CRM</span>
              </div>
            </div>

            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">Sign in to manage your operations</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className="login-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}

              <label className="login-label">Password</label>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}

              <div className="login-row">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="login-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'SIGN IN'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <span>© 2026 FlowDesk ERP CRM. All rights reserved.</span>
        <div className="footer-links">
          <a href="#">Quick Links:</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}