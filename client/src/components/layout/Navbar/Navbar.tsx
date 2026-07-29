import { Dropdown } from 'react-bootstrap';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../../../hooks/useSidebar';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';

export default function Navbar() {
  const { toggle } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="merp-topbar d-flex align-items-center justify-content-between px-3 px-md-4">
      <button
        className="btn btn-light d-lg-none border-0"
        onClick={toggle}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={20} />
      </button>

      <div className="d-none d-lg-block" />

      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-light border-0" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            className="border-0 d-flex align-items-center gap-2"
            id="user-menu"
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
              style={{ width: 32, height: 32, fontSize: '0.8rem', fontWeight: 600 }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? <FiUser size={14} />}
            </div>
            <span className="d-none d-md-inline small fw-medium">{user?.name}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemText className="small text-muted">{user?.role}</Dropdown.ItemText>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              <FiLogOut className="me-2" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}
