import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import { useSidebar } from '../hooks/useSidebar';

export default function DashboardLayout() {
  const { isOpen, close } = useSidebar();

  return (
    <div className="d-flex">
      <Sidebar />
      {isOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1035 }}
          onClick={close}
        />
      )}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Navbar />
        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
