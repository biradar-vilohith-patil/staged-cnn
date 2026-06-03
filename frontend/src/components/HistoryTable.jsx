// HistoryTable component: renders paginated scan records with action buttons for each row
import { useState } from 'react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function HistoryTable({ scans, onDelete, onDownload, loading }) {
  const [deletingId, setDeletingId] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)

  async function handleDelete(id) {
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  async function handleDownload(id) {
    setDownloadingId(id)
    await onDownload(id)
    setDownloadingId(null)
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: '#8fa8c8', fontSize: '14px' }}>Loading history…</p>
      </div>
    )
  }

  if (!scans || scans.length === 0) {
    return (
      <div
        style={{
          padding: '56px',
          textAlign: 'center',
          border: '1px dashed rgba(0,212,255,0.15)',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>🫁</div>
        <p style={{ color: '#8fa8c8', fontSize: '14px' }}>No scan history found.</p>
        <p style={{ color: '#8fa8c8', fontSize: '12px', marginTop: '4px' }}>Upload your first X-Ray to get started.</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Date & Time', 'File Name', 'Prediction', 'Confidence', 'Actions'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '11px',
                  color: '#8fa8c8',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(0,212,255,0.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scans.map((scan, i) => {
            const isPneumonia = scan.prediction === 'Pneumonia'
            const predColor = isPneumonia ? '#ff4d6d' : '#00f5c4'

            return (
              <tr
                key={scan.id}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.15s ease',
                  animationDelay: `${i * 0.05}s`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,212,255,0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8fa8c8', whiteSpace: 'nowrap' }}>
                  {formatDate(scan.created_at)}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#e8f0fe', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {scan.file_name}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: isPneumonia ? 'rgba(255,77,109,0.1)' : 'rgba(0,245,196,0.1)',
                      border: `1px solid ${isPneumonia ? 'rgba(255,77,109,0.25)' : 'rgba(0,245,196,0.25)'}`,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: predColor,
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: predColor }} />
                    {scan.prediction}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        flex: 1,
                        maxWidth: '80px',
                        height: '4px',
                        borderRadius: '2px',
                        background: 'rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${scan.confidence}%`,
                          height: '100%',
                          borderRadius: '2px',
                          background: `linear-gradient(90deg, ${predColor}88, ${predColor})`,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '13px', color: predColor, fontWeight: 600, minWidth: '42px' }}>
                      {parseFloat(scan.confidence).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDownload(scan.id)}
                      disabled={downloadingId === scan.id}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        background: 'rgba(0,212,255,0.08)',
                        border: '1px solid rgba(0,212,255,0.2)',
                        color: '#00d4ff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: downloadingId === scan.id ? 0.6 : 1,
                      }}
                    >
                      {downloadingId === scan.id ? (
                        <div className="loading-spinner" style={{ width: '12px', height: '12px' }} />
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      )}
                      PDF
                    </button>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      disabled={deletingId === scan.id}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,77,109,0.08)',
                        border: '1px solid rgba(255,77,109,0.2)',
                        color: '#ff4d6d',
                        fontSize: '12px',
                        cursor: 'pointer',
                        opacity: deletingId === scan.id ? 0.6 : 1,
                      }}
                    >
                      {deletingId === scan.id ? (
                        <div className="loading-spinner" style={{ width: '12px', height: '12px', borderTopColor: '#ff4d6d' }} />
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
