import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

import fraudguardLogo from './Logo/Fraudguard.png';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/new-analysis', label: 'New Analysis', icon: '➕' },
    { path: '/history', label: 'History', icon: '🕐' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={styles.wrapper}>

      <aside style={styles.sidebar}>

        {/* FRAUDGUARD LOGO */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <img
              src={fraudguardLogo}
              alt="FraudGuard"
              style={styles.logoImage}
            />
          </div>

          <span style={styles.logoText}>
            FraudGuard <strong>AI.</strong>
          </span>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
              >
                <span style={styles.navIcon}>
                  {item.icon}
                </span>

                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          <span>🚪</span>
          Logout
        </button>

      </aside>

      <div style={styles.mainArea}>

        <header style={styles.header}>
          <div />

          <div style={styles.userBadge}>

            <div style={styles.avatar}>
              {(user?.fullName || user?.email || '?')[0].toUpperCase()}
            </div>

            <div>
              <div style={styles.userName}>
                Hello, {user?.fullName || 'there'}
              </div>

              <div style={styles.userEmail}>
                {user?.email}
              </div>
            </div>

          </div>
        </header>

        <main style={styles.content}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}

const styles = {

  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f6f5ff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  sidebar: {
    width: '240px',
    background: 'white',
    borderRight: '1px solid #eceafe',
    padding: '24px 18px',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
    padding: '0 6px',
  },

  logoIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },

  logoImage: {
    width: '40px',
    height: '55px',
    objectFit: 'contain',
    display: 'block',
  },

  logoText: {
    fontSize: '15.5px',
    fontWeight: 500,
    color: '#1e1b3a',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 14px',
    borderRadius: '10px',
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
  },

  navItemActive: {
    background: '#eef0ff',
    color: '#4f46e5',
    fontWeight: 600,
  },

  navIcon: {
    fontSize: '15px',
    width: '18px',
    textAlign: 'center',
  },

  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 14px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#dc2626',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
  },

  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 32px',
    background: 'white',
    borderBottom: '1px solid #eceafe',
  },

  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '14px',
  },

  userName: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#1e1b3a',
  },

  userEmail: {
    fontSize: '11.5px',
    color: '#9ca3af',
  },

  content: {
    flex: 1,
    padding: '32px',
  },

};