import { useEffect, useState } from 'react';
import { api } from './api';
import useIsMobile from './useIsMobile';

import linkImage from './Logo/Link.png';
import messageImage from './Logo/message-logo.png';
import imageImage from './Logo/Image.png';

// Sample rows from the spec — used only if the backend is unreachable.
const MOCK_HISTORY = [
  {
    id: 'mock-1',
    checkType: 'URL',
    inputSummary: 'https://secure-login-update.com',
    checkedAt: '2025-09-10T18:45:00',
    scam: true,
    scamCategory: 'Phishing',
    riskLevel: 'CRITICAL',
    riskScore: 92,
    llmExplanation: '',
    recommendation: '',
  },
  {
    id: 'mock-2',
    checkType: 'MESSAGE',
    inputSummary: 'You have won a free iPhone! Click here...',
    checkedAt: '2025-09-10T17:32:00',
    scam: true,
    scamCategory: 'Prize Scam',
    riskLevel: 'HIGH',
    riskScore: 85,
    llmExplanation: '',
    recommendation: '',
  },
  {
    id: 'mock-3',
    checkType: 'IMAGE',
    inputSummary: 'suspicious_image.jpg',
    checkedAt: '2025-09-10T16:18:00',
    scam: false,
    scamCategory: 'No threat detected',
    riskLevel: 'LOW',
    riskScore: 8,
    llmExplanation: '',
    recommendation: '',
  },
  {
    id: 'mock-4',
    checkType: 'URL',
    inputSummary: 'https://amazon.co.uk/offer',
    checkedAt: '2025-09-10T15:05:00',
    scam: false,
    scamCategory: 'No threat detected',
    riskLevel: 'LOW',
    riskScore: 5,
    llmExplanation: '',
    recommendation: '',
  },
  {
    id: 'mock-5',
    checkType: 'MESSAGE',
    inputSummary: 'Your account will be suspended...',
    checkedAt: '2025-09-10T13:22:00',
    scam: true,
    scamCategory: 'Account Suspension Scam',
    riskLevel: 'HIGH',
    riskScore: 88,
    llmExplanation: '',
    recommendation: '',
  },
  {
    id: 'mock-6',
    checkType: 'IMAGE',
    inputSummary: 'edited_image.png',
    checkedAt: '2025-09-10T12:50:00',
    scam: false,
    scamCategory: 'No threat detected',
    riskLevel: 'LOW',
    riskScore: 12,
    llmExplanation: '',
    recommendation: '',
  },
];

const TYPE_META = {
  URL: {
    icon: linkImage,
    title: 'URL Check',
    color: '#3B5BFE',
    bg: '#E3EAFF',
    filterKey: 'url',
  },

  MESSAGE: {
    icon: messageImage,
    title: 'Message Analysis',
    color: '#8B5CF6',
    bg: '#F1EBFF',
    filterKey: 'message',
  },

  IMAGE: {
    icon: imageImage,
    title: 'Image Scan',
    color: '#10B9A6',
    bg: '#DFFAF4',
    filterKey: 'image',
  },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'url', label: 'Links' },
  { key: 'message', label: 'Messages' },
  { key: 'image', label: 'Images' },
];

export default function HistoryPage() {
  const isMobile = useIsMobile(768);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [usingMock, setUsingMock] = useState(false);

  const [openId, setOpenId] = useState(null);

  const [filter, setFilter] = useState(() => {
    return (
      localStorage.getItem('fraudguard_history_filter') || 'all'
    );
  });

  async function loadHistory() {
    try {
      setLoading(true);
      setUsingMock(false);

      const data = await api.getScamHistory();

      setHistory(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load history:',
        err
      );

      setHistory(MOCK_HISTORY);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const savedFilter =
      localStorage.getItem(
        'fraudguard_history_filter'
      );

    if (
      savedFilter === 'url' ||
      savedFilter === 'message' ||
      savedFilter === 'image'
    ) {
      setFilter(savedFilter);
    } else {
      setFilter('all');
    }
  }, []);

  function changeFilter(newFilter) {
    setFilter(newFilter);

    localStorage.setItem(
      'fraudguard_history_filter',
      newFilter === 'all'
        ? ''
        : newFilter
    );
  }

  function toggleHistory(id) {
    setOpenId(
      openId === id
        ? null
        : id
    );
  }

  function clearAll() {
    setHistory([]);
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString();
  }

  function getFilteredHistory() {
    if (filter === 'all') {
      return history;
    }

    return history.filter(
      (item) =>
        TYPE_META[item.checkType]
          ?.filterKey === filter
    );
  }

  const filteredHistory =
    getFilteredHistory();

  const fraudCount =
    filteredHistory.filter(
      (item) => item.scam === true
    ).length;

  const safeCount =
    filteredHistory.length -
    fraudCount;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={isMobile ? styles.headerMobile : styles.header}>

        <div style={{ minWidth: 0 }}>

          <h1 style={styles.heading}>
            Your History
          </h1>

          <p style={styles.subtext}>
            All your past checks are saved here.
            You can view details or recheck anytime.
          </p>

        </div>

        <button
          style={styles.clearButton}
          onClick={clearAll}
          disabled={
            filteredHistory.length === 0
          }
        >
          Clear All
        </button>

      </div>

      {/* FILTER PILLS */}
      <div style={styles.pillRow}>

        {FILTER_TABS.map((tab) => {

          const active =
            filter === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() =>
                changeFilter(tab.key)
              }
              style={{
                ...styles.pill,
                ...(active
                  ? styles.pillActive
                  : {}),
              }}
            >
              {tab.label}
            </button>
          );
        })}

      </div>

      {/* MOCK NOTICE */}
      {usingMock && !loading && (
        <p style={styles.mockNotice}>
          Backend unreachable — showing sample data.
        </p>
      )}

      {/* LOADING */}
      {loading && (
        <div style={styles.stateBox}>
          <p>
            Loading your history...
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        filteredHistory.length === 0 && (
          <div style={styles.stateBox}>

            <div
              style={{
                fontSize: '32px',
                marginBottom: '10px',
              }}
            >
              🛡️
            </div>

            <h2
              style={{
                fontSize: '17px',
                marginBottom: '6px',
              }}
            >
              No history found
            </h2>

            <p
              style={{
                fontSize: '13.5px',
              }}
            >
              Your security checks will appear here
              after you analyze them.
            </p>

          </div>
        )}

      {/* LIST */}
      {!loading &&
        filteredHistory.length > 0 && (

          <div>

            {/* SUMMARY */}
            <div style={isMobile ? styles.summaryRowMobile : styles.summaryRow}>

              <div style={isMobile ? styles.summaryCardMobile : styles.summaryCard}>
                <span style={isMobile ? styles.summaryLabelMobile : styles.summaryLabel}>
                  Total Checks
                </span>

                <strong style={isMobile ? styles.summaryValueMobile : styles.summaryValue}>
                  {filteredHistory.length}
                </strong>
              </div>

              <div style={isMobile ? styles.summaryCardMobile : styles.summaryCard}>
                <span style={isMobile ? styles.summaryLabelMobile : styles.summaryLabel}>
                  Scams Detected
                </span>

                <strong
                  style={{
                    ...(isMobile ? styles.summaryValueMobile : styles.summaryValue),
                    color: '#E14848',
                  }}
                >
                  {fraudCount}
                </strong>
              </div>

              <div style={isMobile ? styles.summaryCardMobile : styles.summaryCard}>
                <span style={isMobile ? styles.summaryLabelMobile : styles.summaryLabel}>
                  Safe / Low Risk
                </span>

                <strong
                  style={{
                    ...(isMobile ? styles.summaryValueMobile : styles.summaryValue),
                    color: '#1AA45C',
                  }}
                >
                  {safeCount}
                </strong>
              </div>

            </div>

            {/* ROWS */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >

              {filteredHistory.map((item) => {

                const meta =
                  TYPE_META[item.checkType] ||
                  {
                    icon: linkImage,
                    title: 'Security Check',
                    color: '#5B6178',
                    bg: '#EEF0F8',
                  };

                const isOpen =
                  openId === item.id;

                const isFraud =
                  item.scam === true;

                return (

                  <div
                    key={item.id}
                    style={styles.rowCard}
                  >

                    {/* ROW MAIN */}
                    <div style={isMobile ? styles.rowMainMobile : styles.rowMain}>

                      <div style={styles.rowTopLine}>

                        {/* CHANGED IMAGE */}
                        <div
                          style={{
                            ...styles.rowIcon,
                            background: meta.bg,
                          }}
                        >
                          <img
                            src={meta.icon}
                            alt=""
                            style={styles.rowIconImage}
                          />
                        </div>

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >

                          <div style={styles.rowTitle}>
                            {meta.title}
                          </div>

                          <div
                            style={
                              isMobile
                                ? styles.rowSubtitleMobile
                                : styles.rowSubtitle
                            }
                          >
                            {item.inputSummary ||
                              item.scamCategory ||
                              'No content available'}
                          </div>

                        </div>

                        {!isMobile && (
                          <div style={styles.rowDate}>
                            {formatDate(
                              item.checkedAt
                            )}
                          </div>
                        )}

                        {!isMobile && (
                          <span
                            style={{
                              ...styles.statusBadge,
                              background: isFraud
                                ? '#FDE3E3'
                                : '#DDF6E8',
                              color: isFraud
                                ? '#E14848'
                                : '#1AA45C',
                            }}
                          >
                            {isFraud
                              ? 'Fraud'
                              : 'Not Fraud'}
                          </span>
                        )}

                        {!isMobile && (
                          <button
                            style={styles.viewButton}
                            onClick={() =>
                              toggleHistory(
                                item.id
                              )
                            }
                          >
                            {isOpen
                              ? 'Hide Details'
                              : 'View Details'}
                          </button>
                        )}

                      </div>

                      {isMobile && (
                        <div style={styles.rowBottomLine}>

                          <div style={styles.rowDate}>
                            {formatDate(
                              item.checkedAt
                            )}
                          </div>

                          <span
                            style={{
                              ...styles.statusBadge,
                              background: isFraud
                                ? '#FDE3E3'
                                : '#DDF6E8',
                              color: isFraud
                                ? '#E14848'
                                : '#1AA45C',
                            }}
                          >
                            {isFraud
                              ? 'Fraud'
                              : 'Not Fraud'}
                          </span>

                          <button
                            style={styles.viewButtonMobile}
                            onClick={() =>
                              toggleHistory(
                                item.id
                              )
                            }
                          >
                            {isOpen
                              ? 'Hide Details'
                              : 'View Details'}
                          </button>

                        </div>
                      )}

                    </div>

                    {/* EXPANDED DETAILS */}
                    {isOpen && (

                      <div
                        style={
                          styles.detailsBox
                        }
                      >

                        <div
                          style={
                            styles.detailGrid
                          }
                        >

                          <div
                            style={
                              styles.detailItem
                            }
                          >
                            <span
                              style={
                                styles.detailLabel
                              }
                            >
                              Category
                            </span>

                            <strong
                              style={
                                styles.detailValue
                              }
                            >
                              {item.scamCategory ||
                                'Unknown'}
                            </strong>
                          </div>

                          <div
                            style={
                              styles.detailItem
                            }
                          >
                            <span
                              style={
                                styles.detailLabel
                              }
                            >
                              Risk Score
                            </span>

                            <strong
                              style={
                                styles.detailValue
                              }
                            >
                              {item.riskScore ??
                                0}
                              /100
                            </strong>
                          </div>

                          <div
                            style={
                              styles.detailItem
                            }
                          >
                            <span
                              style={
                                styles.detailLabel
                              }
                            >
                              Result
                            </span>

                            <strong
                              style={{
                                ...styles.detailValue,
                                color: isFraud
                                  ? '#E14848'
                                  : '#1AA45C',
                              }}
                            >
                              {isFraud
                                ? '⚠️ Scam Detected'
                                : '✓ No Scam Detected'}
                            </strong>
                          </div>

                        </div>

                        {item.llmExplanation && (

                          <div
                            style={{
                              marginTop: '14px',
                            }}
                          >

                            <span
                              style={
                                styles.detailLabel
                              }
                            >
                              Why
                            </span>

                            <p
                              style={
                                styles.detailText
                              }
                            >
                              {item.llmExplanation}
                            </p>

                          </div>

                        )}

                        {item.recommendation && (

                          <div
                            style={{
                              marginTop: '12px',
                            }}
                          >

                            <span
                              style={
                                styles.detailLabel
                              }
                            >
                              Recommendation
                            </span>

                            <p
                              style={
                                styles.detailText
                              }
                            >
                              {item.recommendation}
                            </p>

                          </div>

                        )}

                      </div>

                    )}

                  </div>

                );
              })}

            </div>

          </div>

        )}

    </div>
  );
}

const styles = {

  page: {
    width: '100%',
    maxWidth: '920px',
    boxSizing: 'border-box',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '20px',
  },

  headerMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
  },

  heading: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#12172B',
    marginBottom: '6px',
  },

  subtext: {
    fontSize: '13.5px',
    color: '#5B6178',
    margin: 0,
  },

  clearButton: {
    flexShrink: 0,
    background: '#FFFFFF',
    color: '#12172B',
    border: '1px solid #E7E9F3',
    padding: '10px 18px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '13.5px',
    fontWeight: 600,
    boxShadow:
      '0 4px 20px rgba(20, 30, 70, 0.06)',
  },

  pillRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },

  pill: {
    padding: '8px 18px',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    background: '#EEF0F8',
    color: '#5B6178',
  },

  pillActive: {
    background: '#3B5BFE',
    color: '#FFFFFF',
  },

  mockNotice: {
    fontSize: '12.5px',
    color: '#9AA0B4',
    marginBottom: '14px',
  },

  stateBox: {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E9F3',
    padding: '40px 24px',
    textAlign: 'center',
    color: '#5B6178',
  },

  summaryRow: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },

  summaryRowMobile: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    marginBottom: '14px',
  },

  summaryCard: {
    background: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E7E9F3',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  summaryCardMobile: {
    background: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid #E7E9F3',
    padding: '10px 6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: '12px',
    color: '#9AA0B4',
  },

  summaryLabelMobile: {
    fontSize: '9px',
    color: '#9AA0B4',
    textAlign: 'center',
    lineHeight: 1.25,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },

  summaryValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#12172B',
  },

  summaryValueMobile: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#12172B',
  },

  rowCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E9F3',
    boxShadow:
      '0 4px 20px rgba(20, 30, 70, 0.06)',
    overflow: 'hidden',
  },

  rowMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
  },

  rowMainMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '14px',
    boxSizing: 'border-box',
  },

  rowTopLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },

  rowBottomLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },

  rowIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },

  rowIconImage: {
    width: '26px',
    height: '26px',
    objectFit: 'contain',
    display: 'block',
  },

  rowTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#12172B',
  },

  rowSubtitle: {
    fontSize: '12.5px',
    color: '#9AA0B4',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '340px',
  },

  rowSubtitleMobile: {
    fontSize: '12.5px',
    color: '#9AA0B4',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },

  rowDate: {
    fontSize: '12px',
    color: '#9AA0B4',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  statusBadge: {
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  viewButton: {
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid #E7E9F3',
    background: '#FFFFFF',
    color: '#3B5BFE',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  viewButtonMobile: {
    padding: '7px 12px',
    borderRadius: '10px',
    border: '1px solid #E7E9F3',
    background: '#FFFFFF',
    color: '#3B5BFE',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 'auto',
    whiteSpace: 'nowrap',
  },

  detailsBox: {
    borderTop: '1px solid #E7E9F3',
    padding: '18px',
    background: '#FAFBFF',
  },

  detailGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },

  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  detailLabel: {
    fontSize: '11.5px',
    color: '#9AA0B4',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },

  detailValue: {
    fontSize: '13.5px',
    color: '#12172B',
  },

  detailText: {
    fontSize: '13px',
    color: '#5B6178',
    lineHeight: 1.6,
    marginTop: '4px',
  },

};