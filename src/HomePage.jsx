import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import linkImage from './Logo/Link.png';
import messageImage from './Logo/message-logo.png';
import scanImage from './Logo/Image.png';
import homeImage from './Logo/Home.png';
import whyItMattersImage from './Logo/why-it-matters.png';

export default function HomePage() {
  const navigate = useNavigate();

  // When the user is on Home, History should show ALL types.
  useEffect(() => {
    localStorage.removeItem('fraudguard_history_filter');
  }, []);

  const tools = [
    {
      key: 'url',
      image: linkImage,
      color: '#3B5BFE',
      bg: '#E3EAFF',
      title: 'Check URL Link',
      desc: 'Paste a link to check if it’s safe or potentially fraudulent.',
      buttonLabel: 'Check URL',
    },
    {
      key: 'message',
      image: messageImage,
      color: '#8B5CF6',
      bg: '#F1EBFF',
      title: 'Analyze Message',
      desc: 'Paste a message to detect scams, phishing or fake content.',
      buttonLabel: 'Check Message',
    },
    {
      key: 'image',
      image: scanImage,
      color: '#10B9A6',
      bg: '#DFFAF4',
      title: 'Scan Image',
      desc: 'Upload an image to detect fake, manipulated or suspicious content.',
      buttonLabel: 'Check Image',
    },
  ];

  function openTool(tool) {
    localStorage.setItem(
      'fraudguard_history_filter',
      tool
    );

    navigate('/new-analysis', {
      state: { tool: tool },
    });
  }

  return (
    <div>

      {/* HERO */}
      <div style={styles.hero}>

        <div>
          <h1 style={styles.heroTitle}>
            Welcome to FraudGuard AI
          </h1>

          <p style={styles.heroSub}>
            Your personal AI-powered fraud detection assistant.
            <br />
            Choose an option below to get started.
          </p>
        </div>

        {/* HOME IMAGE */}
        <div style={styles.heroHomeImageWrapper}>
          <img
            src={homeImage}
            alt="Home"
            style={styles.heroHomeImage}
          />
        </div>

      </div>

      {/* TOOL CARDS */}
      <div style={styles.cardGrid}>

        {tools.map((tool) => (
          <div key={tool.key} style={styles.card}>

            {/* TOOL IMAGE */}
            <div
              style={{
                ...styles.cardIcon,
                background: tool.bg,
              }}
            >
              <img
                src={tool.image}
                alt={tool.title}
                style={styles.cardIconImage}
              />
            </div>

            <h3 style={styles.cardTitle}>
              {tool.title}
            </h3>

            <p style={styles.cardDesc}>
              {tool.desc}
            </p>

            <button
              style={{
                ...styles.cardButton,
                background: tool.color,
              }}
              onClick={() => openTool(tool.key)}
            >
              {tool.buttonLabel} →
            </button>

          </div>
        ))}

      </div>

      {/* WHY IT MATTERS */}
      <div style={styles.infoBox}>

        {/* WHY IT MATTERS IMAGE */}
        <div style={styles.infoIconWrapper}>
          <img
            src={whyItMattersImage}
            alt="Why It Matters"
            style={styles.infoIconImage}
          />
        </div>

        <div>
          <div style={styles.infoTitle}>
            Why It Matters?
          </div>

          <p style={styles.infoText}>
            Fraud can happen to anyone. Our AI helps you identify scams,
            fake links, suspicious messages and manipulated images —
            so you can stay safe online.
          </p>
        </div>

      </div>

    </div>
  );
}

const styles = {

  /* =========================
     HERO
  ========================= */

  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '32px 36px',
    marginBottom: '24px',
    border: '1px solid #E7E9F3',
    boxShadow: '0 4px 20px rgba(20, 30, 70, 0.06)',
  },

  heroTitle: {
    fontSize: '24px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    color: '#12172B',
  },

  heroSub: {
    fontSize: '14px',
    color: '#5B6178',
    lineHeight: 1.6,
    margin: 0,
  },

  heroHomeImageWrapper: {
    width: '110px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  heroHomeImage: {
    width: '259px',
    height: '161px',
    objectFit: 'contain',
    display: 'block',
    position: 'relative',
    left: '-42px',
    top: '-2px',
  },

  /* =========================
     TOOL CARDS
  ========================= */

  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },

  card: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '26px',
    border: '1px solid #E7E9F3',
    boxShadow: '0 4px 20px rgba(20, 30, 70, 0.06)',
  },

  cardIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    overflow: 'hidden',
    flexShrink: 0,
  },

  cardIconImage: {
    width: '38px',
    height: '38px',
    objectFit: 'contain',
    display: 'block',
  },

  cardTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#12172B',
    margin: '0 0 8px 0',
  },

  cardDesc: {
    fontSize: '13.5px',
    color: '#5B6178',
    lineHeight: 1.5,
    margin: '0 0 20px 0',
    minHeight: '42px',
  },

  cardButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },

  /* =========================
     WHY IT MATTERS
  ========================= */

  infoBox: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    background: '#F4F6FC',
    borderRadius: '16px',
    padding: '20px 24px',
    border: '1px solid #E7E9F3',
  },

  infoIconWrapper: {
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  infoIconImage: {
    width: '64px',
    height: '74px',
    objectFit: 'contain',
    display: 'block',
  },

  infoTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#12172B',
    marginBottom: '4px',
  },

  infoText: {
    fontSize: '13px',
    color: '#5B6178',
    lineHeight: 1.6,
    margin: 0,
  },

};