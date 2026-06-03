// UploadScan page: patient info autofill, optional symptom checkboxes, X-Ray upload and analyze trigger
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import UploadBox from '../components/UploadBox'
import authService from '../services/authService'
import scanService from '../services/scanService'

const SYMPTOMS = ['Fever', 'Cough', 'Chest Pain', 'Fatigue', 'Shortness of Breath']

export default function UploadScan() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [file, setFile] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(false)

  function toggleSymptom(s) {
    setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  async function handleAnalyze() {
    if (!file) { toast.error('Please upload an X-Ray image first.'); return }
    setLoading(true)
    try {
      const result = await scanService.uploadAndPredict(file, symptoms, {
        name: user?.name, age: user?.age, gender: user?.gender,
      })
      navigate('/result', { state: { result, file: null } })
      sessionStorage.setItem('pv_last_result', JSON.stringify(result))
    } catch (err) {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ padding: '28px', maxWidth: '800px' }}>

          {/* Patient Info */}
          <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '16px', color: '#e8f0fe' }}>Patient Information</h2>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#00d4ff', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '2px 10px', borderRadius: '12px' }}>Auto-filled</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'FULL NAME', value: user?.name || '—' },
                { label: 'AGE', value: user?.age ? `${user.age} years` : '—' },
                { label: 'GENDER', value: user?.gender || '—' },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: '11px', color: '#8fa8c8', letterSpacing: '0.08em', marginBottom: '6px' }}>{f.label}</div>
                  <div style={{ fontSize: '14px', color: '#e8f0fe', fontWeight: 500, padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '16px', color: '#e8f0fe' }}>Symptoms</h2>
              <span style={{ fontSize: '12px', color: '#8fa8c8', marginLeft: 'auto' }}>Optional</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {SYMPTOMS.map((s) => {
                const active = symptoms.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '24px',
                      border: `1px solid ${active ? 'rgba(255,179,71,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      background: active ? 'rgba(255,179,71,0.12)' : 'rgba(255,255,255,0.03)',
                      color: active ? '#ffb347' : '#8fa8c8',
                      fontSize: '13px',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    {s}
                  </button>
                )
              })}
            </div>

            {symptoms.length > 0 && (
              <p style={{ fontSize: '12px', color: '#8fa8c8', marginTop: '12px' }}>
                {symptoms.length} symptom{symptoms.length > 1 ? 's' : ''} selected: {symptoms.join(', ')}
              </p>
            )}
          </div>

          {/* Upload */}
          <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              </div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '16px', color: '#e8f0fe' }}>Upload X-Ray</h2>
            </div>
            <UploadBox onFileSelect={setFile} selectedFile={file} />
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              fontSize: '16px',
              cursor: !file || loading ? 'not-allowed' : 'pointer',
              opacity: !file ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {loading ? (
              <>
                <div className="loading-spinner" />
                Analyzing X-Ray… This may take a moment
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M16.5 16.5l3 3"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                Analyze X-Ray
              </>
            )}
          </button>

          {loading && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#8fa8c8' }}>
                🧠 Running MobileNetV2 inference on your image…
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
