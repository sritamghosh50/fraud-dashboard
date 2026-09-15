import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import useIsMobile from './useIsMobile';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile(768);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function copyEmail() {
    navigator.clipboard.writeText(user?.email || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const initials = (user?.fullName || user?.email || '?')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>Profile</h1>
      <p style={styles.subtitle}>Manage your FraudGuard AI account details.</p>

      <div style={isMobile ? styles.cardMobile : styles.card}>
        <div style={styles.avatarRow}>
          <div style={styles.avatar}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={styles.name}>{user?.fullName || 'Unnamed User'}</div>
            <div style={styles.email} onClick={copyEmail} title="Click to copy">
              {user?.email} {copied ? '✓ Copied' : ''}
            </div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={isMobile ? styles.infoGridMobile : styles.infoGrid}>
          <InfoRow label="Full name" value={user?.fullName || '—'} />
          <InfoRow label="Email address" value={user?.email || '—'} />
          <InfoRow label="Account type" value="Standard" />
          <InfoRow label="Member since" value="—" hint="Account creation date isn't tracked yet" />
        </div>
      </div>

      <div style={isMobile ? styles.cardMobile : styles.card}>
        <h3 style={styles.sectionTitle}>Security</h3>
        <p style={styles.sectionDesc}>
          Your password is securely hashed and never stored in plain text.
          For your safety, sign out on shared or public devices.
        </p>
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Log out
        </button>
      </div>

      <div style={isMobile ? styles.infoBannerMobile : styles.infoBanner}>
        <span style={styles.infoBannerIcon}>🛡</span>
        <p style={styles.infoBannerText}>
          FraudGuard AI keeps your check history private — only you can see your own
          transaction, message, URL, and image analysis history.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, hint }) {
  return (
    <div style={styles.infoRow}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value}</div>
      {hint && <div style={styles.infoHint}>{hint}</div>}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '620px', width: '100%', boxSizing: 'border-box' },
  title: { fontSize: '22px', fontWeight: 700, color: '#1e1b3a', margin: '0 0 4px 0' },
  subtitle: { fontSize: '13.5px', color: '#6b7280', margin: '0 0 24px 0' },
  card: {
    background: 'white', borderRadius: '16px', padding: '26px',
    border: '1px solid #eceafe', marginBottom: '20px',
  },
  cardMobile: {
    background: 'white', borderRadius: '14px', padding: '18px',
    border: '1px solid #eceafe', marginBottom: '16px', boxSizing: 'border-box',
  },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' },
  avatar: {
    width: '58px', height: '58px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '20px', flexShrink: 0,
  },
  name: { fontSize: '17px', fontWeight: 700, color: '#1e1b3a', marginBottom: '4px' },
  email: {
    fontSize: '13px', color: '#6b7280', cursor: 'pointer',
    overflowWrap: 'break-word', wordBreak: 'break-word',
  },
  divider: { height: '1px', background: '#f0eefe', margin: '22px 0' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' },
  infoGridMobile: { display: 'grid', gridTemplateColumns: '1fr', gap: '14px' },
  infoRow: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 },
  infoLabel: { fontSize: '11.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.03em' },
  infoValue: { fontSize: '14px', color: '#1e1b3a', fontWeight: 500, overflowWrap: 'break-word', wordBreak: 'break-word' },
  infoHint: { fontSize: '11px', color: '#c4c1e0', fontStyle: 'italic' },
  sectionTitle: { fontSize: '15px', fontWeight: 700, color: '#1e1b3a', margin: '0 0 8px 0' },
  sectionDesc: { fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 18px 0' },
  logoutButton: {
    padding: '10px 20px', borderRadius: '10px', border: '1px solid #fecaca',
    background: '#fef2f2', color: '#dc2626', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
  },
  infoBanner: {
    display: 'flex', gap: '12px', background: '#eef0ff', borderRadius: '14px',
    padding: '18px 22px', alignItems: 'flex-start',
  },
  infoBannerMobile: {
    display: 'flex', gap: '10px', background: '#eef0ff', borderRadius: '14px',
    padding: '16px 16px', alignItems: 'flex-start', boxSizing: 'border-box',
  },
  infoBannerIcon: { fontSize: '18px' },
  infoBannerText: { fontSize: '12.5px', color: '#4f46e5', lineHeight: 1.6, margin: 0 },
};