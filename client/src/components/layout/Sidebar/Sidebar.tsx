import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiPhoneCall,
  FiBox,
  FiRepeat,
  FiFileText,
} from 'react-icons/fi';
import { useSidebar } from '../../../hooks/useSidebar';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/customers', label: 'Customers', icon: FiUsers },
  { to: '/followups', label: 'Follow-ups', icon: FiPhoneCall },
  { to: '/products', label: 'Products', icon: FiBox },
  { to: '/inventory', label: 'Inventory', icon: FiRepeat },
  { to: '/challans', label: 'Sales Challans', icon: FiFileText },
];

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <aside className={`merp-sidebar d-flex flex-column p-3 ${isOpen ? 'merp-sidebar-open' : ''}`}>
      <div className="d-flex align-items-center gap-2 mb-4 px-1">
        <div
          className="d-flex align-items-center justify-content-center rounded"
          style={{ width: 34, height: 34, background: 'var(--merp-primary)', color: '#fff', fontWeight: 700 }}
        >
          M
        </div>
        <div>
          <div className="fw-bold" style={{ fontSize: '0.95rem', lineHeight: 1.1 }}>
            Mini ERP
          </div>
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
            + CRM Portal
          </div>
        </div>
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `merp-sidebar-link ${isActive ? 'active' : ''}`}
            onClick={close}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
