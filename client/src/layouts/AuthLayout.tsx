import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{ background: 'var(--merp-bg)' }}
    >
      <div className="w-100" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded mb-2"
            style={{ width: 48, height: 48, background: 'var(--merp-primary)', color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}
          >
            M
          </div>
          <h4 className="fw-bold mb-0">Mini ERP + CRM</h4>
          <p className="text-muted small">Operations Portal</p>
        </div>
        <div className="merp-card p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
