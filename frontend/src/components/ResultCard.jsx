import { Download, RotateCcw } from 'lucide-react'

const RISK_META = {
  Low:     { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  color: '#22c55e', emoji: '🟢' },
  Medium:  { bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.25)',  color: '#eab308', emoji: '🟡' },
  High:    { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', color: '#f97316', emoji: '🟠' },
  Extreme: { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.40)',  color: '#ef4444', emoji: '🔴' },
}

const PROB_COLORS = {
  Low: '#22c55e', Medium: '#eab308', High: '#f97316', Extreme: '#ef4444'
}

function downloadReport(result, inputs) {
  const probs = result.all_probabilities || {}
  const text = [
    'FIREGUARD — Fire Risk Assessment Report',
    '========================================',
    `Generated  : ${new Date().toLocaleString()}`,
    `Risk Level : ${result.risk}`,
    `Probability: ${result.probability}%`,
    '',
    'Input Parameters:',
    `  Latitude   : ${inputs.latitude}`,
    `  Longitude  : ${inputs.longitude}`,
    `  Brightness : ${inputs.brightness} K`,
    `  Bright_T31 : ${inputs.bright_t31} K`,
    `  FRP        : ${inputs.frp} MW`,
    `  Confidence : ${inputs.confidence}%`,
    `  Day/Night  : ${inputs.daynight}`,
    '',
    'Risk Probabilities:',
    ...Object.entries(probs).map(([k, v]) => `  ${k.padEnd(10)} : ${Number(v).toFixed(2)}%`),
    '',
    `Recommendation: ${result.recommendation}`,
    '',
    'Model: XGBoost | Dataset: NASA MODIS FIRMS India 2010-2024',
  ].join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fireguard-report-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ResultCard({ result, inputs, onReset }) {
  if (!result) return null

  const meta = RISK_META[result.risk] || RISK_META['Low']
  const probability = Number(result.probability) || 0
  const allProbs = result.all_probabilities || {}

  return (
    <div style={{
      background: meta.bg,
      border: `1px solid ${meta.border}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${meta.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#f0ece4' }}>AI Prediction Result</span>
        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: meta.color, background: meta.border, padding: '2px 8px', borderRadius: 4 }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Risk level */}
        <div style={{ textAlign: 'center' }}>
          <div className="label" style={{ marginBottom: 8 }}>Risk Level</div>
          <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'JetBrains Mono', color: meta.color, lineHeight: 1.1 }}>
            {meta.emoji} {(result.risk || '').toUpperCase()}
          </div>
          <div style={{ marginTop: 8, fontSize: 28, fontWeight: 600, fontFamily: 'JetBrains Mono', color: meta.color }}>
            {probability.toFixed(1)}%
          </div>
          <div className="label" style={{ marginTop: 2 }}>Confidence</div>
        </div>

        {/* Recommendation */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 16px' }}>
          <div className="label" style={{ marginBottom: 6 }}>Recommendation</div>
          <p style={{ fontSize: 13, color: '#c8d4c0', margin: 0, lineHeight: 1.6 }}>{result.recommendation}</p>
        </div>

        {/* Probability bars */}
        {Object.keys(allProbs).length > 0 && (
          <div>
            <div className="label" style={{ marginBottom: 12 }}>Probability Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(allProbs).map(([label, pct]) => {
                const c = PROB_COLORS[label] || '#ff6b35'
                const pctNum = Number(pct) || 0
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#7a8a72', width: 56, textAlign: 'right', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: `${pctNum}%`, height: '100%', borderRadius: 3, background: c, transition: 'width 0.7s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: c, width: 44, flexShrink: 0 }}>{pctNum.toFixed(1)}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => downloadReport(result, inputs)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: '#7a8a72', cursor: 'pointer', fontSize: 13,
          }}>
            <Download size={13} /> Download Report
          </button>
          <button onClick={onReset} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.18)',
            borderRadius: 8, color: '#ff6b35', cursor: 'pointer', fontSize: 13,
          }}>
            <RotateCcw size={13} /> New Prediction
          </button>
        </div>
      </div>
    </div>
  )
}
