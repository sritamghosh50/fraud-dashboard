import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import useIsMobile from './useIsMobile';

import fraudguardLogo from './Logo/Fraudguard.png';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

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
    <div style={isMobile ? styles.wrapperMobile : styles.wrapper}>

      {/* SIDEBAR (desktop) — becomes a compact top bar on mobile,
          nav links move to a fixed bottom tab bar instead. */}
      <aside style={isMobile ? styles.sidebarMobile : styles.sidebar}>

        {/* FRAUDGUARD LOGO */}
        <div style={isMobile ? { ...styles.logoRow, marginBottom: 0 } : styles.logoRow}>
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

        {!isMobile && (
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
        )}

        {!isMobile && (
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            <span>🚪</span>
            Logout
          </button>
        )}

        {isMobile && (
          <div style={styles.avatar}>
            {(user?.fullName || user?.email || '?')[0].toUpperCase()}
          </div>
        )}

      </aside>

      <div style={styles.mainArea}>

        {!isMobile && (
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
        )}

        <main style={isMobile ? styles.contentMobile : styles.content}>
          <Outlet />
        </main>

      </div>

      {/* BOTTOM TAB BAR (mobile only) */}
      {isMobile && (
        <nav style={styles.bottomNav}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.bottomNavItem,
                  ...(isActive ? styles.bottomNavItemActive : {}),
                }}
              >
                <span style={styles.bottomNavIcon}>
                  {item.icon}
                </span>
                <span style={styles.bottomNavLabel}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            style={styles.bottomNavItem}
          >
            <span style={styles.bottomNavIcon}>🚪</span>
            <span style={styles.bottomNavLabel}>Logout</span>
          </button>
        </nav>
      )}

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

  wrapperMobile: {
    display: 'flex',
    flexDirection: 'column',
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
    flexShrink: 0,
    boxSizing: 'border-box',
  },

  sidebarMobile: {
    width: '100%',
    boxSizing: 'border-box',
    background: 'white',
    borderBottom: '1px solid #eceafe',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 30,
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

  contentMobile: {
    flex: 1,
    padding: '16px 14px 90px',
    minWidth: 0,
    boxSizing: 'border-box',
    width: '100%',
  },

  bottomNav: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    display: 'flex',
    background: 'white',
    borderTop: '1px solid #eceafe',
    boxShadow: '0 -4px 16px rgba(20, 20, 60, 0.06)',
    padding: '6px 4px calc(6px + env(safe-area-inset-bottom, 0px))',
  },

  bottomNavItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    padding: '6px 2px',
    border: 'none',
    background: 'transparent',
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '10.5px',
    fontWeight: 500,
    cursor: 'pointer',
    minWidth: 0,
  },

  bottomNavItemActive: {
    color: '#4f46e5',
    fontWeight: 700,
  },

  bottomNavIcon: {
    fontSize: '18px',
    lineHeight: 1,
  },

  bottomNavLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },

};