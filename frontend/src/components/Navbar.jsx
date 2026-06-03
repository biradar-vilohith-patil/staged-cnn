// Top navbar component: displays current page title, breadcrumb, and user avatar shortcut
import { useLocation, Link } from 'react-router-dom'
import authService from '../services/authService'

const pageTitles = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview & statistics' },
  '/scan': { title: 'New Scan', sub: 'Upload & analyze X-Ray' },
  '/result': { title: 'Scan Result', sub: 'AI prediction details' },
  '/history': { title: 'Scan History', sub: 'Previous analyses' },
  '/profile': { title: 'Profile', sub: 'Account settings' },
}

export default function Navbar() {
  const location = useLocation()
  const user = authService.getCurrentUser()
  const page = pageTitles[location.pathname] || { title: 'PneumoVision', sub: '' }

  return (
    <header
      style={{
        height: '64px',
        background: 'rgba(10,22,40,0.95)',
        // background: '#ffffff',
        borderBottom: '1px solid rgba(0,212,255,0.08)',
        //borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '17px', color: '#e8f0fe', letterSpacing: '-0.01em' }}>
          {page.title}
        </h1>
        {page.sub && (
          <p style={{ fontSize: '11px', color: '#8fa8c8', marginTop: '1px' }}>{page.sub}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(0,212,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#00d4ff',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f5c4', display: 'inline-block' }} />
          AI Engine Active
        </div>

        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #162a52, #00d4ff33)',
              border: '1px solid rgba(0,212,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Syne',
              fontWeight: 700,
              fontSize: '14px',
              color: '#00d4ff',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)')}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
        </Link>
      </div>
    </header>
  )
}
