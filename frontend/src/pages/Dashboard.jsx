// Dashboard page: welcome header, stats cards, prediction distribution chart, and quick-action links
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import authService from '../services/authService'
import scanService from '../services/scanService'

ChartJS.register(ArcElement, Tooltip, Legend)

function StatCard({ label, value, color, icon, sub }) {
  return (
    <div
      style={{
        background: 'rgba(15,32,64,0.8)',
        border: `1px solid ${color}22`,
        borderRadius: '16px',
        padding: '22px 24px',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${color}18` }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 0 0 80px', background: `${color}0a` }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#8fa8c8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, position: 'relative', zIndex: 1 }}>
          {icon}
        </div>
      </div>
      <div
  style={{
    fontFamily: 'Cambria',
    fontWeight: 700,
    fontSize: '28px',
    color,
    lineHeight: '1.3',
    marginBottom: '8px',
    overflowWrap: 'break-word'
  }}
></div>
      {sub && <div style={{ fontSize: '12px', color: '#8fa8c8' }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const user = authService.getCurrentUser()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    scanService.getStats().then((s) => { setStats(s); setLoading(false) })
  }, [])

  const chartData = {
    labels: ['Normal', 'Pneumonia'],
    datasets: [{
      data: stats ? [stats.normal_cases, stats.pneumonia_cases] : [0, 0],
      backgroundColor: ['rgba(0,245,196,0.8)', 'rgba(255,77,109,0.8)'],
      borderColor: ['#00f5c4', '#ff4d6d'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f2040',
        borderColor: 'rgba(0,212,255,0.2)',
        borderWidth: 1,
        titleColor: '#e8f0fe',
        bodyColor: '#8fa8c8',
        titleFont: { family: 'Cambria', weight: 'bold' },
      },
    },
    cutout: '70%',
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ padding: '28px', maxWidth: '1100px' }}>
          {/* Welcome */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,245,196,0.05) 100%)',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: '20px',
              padding: '28px 32px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#8fa8c8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {greeting}
              </div>
              <h1 style={{ fontFamily: 'Cambria', fontWeight: 800, fontSize: '26px', color: '#e8f0fe', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Welcome to PneumoVision
              </h1>
              <p style={{ color: '#8fa8c8', fontSize: '14px' }}>
                {user?.name ? `Dr. ${user.name.split(' ').pop()}, ` : ''}your AI diagnostic assistant is ready.
              </p>
            </div>
            <Link to="/scan">
              <button
                className="btn-primary"
                style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Scan
              </button>
            </Link>
          </div>

          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {loading ? (
              [1,2,3,4].map((i) => (
                <div key={i} style={{ height: '120px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              ))
            ) : (
              <>
                <StatCard label="Total Scans" value={stats?.total_scans ?? 0} color="#00d4ff" sub="All time analyses" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
                <StatCard label="Latest Result" value={stats?.latest_prediction ?? '—'} color={stats?.latest_prediction === 'Pneumonia' ? '#ff4d6d' : '#00f5c4'} sub="Most recent scan" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} />
                <StatCard label="Pneumonia Cases" value={stats?.pneumonia_cases ?? 0} color="#ff4d6d" sub="Detected infections" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
                <StatCard label="Normal Cases" value={stats?.normal_cases ?? 0} color="#00f5c4" sub="Clear results" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} />
              </>
            )}
          </div>

          {/* Chart + Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
            {/* Chart */}
            <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '16px', marginBottom: '20px', color: '#e8f0fe' }}>Prediction Distribution</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div style={{ width: '180px', height: '180px', flexShrink: 0 }}>
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    { label: 'Normal', value: stats?.normal_cases ?? 0, color: '#00f5c4' },
                    { label: 'Pneumonia', value: stats?.pneumonia_cases ?? 0, color: '#ff4d6d' },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }} />
                        <span style={{ fontSize: '14px', color: '#e8f0fe' }}>{item.label}</span>
                      </div>
                      <span style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '20px', color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8fa8c8', marginBottom: '6px' }}>
                      <span>Normal rate</span>
                      <span>
                        {stats?.total_scans > 0 ? ((stats.normal_cases / stats.total_scans) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #00f5c4, #00d4ff)', width: stats?.total_scans > 0 ? `${(stats.normal_cases / stats.total_scans) * 100}%` : '0%', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '16px', marginBottom: '16px', color: '#e8f0fe' }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { to: '/scan', label: 'Upload X-Ray', sub: 'Start new analysis', color: '#00d4ff' },
                  { to: '/history', label: 'View History', sub: 'All past scans', color: '#00f5c4' },
                  { to: '/profile', label: 'Edit Profile', sub: 'Update your info', color: '#8fa8c8' },
                ].map((item) => (
                  <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s ease', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${item.color}40`; e.currentTarget.style.background = `${item.color}08` }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: item.color, marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '11px', color: '#8fa8c8' }}>{item.sub}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
