// UploadBox component: drag-and-drop or browse file upload with image preview and validation
import { useState, useRef, useCallback } from 'react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 10 * 1024 * 1024

export default function UploadBox({ onFileSelect, selectedFile }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function validateFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only JPG, JPEG, and PNG files are supported.'
    }
    if (file.size > MAX_SIZE) {
      return 'File size must be under 10 MB.'
    }
    return null
  }

  function handleFile(file) {
    const err = validateFile(file)
    if (err) {
      setError(err)
      return
    }
    setError('')
    onFileSelect(file)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setDragging(false), [])

  function onInputChange(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#00d4ff' : selectedFile ? 'rgba(0,245,196,0.4)' : 'rgba(0,212,255,0.25)'}`,
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
          cursor: selectedFile ? 'default' : 'pointer',
          background: dragging
            ? 'rgba(0,212,255,0.06)'
            : selectedFile
            ? 'rgba(0,245,196,0.04)'
            : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {selectedFile && previewUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={previewUrl}
                alt="X-Ray Preview"
                style={{
                  maxHeight: '260px',
                  maxWidth: '100%',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,245,196,0.3)',
                  filter: 'brightness(0.95)',
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFileSelect(null)
                  if (inputRef.current) inputRef.current.value = ''
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255,77,109,0.9)',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#00f5c4', fontWeight: 500 }}>
                ✓ {selectedFile.name}
              </div>
              <div style={{ fontSize: '11px', color: '#8fa8c8', marginTop: '2px' }}>
                {(selectedFile.size / 1024).toFixed(0)} KB
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                background: 'transparent',
                border: '1px solid rgba(0,212,255,0.3)',
                color: '#00d4ff',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Replace Image
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p style={{ color: '#e8f0fe', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>
              Drag & drop your X-Ray here
            </p>
            <p style={{ color: '#8fa8c8', fontSize: '13px', marginBottom: '16px' }}>
              or click to browse files
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {['JPG', 'JPEG', 'PNG'].map((fmt) => (
                <span
                  key={fmt}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.15)',
                    fontSize: '11px',
                    color: '#00d4ff',
                    letterSpacing: '0.05em',
                  }}
                >
                  {fmt}
                </span>
              ))}
            </div>
            <p style={{ color: '#8fa8c8', fontSize: '11px', marginTop: '10px' }}>Max size: 10 MB</p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: '#ff4d6d', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
