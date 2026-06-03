// Root App component: defines all routes and wraps authenticated pages with layout
import { Routes, Route, Navigate } from 'react-router-dom'

// CRITICAL FIX: Vite requires explicit .jsx extensions for these relative imports
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadScan from './pages/UploadScan.jsx'
import Result from './pages/Result.jsx'
import History from './pages/History.jsx'
import Profile from './pages/Profile.jsx'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('pv_token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={<PrivateRoute><Dashboard /></PrivateRoute>}
      />
      <Route
        path="/scan"
        element={<PrivateRoute><UploadScan /></PrivateRoute>}
      />
      <Route
        path="/result"
        element={<PrivateRoute><Result /></PrivateRoute>}
      />
      <Route
        path="/history"
        element={<PrivateRoute><History /></PrivateRoute>}
      />
      <Route
        path="/profile"
        element={<PrivateRoute><Profile /></PrivateRoute>}
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}