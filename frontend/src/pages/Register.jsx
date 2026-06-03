// Register page: full user registration form with validation for all required fields
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authService from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', age: '', gender: '', phone: '', email: '', password: '', confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState(1)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validateStep1() {
    if (!form.name.trim()) { toast.error('Full name is required.'); return false }
    if (!form.age || isNaN(form.age) || +form.age < 1 || +form.age > 120) { toast.error('Enter a valid age.'); return false }
    if (!form.gender) { toast.error('Please select a gender.'); return false }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Enter a valid 10-digit phone number.'); return false }
    return true
  }

  function validateStep2() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Enter a valid email address.'); return false }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return false }
    if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return false }
    return true
  }

  function handleNext(e) {
    e.preventDefault()
    if (validateStep1()) setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    try {
      await authService.register(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }
  const labelStyle = { display: 'block', fontSize: '12px', color: '#8fa8c8', marginBottom: '6px', letterSpacing: '0.04em' }

  return (
    <div
      className="grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #07101f 0%, #0a1628 50%, #0d1e3a 100%)',
        //background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eef2ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeInUp 0.5s ease forwards' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'linear-gradient(135deg, #00d4ff, #00f5c4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <span style={{ fontFamily: 'Cambria', fontWeight: 800, fontSize: '22px', color: '#e8f0fe' }}>PneumoVision</span>
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: '20px', padding: '36px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: s === 1 ? 1 : 'none' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: step >= s ? 'linear-gradient(135deg, #00d4ff, #00f5c4)' : 'rgba(255,255,255,0.06)',
                    border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: step >= s ? '#0a1628' : '#8fa8c8',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {s}
                </div>
                <span style={{ fontSize: '12px', color: step === s ? '#e8f0fe' : '#8fa8c8' }}>
                  {s === 1 ? 'Personal Info' : 'Credentials'}
                </span>
                {s === 1 && (
                  <div style={{ flex: 1, height: '1px', background: step >= 2 ? 'linear-gradient(90deg, #00d4ff, #00f5c4)' : 'rgba(255,255,255,0.08)', margin: '0 4px', transition: 'background 0.3s ease' }} />
                )}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '20px', color: '#e8f0fe', marginBottom: '4px' }}>Personal Information</h2>

              <div>
                <label style={labelStyle}>FULL NAME</label>
                <input className="input-field" style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="Dr. Priya Sharma" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>AGE</label>
                  <input className="input-field" style={inputStyle} name="age" type="number" value={form.age} onChange={handleChange} placeholder="34" min="1" max="120" />
                </div>
                <div>
                  <label style={labelStyle}>GENDER</label>
                  <select
                    className="input-field"
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="" style={{ background: '#0f2040' }}>Select</option>
                    <option value="Male" style={{ background: '#0f2040' }}>Male</option>
                    <option value="Female" style={{ background: '#0f2040' }}>Female</option>
                    <option value="Other" style={{ background: '#0f2040' }}>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>PHONE NUMBER</label>
                <input className="input-field" style={inputStyle} name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '13px', borderRadius: '10px', border: 'none', fontSize: '15px', cursor: 'pointer', marginTop: '4px' }}>
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '20px', color: '#e8f0fe', marginBottom: '4px' }}>Account Credentials</h2>

              <div>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input className="input-field" style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@hospital.com" />
              </div>

              <div>
                <label style={labelStyle}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field"
                    style={{ ...inputStyle, paddingRight: '42px' }}
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8fa8c8', cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
                {form.password && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    {[1,2,3,4].map((i) => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: form.password.length >= i * 2 ? (form.password.length >= 8 ? '#00f5c4' : '#ffb347') : 'rgba(255,255,255,0.08)', transition: 'background 0.2s ease' }} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>CONFIRM PASSWORD</label>
                <input
                  className="input-field"
                  style={{ ...inputStyle, borderColor: form.confirm && form.confirm !== form.password ? 'rgba(255,77,109,0.5)' : undefined }}
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '13px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8fa8c8', fontSize: '14px', cursor: 'pointer' }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ flex: 2, padding: '13px', borderRadius: '10px', border: 'none', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.8 : 1 }}
                >
                  {loading ? <><div className="loading-spinner" /> Creating…</> : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#8fa8c8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
