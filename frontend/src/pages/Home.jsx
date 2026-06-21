import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, BarChart2 } from 'lucide-react'
import PredictorForm from '../components/PredictorForm'
import ResultCard from '../components/ResultCard'

export default function Home() {
  const [result, setResult] = useState(null)
  const [inputs, setInputs] = useState(null)
  const navigate = useNavigate()

  const handleResult = (res, inp) => {
    setResult(res)
    setInputs(inp)
    setTimeout(() => {
      document.getElementById('result-anchor')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 999, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)', fontSize: 11, fontFamily: 'JetBrains Mono', color: '#ff6b35', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          NASA MODIS · FIRMS India · 2010–2024
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: '#f0ece4', margin: '0 0 12px', lineHeight: 1.2 }}>
          Forest Fire{' '}
          <span style={{ background: 'linear-gradient(135deg, #ff6b35, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Risk Prediction
          </span>
        </h1>
        <p style={{ fontSize: 15, color: '#7a8a72', maxWidth: 520, margin: '0 auto' }}>
          XGBoost trained on 1.2M real satellite fire detections across India. Enter MODIS parameters for instant risk assessment.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 24, flexWrap: 'wrap' }}>
          {[['1.2M+','MODIS records'],['99.67%','Accuracy'],['15 yrs','Data span'],['4','Risk levels']].map(([v,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={13} color="#ff6b35" />
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 13, color: '#f0ece4' }}>{v}</span>
              <span style={{ fontSize: 13, color: '#4a5a42' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Flame size={16} color="#ff6b35" />
            <span style={{ fontWeight: 600, fontSize: 14, color: '#f0ece4' }}>Satellite Data Input</span>
          </div>
          <PredictorForm onResult={handleResult} />
        </div>

        {/* Result */}
        <div id="result-anchor">
          {result ? (
            <ResultCard result={result} inputs={inputs} onReset={() => { setResult(null); setInputs(null) }} />
          ) : (
            <div className="card" style={{ padding: 40, textAlign: 'center', border: '1px dashed rgba(255,107,53,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minHeight: 300, justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={24} color="rgba(255,107,53,0.5)" />
              </div>
              <div>
                <p style={{ color: '#4a5a42', fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>Awaiting prediction</p>
                <p style={{ color: '#2d3d28', fontSize: 12, margin: 0 }}>Fill the form and click "Predict Fire Risk"</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', maxWidth: 340 }}>
                {[['#22c55e','🟢 Low Risk','Routine monitoring'],['#eab308','🟡 Medium Risk','Elevated vigilance'],['#f97316','🟠 High Risk','Alert response teams'],['#ef4444','🔴 Extreme Risk','Immediate action']].map(([c,l,d]) => (
                  <div key={l} style={{ padding: '10px 12px', borderRadius: 8, background: c+'0d', border: `1px solid ${c}22`, textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c }}>{l}</div>
                    <div style={{ fontSize: 11, color: '#4a5a42', marginTop: 2 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics CTA */}
      <div style={{ marginTop: 32, padding: 20, borderRadius: 12, background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,107,53,0.12)' }}>
            <BarChart2 size={18} color="#ff6b35" />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#f0ece4' }}>Explore Dataset Analytics</p>
            <p style={{ margin: 0, fontSize: 12, color: '#7a8a72' }}>15-year MODIS trends, class distribution, feature importance & model details</p>
          </div>
        </div>
        <button onClick={() => navigate('/analytics')} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
          background: 'linear-gradient(135deg, #ff6b35, #e8521a)', border: 'none',
          borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', flexShrink: 0,
        }}>
          <BarChart2 size={14} /> View Analytics →
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 40, fontSize: 11, fontFamily: 'JetBrains Mono', color: '#2d3d28' }}>
        FireGuard · XGBoost · NASA MODIS FIRMS · India 2010–2024
      </div>
    </div>
  )
}
