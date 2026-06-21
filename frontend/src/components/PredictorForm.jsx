import { useState } from 'react'
import { Flame, Loader2, AlertCircle } from 'lucide-react'
import { predictRisk } from '../utils/api'

const PRESETS = [
  { label: '🟢 Low Risk',     lat: 28.61, lon: 77.20, brightness: 305, bright_t31: 292, frp: 4.2,   confidence: 38, daynight: 'D', month: 1 },
  { label: '🟡 Medium Risk',  lat: 21.14, lon: 79.08, brightness: 325, bright_t31: 300, frp: 18.5,  confidence: 67, daynight: 'D', month: 4 },
  { label: '🟠 High Risk',    lat: 15.85, lon: 74.50, brightness: 355, bright_t31: 318, frp: 58.0,  confidence: 84, daynight: 'D', month: 4 },
  { label: '🔴 Extreme Risk', lat: 23.18, lon: 82.22, brightness: 410, bright_t31: 345, frp: 210.0, confidence: 97, daynight: 'D', month: 5 },
]

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function PredictorForm({ onResult }) {
  const [form, setForm] = useState({
    latitude: '', longitude: '', brightness: '', bright_t31: '',
    frp: '', confidence: '', daynight: 'D', month: new Date().getMonth() + 1,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })) }

  const applyPreset = (p) => {
    setForm({ latitude: p.lat, longitude: p.lon, brightness: p.brightness,
              bright_t31: p.bright_t31, frp: p.frp, confidence: p.confidence,
              daynight: p.daynight, month: p.month })
    setErrors({})
    setApiError(null)
  }

  const validate = () => {
    const e = {}
    const req = ['latitude','longitude','brightness','bright_t31','frp','confidence']
    req.forEach(k => { if (form[k] === '' || form[k] === null) e[k] = 'Required' })
    if (!e.latitude  && (parseFloat(form.latitude)  < 6   || parseFloat(form.latitude)  > 38)) e.latitude  = '6–38°N'
    if (!e.longitude && (parseFloat(form.longitude) < 68  || parseFloat(form.longitude) > 98)) e.longitude = '68–98°E'
    if (!e.brightness  && (parseFloat(form.brightness)  < 300 || parseFloat(form.brightness)  > 509)) e.brightness  = '300–509 K'
    if (!e.bright_t31  && (parseFloat(form.bright_t31)  < 267 || parseFloat(form.bright_t31)  > 400)) e.bright_t31  = '267–400 K'
    if (!e.frp         && parseFloat(form.frp) < 0)                                                    e.frp         = '≥ 0'
    if (!e.confidence  && (parseFloat(form.confidence) < 0 || parseFloat(form.confidence) > 100))      e.confidence  = '0–100'
    return e
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError(null)
    try {
      const payload = {
        latitude:   parseFloat(form.latitude),
        longitude:  parseFloat(form.longitude),
        brightness: parseFloat(form.brightness),
        bright_t31: parseFloat(form.bright_t31),
        frp:        parseFloat(form.frp),
        confidence: parseFloat(form.confidence),
        daynight:   form.daynight,
        month:      parseInt(form.month),
      }
      const result = await predictRisk(payload)
      onResult(result, payload)
    } catch (e) {
      setApiError(e?.response?.data?.detail || e.message || 'Prediction failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = (k) => ({
    ...{},
    border: errors[k] ? '1px solid #ef4444' : undefined,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Presets */}
      <div>
        <div className="label" style={{ marginBottom: 8 }}>Quick Presets</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, color: '#7a8a72', cursor: 'pointer', fontSize: 12,
              padding: '8px 12px', textAlign: 'left', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ff6b35'; e.currentTarget.style.borderColor = 'rgba(255,107,53,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#7a8a72'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >{p.label}</button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <div className="label" style={{ marginBottom: 8, color: '#ff6b35' }}>📍 Location</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Latitude (6–38°N)</div>
            <input className="input-field" type="number" placeholder="e.g. 18.22" step="0.0001"
              value={form.latitude} onChange={e => set('latitude', e.target.value)} style={fieldStyle('latitude')} />
            {errors.latitude && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{errors.latitude}</div>}
          </div>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Longitude (68–98°E)</div>
            <input className="input-field" type="number" placeholder="e.g. 77.12" step="0.0001"
              value={form.longitude} onChange={e => set('longitude', e.target.value)} style={fieldStyle('longitude')} />
            {errors.longitude && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{errors.longitude}</div>}
          </div>
        </div>
      </div>

      {/* Thermal */}
      <div>
        <div className="label" style={{ marginBottom: 8, color: '#ff6b35' }}>🌡 Thermal Readings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Brightness (K)</div>
            <input className="input-field" type="number" placeholder="e.g. 345.0" step="0.1"
              value={form.brightness} onChange={e => set('brightness', e.target.value)} style={fieldStyle('brightness')} />
            {errors.brightness && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{errors.brightness}</div>}
          </div>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Bright_T31 (K)</div>
            <input className="input-field" type="number" placeholder="e.g. 310.0" step="0.1"
              value={form.bright_t31} onChange={e => set('bright_t31', e.target.value)} style={fieldStyle('bright_t31')} />
            {errors.bright_t31 && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{errors.bright_t31}</div>}
          </div>
        </div>
        {form.brightness !== '' && form.bright_t31 !== '' && (
          <div style={{ marginTop: 8, padding: '6px 12px', background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.12)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'JetBrains Mono' }}>
            <span style={{ color: '#7a8a72' }}>Thermal Delta (Δ)</span>
            <span style={{ color: '#ff6b35' }}>{(parseFloat(form.brightness||0) - parseFloat(form.bright_t31||0)).toFixed(1)} K</span>
          </div>
        )}
      </div>

      {/* Fire params */}
      <div>
        <div className="label" style={{ marginBottom: 8, color: '#ff6b35' }}>🔥 Fire Parameters</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>FRP (MW)</div>
            <input className="input-field" type="number" placeholder="e.g. 35.0" min="0" step="0.1"
              value={form.frp} onChange={e => set('frp', e.target.value)} style={fieldStyle('frp')} />
            {errors.frp && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{errors.frp}</div>}
          </div>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Confidence (%)</div>
            <input className="input-field" type="number" placeholder="e.g. 92" min="0" max="100"
              value={form.confidence} onChange={e => set('confidence', e.target.value)} style={fieldStyle('confidence')} />
            {errors.confidence && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{errors.confidence}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {/* Day/Night */}
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Day / Night</div>
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              {['D','N'].map(v => (
                <button key={v} onClick={() => set('daynight', v)} style={{
                  flex: 1, padding: '8px 0', fontSize: 12, fontFamily: 'JetBrains Mono', cursor: 'pointer', border: 'none',
                  background: form.daynight === v ? (v === 'D' ? 'rgba(234,179,8,0.2)' : 'rgba(99,102,241,0.2)') : 'transparent',
                  color: form.daynight === v ? (v === 'D' ? '#eab308' : '#818cf8') : '#4a5a42',
                  borderRight: v === 'D' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  {v === 'D' ? '☀ Day' : '☽ Night'}
                </button>
              ))}
            </div>
          </div>

          {/* Month */}
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Month</div>
            <select className="input-field" value={form.month} onChange={e => set('month', parseInt(e.target.value))}
              style={{ cursor: 'pointer' }}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i+1} style={{ background: '#0e1a09' }}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* API error */}
      {apiError && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#fca5a5', fontSize: 13 }}>
          <AlertCircle size={15} style={{ marginTop: 1, flexShrink: 0 }} />
          <span>{apiError}</span>
        </div>
      )}

      {/* Submit */}
      <button className="btn-primary" onClick={handleSubmit} disabled={loading}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {loading ? <><Loader2 size={16} className="animate-spin" /> Analysing...</> : <><Flame size={16} /> Predict Fire Risk</>}
      </button>
    </div>
  )
}
