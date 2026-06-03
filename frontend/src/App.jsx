// Root App component: defines all routes and wraps authenticated pages with layout
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadScan from './pages/UploadScan'
import Result from './pages/Result'
import History from './pages/History'
import Profile from './pages/Profile'

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
