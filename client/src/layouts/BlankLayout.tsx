import { Outlet } from 'react-router-dom';

export default function BlankLayout() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3">
      <Outlet />
    </div>
  );
}
