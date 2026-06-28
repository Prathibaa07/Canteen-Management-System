import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';

const DashboardLayout = ({ children, sidebarItems, portalName, notifications = 0, notificationPath = '/student-dashboard/order' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <nav className="sidebar-menu">
          {sidebarItems.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.path} 
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button 
            className="sidebar-item" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => {
              localStorage.removeItem('loggedInUser');
              navigate('/');
              window.location.reload(); // Force state refresh
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="dashboard-main" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          {notifications > 0 && (
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate(notificationPath)}>
              <Bell size={24} color="#fff" />
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {notifications}
              </span>
            </div>
          )}
          {portalName && (
            <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 'bold', letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#fff' }}>
              {portalName}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
