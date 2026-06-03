// History page: fetches and displays all past scans with search, filter, download, and delete support
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import HistoryTable from '../components/HistoryTable'
import scanService from '../services/scanService'

export default function History() {
  const [scans, setScans] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    scanService.getHistory().then((data) => {
      setScans(data)
      setFiltered(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let result = [...scans]
    if (filterType !== 'All') {
      result = result.filter((s) => s.prediction === filterType)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((s) =>
        s.file_name.toLowerCase().includes(q) ||
        s.prediction.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, filterType, scans])

  async function handleDelete(id) {
    try {
      await scanService.deleteScan(id)
      setScans((prev) => prev.filter((s) => s.id !== id))
      toast.success('Scan deleted.')
    } catch {
      toast.error('Failed to delete scan.')
    }
  }

  async function handleDownload(id) {
    try {
      await scanService.downloadReport(id)
      toast.success('Report download started.')
    } catch {
      toast.error('Failed to generate report.')
    }
  }

  const total = scans.length
  const pneumoniaCount = scans.filter((s) => s.prediction === 'Pneumonia').length
  const normalCount = scans.filter((s) => s.prediction === 'Normal').length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ padding: '28px', maxWidth: '1100px' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Records', value: total, color: '#00d4ff' },
              { label: 'Pneumonia', value: pneumoniaCount, color: '#ff4d6d' },
              { label: 'Normal', value: normalCount, color: '#00f5c4' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'rgba(15,32,64,0.8)', border: `1px solid ${s.color}20`, borderRadius: '14px', padding: '18px 22px', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontFamily: 'Cambria', fontWeight: 800, fontSize: '28px', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#8fa8c8' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Main panel */}
          <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '17px', color: '#e8f0fe' }}>Scan History</h2>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8fa8c8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    className="input-field"
                    style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '10px', fontSize: '13px', width: '200px' }}
                    placeholder="Search scans…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Filter buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['All', 'Normal', 'Pneumonia'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${filterType === f ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        background: filterType === f ? 'rgba(0,212,255,0.1)' : 'transparent',
                        color: filterType === f ? '#00d4ff' : '#8fa8c8',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontWeight: filterType === f ? 600 : 400,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <Link to="/scan">
                  <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New Scan
                  </button>
                </Link>
              </div>
            </div>

            <HistoryTable scans={filtered} onDelete={handleDelete} onDownload={handleDownload} loading={loading} />

            {!loading && filtered.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#8fa8c8' }}>
                  Showing {filtered.length} of {total} record{total !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
