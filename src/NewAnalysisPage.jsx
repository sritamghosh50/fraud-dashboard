import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from './api';
import useIsMobile from './useIsMobile';

import checkUrlLinkImage from './Logo/Check-url-link.png';
import staySafeOnlineImage from './Logo/stay safe online.png';

const TOOL_CONFIG = {
  url: {
    icon: '🔗',
    title: 'Check URL Link',
    desc: 'Paste the URL you want to check for fraud or malicious activity.',
    placeholder: 'https://example.com',
    color: '#3B5BFE',
  },

  message: {
    icon: '💬',
    title: 'Analyze Message',
    desc: 'Paste an SMS, WhatsApp, or email message to check for scam signs.',
    placeholder: 'Paste the suspicious message here…',
    color: '#8B5CF6',
  },

  image: {
    icon: '🖼️',
    title: 'Scan Image',
    desc: 'Upload any image to check readable text for scam or phishing signs.',
    placeholder: '',
    color: '#10B9A6',
  },
};

const HOW_STEPS = {
  url: [
    {
      n: '1',
      title: 'Enter URL',
      desc: 'Paste the link you want to verify.',
    },
    {
      n: '2',
      title: 'AI Analysis',
      desc: 'Our model checks the URL for suspicious patterns.',
    },
    {
      n: '3',
      title: 'Get Result',
      desc: 'See if the URL is Safe or Fraud with detailed explanation.',
    },
  ],

  message: [
    {
      n: '1',
      title: 'Enter Message',
      desc: 'Paste the SMS, WhatsApp or email message you want to check.',
    },
    {
      n: '2',
      title: 'AI Analysis',
      desc: 'Our model checks the message for scam and phishing signs.',
    },
    {
      n: '3',
      title: 'Get Result',
      desc: 'See if the message is Safe or Fraud with detailed explanation.',
    },
  ],

  image: [
    {
      n: '1',
      title: 'Upload Image',
      desc: 'Choose the image you want to check for suspicious content.',
    },
    {
      n: '2',
      title: 'AI Analysis',
      desc: 'Our model reads the image and checks for scam or phishing signs.',
    },
    {
      n: '3',
      title: 'Get Result',
      desc: 'See if the image is Safe or Suspicious with detailed explanation.',
    },
  ],
};

export default function NewAnalysisPage() {
  const location = useLocation();
  const isMobile = useIsMobile(768);

  const initialTool =
    location.state?.tool ||
    localStorage.getItem('fraudguard_history_filter') ||
    'url';

  const [activeTool, setActiveTool] = useState(initialTool);

  const [inputValue, setInputValue] = useState('');

  const [imageFile, setImageFile] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const config = TOOL_CONFIG[activeTool];

  useEffect(() => {
    localStorage.setItem(
      'fraudguard_history_filter',
      activeTool
    );
  }, [activeTool]);

  function switchTool(tool) {
    setActiveTool(tool);
    setInputValue('');
    setImageFile(null);
    setResult(null);
    setError('');

    localStorage.setItem(
      'fraudguard_history_filter',
      tool
    );
  }

  async function handleAnalyze() {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      let response;

      if (activeTool === 'url') {
        response = await api.analyzeUrl(inputValue);
      } else if (activeTool === 'message') {
        response = await api.analyzeMessage(inputValue);
      } else {
        if (!imageFile) {
          throw new Error('Please choose an image first.');
        }

        const imgResponse = await api.analyzeImage(imageFile);

        if (imgResponse.error) {
          throw new Error(imgResponse.error);
        }

        response = imgResponse.analysis;
      }

      setResult(response);
    } catch (err) {
      setError(
        err.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    activeTool === 'image'
      ? !!imageFile
      : inputValue.trim().length > 0;

  return (
    <div style={styles.pageWrap}>

      {/* TOOL TABS */}
      <div style={isMobile ? styles.tabRowMobile : styles.tabRow}>

        {Object.entries(TOOL_CONFIG).map(
          ([key, cfg]) => (
            <button
              key={key}
              onClick={() => switchTool(key)}
              style={{
                ...(isMobile ? styles.tabMobile : styles.tab),
                ...(activeTool === key
                  ? {
                      background: cfg.color,
                      color: 'white',
                    }
                  : {}),
              }}
            >
              {cfg.icon} {cfg.title}
            </button>
          )
        )}

      </div>

      {/* ANALYSIS CARD */}
      <div style={styles.card}>

        <div style={styles.cardHeader}>

          {/* SAME CHECK URL IMAGE FOR ALL SECTIONS */}
          <div style={styles.cardHeaderImageBox}>
            <img
              src={checkUrlLinkImage}
              alt="Check URL Link"
              style={styles.cardHeaderImage}
            />
          </div>

          <div style={styles.cardHeaderText}>

            <h2 style={styles.cardTitle}>
              {config.title}
            </h2>

            <p style={styles.cardDesc}>
              {config.desc}
            </p>

          </div>

        </div>

        {/* INPUT SECTION */}
        {activeTool === 'image' ? (

          <div style={styles.imageInputRow}>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files[0])
              }
              style={styles.fileInput}
            />

          </div>

        ) : (

          <div style={styles.inputRow}>

            {activeTool === 'message' ? (

              <textarea
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value)
                }
                placeholder={config.placeholder}
                rows={4}
                style={styles.textarea}
              />

            ) : (

              <input
                type="text"
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value)
                }
                placeholder={config.placeholder}
                style={styles.input}
              />

            )}

          </div>

        )}

        {/* ANALYZE BUTTON */}
        <button
          onClick={handleAnalyze}
          disabled={!canSubmit || loading}
          style={{
            ...styles.analyzeButton,
            background: config.color,
            opacity:
              !canSubmit || loading
                ? 0.5
                : 1,
          }}
        >
          {loading
            ? 'Analyzing…'
            : '🔍 Analyze'}
        </button>

        {error && (
          <p style={styles.errorText}>
            {error}
          </p>
        )}

      </div>

      {/* RESULT */}
      {result && (
        <ResultCard result={result} />
      )}

      {/* HOW IT WORKS */}
      <div style={styles.card}>

        <h3 style={styles.sectionTitle}>
          How it works?
        </h3>

        <div style={isMobile ? styles.stepsRowMobile : styles.stepsRow}>

          {HOW_STEPS[activeTool].map(
            (s, i) => (

              <div
                key={s.n}
                style={isMobile ? styles.stepItemMobile : styles.stepItem}
              >

                <div style={styles.stepBadge}>
                  {s.n}
                </div>

                <div style={styles.stepContent}>

                  <div style={styles.stepTitle}>
                    {s.n}. {s.title}
                  </div>

                  <div style={styles.stepDesc}>
                    {s.desc}
                  </div>

                </div>

                {i < HOW_STEPS[activeTool].length - 1 && !isMobile && (
                  <span style={styles.stepArrow}>
                    →
                  </span>
                )}

              </div>

            )
          )}

        </div>

      </div>

      {/* STAY SAFE ONLINE */}
      <div style={styles.safeBanner}>

        <div style={styles.safeBannerContent}>

          <img
            src={staySafeOnlineImage}
            alt="Stay Safe Online"
            style={styles.safeBannerImage}
          />

          <div style={styles.safeTextContainer}>

            <div style={styles.safeTitle}>
              Stay Safe Online
            </div>

            <div style={styles.safeSub}>
              Verify before you click. It can save
              you from scams, phishing and data theft.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function ResultCard({ result }) {

  const isFraud = result.scam;

  const levelColors = {
    CRITICAL: '#E14848',
    HIGH: '#f59e0b',
    MEDIUM: '#eab308',
    LOW: '#1AA45C',
  };

  const levelColor =
    levelColors[result.riskLevel] ||
    '#5B6178';

  return (
    <div
      style={{
        ...styles.resultCard,
        borderColor: levelColor,
      }}
    >

      <div style={styles.resultHeader}>

        <h3 style={styles.resultTitle}>
          {isFraud ? '🚨' : '✅'}{' '}
          {result.scamCategory}
        </h3>

        <span
          style={{
            ...styles.badge,
            background: levelColor,
          }}
        >
          {result.riskLevel}
        </span>

      </div>

      <p style={styles.resultRow}>
        <strong>Risk score:</strong>{' '}
        {result.riskScore} / 100
      </p>

      {result.ruleIndicators?.length > 0 && (

        <div style={styles.resultRow}>

          <strong>Indicators found:</strong>

          <ul style={styles.indicatorList}>

            {result.ruleIndicators.map(
              (ind, i) => (
                <li key={i}>
                  {ind}
                </li>
              )
            )}

          </ul>

        </div>

      )}

      <p style={styles.resultRow}>
        <strong>Why:</strong>{' '}
        {result.llmExplanation}
      </p>

      <p style={styles.resultRow}>
        <strong>Recommendation:</strong>{' '}
        {result.recommendation}
      </p>

    </div>
  );
}

const styles = {

  pageWrap: {
    width: '100%',
    maxWidth: '920px',
    boxSizing: 'border-box',
  },

  tabRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },

  tabRowMobile: {
    display: 'flex',
    gap: '5px',
    marginBottom: '16px',
    flexWrap: 'nowrap',
  },

  tab: {
    padding: '9px 16px',
    borderRadius: '10px',
    border: '1px solid #E7E9F3',
    background: 'white',
    color: '#5B6178',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  tabMobile: {
    flex: '1 1 0',
    minWidth: 0,
    padding: '8px 4px',
    borderRadius: '9px',
    border: '1px solid #E7E9F3',
    background: 'white',
    color: '#5B6178',
    fontSize: '10.5px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
  },

  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #E7E9F3',
    boxShadow: '0 4px 20px rgba(20, 30, 70, 0.06)',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },

  cardHeader: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    marginBottom: '22px',
  },

  /*
   * CONSTANT IMAGE
   * This is always Check-url-link.png,
   * even for Message and Image sections.
   */
  cardHeaderImageBox: {
    width: '50px',
    height: '50px',
    borderRadius: '13px',
    background: '#E3EAFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },

  cardHeaderImage: {
    width: '65px',
    height: '75px',
    objectFit: 'contain',
  },

  cardHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  cardTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#12172B',
    margin: '0 0 4px 0',
  },

  cardDesc: {
    fontSize: '13px',
    color: '#5B6178',
    margin: 0,
    lineHeight: 1.5,
  },

  inputRow: {
    marginBottom: '18px',
  },

  imageInputRow: {
    marginBottom: '18px',
  },

  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #DDE1EF',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },

  textarea: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #DDE1EF',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },

  fileInput: {
    fontSize: '14px',
    maxWidth: '100%',
  },

  analyzeButton: {
    padding: '12px 22px',
    borderRadius: '10px',
    border: 'none',
    color: 'white',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },

  errorText: {
    color: '#E14848',
    fontSize: '13px',
    marginTop: '12px',
  },

  resultCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
    border: '2px solid',
    boxShadow: '0 4px 20px rgba(20, 30, 70, 0.06)',
    boxSizing: 'border-box',
  },

  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    gap: '12px',
  },

  resultTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#12172B',
    margin: 0,
  },

  badge: {
    color: 'white',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '8px',
    flexShrink: 0,
  },

  resultRow: {
    fontSize: '13.5px',
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: '10px',
  },

  indicatorList: {
    margin: '6px 0 0 0',
    paddingLeft: '18px',
  },

  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#12172B',
    margin: '0 0 20px 0',
  },

  stepsRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
  },

  stepsRowMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  stepItem: {
    flex: 1,
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    position: 'relative',
    minWidth: 0,
  },

  stepItemMobile: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    minWidth: 0,
  },

  stepBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    flexShrink: 0,
    background: '#E3EAFF',
    color: '#3B5BFE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
  },

  stepContent: {
    minWidth: 0,
  },

  stepTitle: {
    fontWeight: 700,
    color: '#12172B',
    fontSize: '14px',
    marginBottom: '4px',
  },

  stepDesc: {
    fontSize: '13px',
    color: '#5B6178',
    lineHeight: 1.5,
  },

  stepArrow: {
    color: '#C6CBE0',
    marginLeft: 'auto',
    fontSize: '18px',
    flexShrink: 0,
  },

  /*
   * STAY SAFE ONLINE
   * No image on the right side.
   */
  safeBanner: {
    borderRadius: '16px',
    padding: '22px 28px',
    background: '#F1EBFF',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxSizing: 'border-box',
    marginBottom: '20px',
  },

  safeBannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minWidth: 0,
  },

  safeBannerImage: {
    width: '58px',
    height: '58px',
    objectFit: 'contain',
    flexShrink: 0,
  },

  safeTextContainer: {
    minWidth: 0,
  },

  safeTitle: {
    fontWeight: 700,
    color: '#12172B',
    fontSize: '15px',
    marginBottom: '4px',
  },

  safeSub: {
    fontSize: '13px',
    color: '#5B6178',
    lineHeight: 1.5,
  },

};