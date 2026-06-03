// Result page: displays AI prediction, confidence ring, risk level, explanation, and Grad-CAM heatmap
import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import PredictionCard from '../components/PredictionCard'
import scanService from '../services/scanService'

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('pv_last_result')
    if (location.state?.result) {
      setResult(location.state.result)
    } else if (stored) {
      setResult(JSON.parse(stored))
    } else {
      navigate('/scan')
    }
  }, [])

  async function handleSave() {
    setSaving(true)
    // TODO: Replace with real save API call
    // await scanService.saveScan(result.id)
    await new Promise((r) => setTimeout(r, 600))
    setSaved(true)
    toast.success('Scan result saved successfully.')
    setSaving(false)
  }

  async function handleDownload() {
    if (!result?.id) { toast.error('No scan ID to download.'); return }
    setDownloading(true)
    await scanService.downloadReport(result.id)
    toast.success('Report download started.')
    setDownloading(false)
  }

  if (!result) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner" />
        </div>
      </div>
    )
  }

  const isPneumonia = result.prediction === 'Pneumonia'
  const predColor = isPneumonia ? '#ff4d6d' : '#00f5c4'

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ padding: '28px', maxWidth: '960px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '20px', color: '#e8f0fe' }}>Analysis Complete</h2>
              <p style={{ fontSize: '13px', color: '#8fa8c8', marginTop: '3px' }}>
                Scan ID: #{result.id} &nbsp;·&nbsp; Processed by MobileNetV2
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: `1px solid ${saved ? 'rgba(0,245,196,0.3)' : 'rgba(0,212,255,0.3)'}`,
                  background: saved ? 'rgba(0,245,196,0.1)' : 'rgba(0,212,255,0.08)',
                  color: saved ? '#00f5c4' : '#00d4ff',
                  fontSize: '13px',
                  cursor: saving || saved ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {saving ? <div className="loading-spinner" style={{ width: '14px', height: '14px' }} /> : saved ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}
                {saved ? 'Saved' : saving ? 'Saving…' : 'Save Result'}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#e8f0fe', fontSize: '13px', cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {downloading ? <div className="loading-spinner" style={{ width: '14px', height: '14px' }} /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
                PDF Report
              </button>
            </div>
          </div>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* X-Ray image */}
            <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '12px', color: '#8fa8c8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
                Uploaded X-Ray
              </div>
              <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '240px', position: 'relative' }}>
                {result.image_url ? (
                  <img src={result.image_url} alt="X-Ray" style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block' }} />
                ) : (
                  <div style={{ color: '#8fa8c8', fontSize: '13px' }}>Image not available</div>
                )}
              </div>

              {/* Heatmap toggle */}
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '9px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,179,71,0.25)',
                  background: showHeatmap ? 'rgba(255,179,71,0.1)' : 'rgba(255,179,71,0.05)',
                  color: '#ffb347',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                {showHeatmap ? 'Hide Grad-CAM Heatmap' : 'Show Grad-CAM Heatmap'}
              </button>

              {showHeatmap && (
                <div style={{ marginTop: '12px', padding: '16px', borderRadius: '10px', background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.15)', animation: 'fadeIn 0.3s ease' }}>
                  {result.heatmap_url ? (
                    <img src={result.heatmap_url} alt="Heatmap" style={{ width: '100%', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.5 }}>🔥</div>
                      <p style={{ fontSize: '12px', color: '#8fa8c8' }}>Grad-CAM heatmap will appear here after the backend generates it.</p>
                    </div>
                  )}
                  <p style={{ fontSize: '11px', color: '#8fa8c8', marginTop: '10px', lineHeight: 1.5 }}>
                    Highlighted regions indicate areas that contributed most strongly to the model's prediction.
                  </p>
                </div>
              )}
            </div>

            {/* Prediction card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <PredictionCard prediction={result.prediction} confidence={result.confidence} />

              {/* AI Explanation */}
              <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontSize: '12px', color: '#00d4ff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Explanation</span>
                </div>
                <p style={{ fontSize: '14px', color: '#c8d8f0', lineHeight: 1.7 }}>
                  {result.explanation}
                </p>

                <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: isPneumonia ? 'rgba(255,77,109,0.06)' : 'rgba(0,245,196,0.06)', border: `1px solid ${predColor}20` }}>
                  <p style={{ fontSize: '12px', color: '#8fa8c8', lineHeight: 1.6 }}>
                    <strong style={{ color: predColor }}>Note: </strong>
                    {isPneumonia
                      ? 'This is an AI-assisted screening tool. Please consult a qualified radiologist or pulmonologist for a clinical diagnosis.'
                      : 'No abnormalities detected. Continue routine health check-ups as advised by your healthcare provider.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/scan">
              <button className="btn-primary" style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Scan
              </button>
            </Link>
            <Link to="/history">
              <button style={{ padding: '12px 28px', borderRadius: '12px', border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.06)', color: '#00d4ff', fontSize: '14px', cursor: 'pointer' }}>
                View History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
