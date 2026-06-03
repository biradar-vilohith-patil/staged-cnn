// PredictionCard component: shows prediction label, confidence score, and color-coded risk indicator
export default function PredictionCard({ prediction, confidence }) {
  const isPneumonia = prediction === 'Pneumonia'
  const conf = parseFloat(confidence)

  const riskLevel = isPneumonia
    ? conf >= 90 ? 'High Risk' : conf >= 75 ? 'Moderate Risk' : 'Low Risk'
    : 'Low Risk'

  const riskColor = riskLevel === 'High Risk' ? '#ff4d6d' : riskLevel === 'Moderate Risk' ? '#ffb347' : '#00f5c4'
  const riskBg = riskLevel === 'High Risk' ? 'rgba(255,77,109,0.1)' : riskLevel === 'Moderate Risk' ? 'rgba(255,179,71,0.1)' : 'rgba(0,245,196,0.1)'
  const riskBorder = riskLevel === 'High Risk' ? 'rgba(255,77,109,0.25)' : riskLevel === 'Moderate Risk' ? 'rgba(255,179,71,0.25)' : 'rgba(0,245,196,0.25)'

  const predColor = isPneumonia ? '#ff4d6d' : '#00f5c4'
  const predBg = isPneumonia ? 'rgba(255,77,109,0.08)' : 'rgba(0,245,196,0.08)'
  const predBorder = isPneumonia ? 'rgba(255,77,109,0.2)' : 'rgba(0,245,196,0.2)'

  const circumference = 2 * Math.PI * 42
  const offset = circumference - (conf / 100) * circumference

  return (
    <div
      style={{
        background: 'rgba(15,32,64,0.8)',
        border: `1px solid ${predBorder}`,
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#8fa8c8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            AI Prediction
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '24px',
              background: predBg,
              border: `1px solid ${predBorder}`,
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: predColor, display: 'block' }} />
            <span style={{ fontFamily: 'Cambria', fontWeight: 700, fontSize: '20px', color: predColor }}>
              {prediction}
            </span>
          </div>
        </div>

        {/* Confidence ring */}
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={predColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'Cambria', fontWeight: 800, fontSize: '20px', color: predColor }}>
              {conf.toFixed(1)}%
            </span>
            <span style={{ fontSize: '9px', color: '#8fa8c8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Risk indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '10px',
          background: riskBg,
          border: `1px solid ${riskBorder}`,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={riskColor} strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span style={{ fontSize: '13px', fontWeight: 600, color: riskColor }}>{riskLevel}</span>
        <span style={{ fontSize: '12px', color: '#8fa8c8', marginLeft: 'auto' }}>
          {isPneumonia
            ? 'Consult a pulmonologist'
            : 'No immediate action needed'}
        </span>
      </div>
    </div>
  )
}
