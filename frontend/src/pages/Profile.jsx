// Profile page: view and edit user details, change password, and delete account with confirmation
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import authService from '../services/authService'

export default function Profile() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    email: user?.email || '',
  })
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' })
  const [showPwSection, setShowPwSection] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required.'); return }
    setSaving(true)
    try {
      await authService.updateProfile(form)
      toast.success('Profile updated successfully.')
      setEditMode(false)
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (!pwForm.old || !pwForm.new) { toast.error('Fill in all password fields.'); return }
    if (pwForm.new.length < 8) { toast.error('New password must be at least 8 characters.'); return }
    if (pwForm.new !== pwForm.confirm) { toast.error('Passwords do not match.'); return }
    setChangingPw(true)
    try {
      await authService.changePassword(pwForm.old, pwForm.new)
      toast.success('Password changed successfully.')
      setPwForm({ old: '', new: '', confirm: '' })
      setShowPwSection(false)
    } catch {
      toast.error('Failed to change password.')
    } finally {
      setChangingPw(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await authService.deleteAccount()
      authService.logout()
      navigate('/login')
    } catch {
      toast.error('Failed to delete account.')
    } finally {
      setDeleting(false)
    }
  }

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }
  const labelStyle = { display: 'block', fontSize: '11px', color: '#8fa8c8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ padding: '28px', maxWidth: '700px' }}>

          {/* Avatar + name header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '24px', background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #162a52, rgba(0,212,255,0.2))', border: '2px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cambria', fontWeight: 800, fontSize: '28px', color: '#00d4ff', flexShrink: 0 }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '20px', color: '#e8f0fe' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '13px', color: '#8fa8c8', marginTop: '4px' }}>{user?.email}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', fontSize: '11px', color: '#00d4ff' }}>Patient</span>
                <span style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.2)', fontSize: '11px', color: '#00f5c4' }}>Verified</span>
              </div>
            </div>
          </div>

          {/* Profile form */}
          <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '16px', color: '#e8f0fe' }}>Personal Details</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(0,212,255,0.25)', background: 'rgba(0,212,255,0.08)', color: '#00d4ff', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input className="input-field" style={inputStyle} name="name" value={form.name} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Age</label>
                    <input className="input-field" style={inputStyle} name="age" type="number" value={form.age} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select className="input-field" style={{ ...inputStyle, appearance: 'none' }} name="gender" value={form.gender} onChange={handleChange}>
                      <option style={{ background: '#0f2040' }} value="">Select</option>
                      <option style={{ background: '#0f2040' }} value="Male">Male</option>
                      <option style={{ background: '#0f2040' }} value="Female">Female</option>
                      <option style={{ background: '#0f2040' }} value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input className="input-field" style={inputStyle} name="phone" type="tel" value={form.phone} onChange={handleChange} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input className="input-field" style={{ ...inputStyle, opacity: 0.6 }} name="email" type="email" value={form.email} disabled />
                  <p style={{ fontSize: '11px', color: '#8fa8c8', marginTop: '4px' }}>Email cannot be changed.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button type="button" onClick={() => setEditMode(false)} style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8fa8c8', fontSize: '14px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 2, padding: '11px', borderRadius: '10px', border: 'none', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {saving ? <><div className="loading-spinner" /> Saving…</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Age', value: user?.age ? `${user.age} years` : '—' },
                  { label: 'Gender', value: user?.gender || '—' },
                  { label: 'Phone Number', value: user?.phone || '—' },
                  { label: 'Email Address', value: user?.email, full: true },
                ].map((f) => (
                  <div key={f.label} style={{ gridColumn: f.full ? '1 / -1' : undefined }}>
                    <div style={{ fontSize: '11px', color: '#8fa8c8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{f.label}</div>
                    <div style={{ fontSize: '14px', color: '#e8f0fe', fontWeight: 500 }}>{f.value || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Password */}
          <div style={{ background: 'rgba(15,32,64,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '20px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPwSection ? '20px' : 0 }}>
              <h2 style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '16px', color: '#e8f0fe' }}>Change Password</h2>
              <button onClick={() => setShowPwSection(!showPwSection)} style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#8fa8c8', fontSize: '13px', cursor: 'pointer' }}>
                {showPwSection ? 'Cancel' : 'Change'}
              </button>
            </div>

            {showPwSection && (
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s ease' }}>
                {[
                  { label: 'Current Password', name: 'old', ph: '••••••••' },
                  { label: 'New Password', name: 'new', ph: 'Min. 8 characters' },
                  { label: 'Confirm New Password', name: 'confirm', ph: 'Re-enter new password' },
                ].map((f) => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <input className="input-field" style={inputStyle} type="password" placeholder={f.ph} value={pwForm[f.name]} onChange={(e) => setPwForm((p) => ({ ...p, [f.name]: e.target.value }))} />
                  </div>
                ))}
                <button type="submit" disabled={changingPw} className="btn-primary" style={{ padding: '11px', borderRadius: '10px', border: 'none', fontSize: '14px', cursor: changingPw ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {changingPw ? <><div className="loading-spinner" /> Changing…</> : 'Update Password'}
                </button>
              </form>
            )}
          </div>

          {/* Danger Zone */}
          <div style={{ background: 'rgba(255,77,109,0.04)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' }}>
            <h2 style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '16px', color: '#ff4d6d', marginBottom: '10px' }}>Danger Zone</h2>
            <p style={{ fontSize: '13px', color: '#8fa8c8', marginBottom: '16px' }}>
              Permanently delete your account and all associated scan data. This action cannot be undone.
            </p>

            {!deleteConfirm ? (
              <button onClick={() => setDeleteConfirm(true)} style={{ padding: '9px 20px', borderRadius: '10px', border: '1px solid rgba(255,77,109,0.4)', background: 'rgba(255,77,109,0.08)', color: '#ff4d6d', fontSize: '14px', cursor: 'pointer' }}>
                Delete Account
              </button>
            ) : (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.3)', animation: 'fadeIn 0.3s ease' }}>
                <p style={{ fontSize: '13px', color: '#ff4d6d', fontWeight: 600, marginBottom: '14px' }}>
                  Are you absolutely sure? All your data will be permanently deleted.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setDeleteConfirm(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#8fa8c8', fontSize: '13px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={deleting} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(255,77,109,0.5)', background: 'rgba(255,77,109,0.15)', color: '#ff4d6d', fontSize: '13px', fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {deleting ? <><div className="loading-spinner" style={{ borderTopColor: '#ff4d6d' }} /> Deleting…</> : 'Yes, Delete My Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
