import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }) {
  return (
    <div className="d-flex admin-layout-shell">
      <Sidebar />

      <div className="main-content">
        <Topbar />
        <div className="p-4 dashboard-page-content">{children}</div>
      </div>
    </div>
  );
}
