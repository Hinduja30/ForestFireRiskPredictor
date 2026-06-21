import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { fetchStats } from '../utils/api'

const YEARLY = [
  { year: '2010', records: 76668 }, { year: '2011', records: 72372 },
  { year: '2012', records: 93150 }, { year: '2013', records: 71173 },
  { year: '2014', records: 76416 }, { year: '2015', records: 68433 },
  { year: '2016', records: 88809 }, { year: '2017', records: 82545 },
  { year: '2018', records: 91110 }, { year: '2019', records: 75502 },
  { year: '2020', records: 76021 }, { year: '2021', records: 111267 },
  { year: '2022', records: 81525 }, { year: '2023', records: 78425 },
  { year: '2024', records: 74029 },
]

const MONTHLY = [
  { month: 'Jan', v: 48200 }, { month: 'Feb', v: 62400 }, { month: 'Mar', v: 142000 },
  { month: 'Apr', v: 198000 }, { month: 'May', v: 168000 }, { month: 'Jun', v: 58000 },
  { month: 'Jul', v: 28000 }, { month: 'Aug', v: 24000 }, { month: 'Sep', v: 31000 },
  { month: 'Oct', v: 52000 }, { month: 'Nov', v: 82000 }, { month: 'Dec', v: 64000 },
]

const RISK_DIST = [
  { name: 'Low', value: 142639, color: '#22c55e' },
  { name: 'Medium', value: 901985, color: '#eab308' },
  { name: 'High', value: 140835, color: '#f97316' },
  { name: 'Extreme', value: 31986, color: '#ef4444' },
]

const FEATURES = [
  { name: 'FRP', pct: 31, color: '#ef4444' }, { name: 'Confidence', pct: 27, color: '#f97316' },
  { name: 'Thermal Δ', pct: 18, color: '#eab308' }, { name: 'Brightness', pct: 10, color: '#22c55e' },
  { name: 'Month', pct: 6, color: '#06b6d4' }, { name: 'Bright_T31', pct: 4, color: '#818cf8' },
  { name: 'Lat/Lon', pct: 3, color: '#a78bfa' }, { name: 'Day/Night', pct: 1, color: '#4a5a42' },
]

const ttStyle = { background: '#0e1a09', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 6, fontSize: 11, fontFamily: 'JetBrains Mono' }

const TOTAL = 1217445

export default function Analytics() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  useEffect(() => { fetchStats().then(setStats).catch(() => {}) }, [])

  const dist = stats?.class_distribution || { Low: 142639, Medium: 901985, High: 140835, Extreme: 31986 }

  return (
    <div style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 1000, margin: '0 auto', padding: '88px 24px 60px' }}>

      <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4a5a42', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 32 }}
        onMouseEnter={e => e.currentTarget.style.color = '#ff6b35'} onMouseLeave={e => e.currentTarget.style.color = '#4a5a42'}>
        <ArrowLeft size={14} /> Back to Predictor
      </button>

      <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f0ece4', margin: '0 0 6px' }}>
        Analytics <span style={{ background: 'linear-gradient(135deg,#ff6b35,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
      </h1>
      <p style={{ color: '#7a8a72', fontSize: 14, margin: '0 0 40px' }}>NASA MODIS FIRMS India 2010–2024 · 1,217,445 records · XGBoost 99.67%</p>

      {/* Stat pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 40 }}>
        {[['1,217,445','Total Records','#ff6b35'],['99.67%','Test Accuracy','#22c55e'],['15','Years Covered','#818cf8'],['9','Features','#eab308']].map(([v,l,c]) => (
          <div key={l} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 22, color: c }}>{v}</div>
            <div style={{ fontSize: 12, color: '#4a5a42', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 32 }} />

      {/* Yearly trend */}
      <div className="label" style={{ marginBottom: 12 }}>Yearly Fire Detections (2010–2024)</div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={YEARLY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ff6b35" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="year" tick={{ fill: '#4a5a42', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={2} />
          <YAxis tick={{ fill: '#4a5a42', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
          <Tooltip contentStyle={ttStyle} labelStyle={{ color: '#f0ece4' }} itemStyle={{ color: '#ff6b35' }} formatter={v => [v.toLocaleString(), 'Detections']} />
          <Area type="monotone" dataKey="records" stroke="#ff6b35" strokeWidth={1.5} fill="url(#ag)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '32px 0' }} />

      {/* Monthly seasonality */}
      <div className="label" style={{ marginBottom: 12 }}>Monthly Seasonality (15-yr avg)</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={MONTHLY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#4a5a42', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#4a5a42', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
          <Tooltip contentStyle={ttStyle} formatter={v => [v.toLocaleString(), 'Avg detections']} />
          <Bar dataKey="v" radius={[2,2,0,0]} maxBarSize={22}>
            {MONTHLY.map((d,i) => <Cell key={i} fill={d.v>100000?'#ef4444':d.v>60000?'#f97316':'#ff6b35'} fillOpacity={0.75} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '32px 0' }} />

      {/* Risk distribution */}
      <div className="label" style={{ marginBottom: 16 }}>Risk Class Distribution</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RISK_DIST.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#7a8a72', width: 56, textAlign: 'right', flexShrink: 0 }}>{d.name}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ width: `${(d.value/TOTAL)*100}%`, height: '100%', borderRadius: 3, background: d.color }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: d.color, width: 120, flexShrink: 0 }}>
              {((d.value/TOTAL)*100).toFixed(1)}% · {d.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '32px 0' }} />

      {/* Feature importance */}
      <div className="label" style={{ marginBottom: 16 }}>Feature Importance</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FEATURES.map(f => (
          <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#7a8a72', width: 72, textAlign: 'right', flexShrink: 0 }}>{f.name}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ width: `${(f.pct/31)*100}%`, height: '100%', borderRadius: 3, background: f.color }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: f.color, width: 36, flexShrink: 0 }}>{f.pct}%</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '32px 0' }} />

      {/* Model config */}
      <div className="label" style={{ marginBottom: 16 }}>Model Configuration</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[['Algorithm','XGBoost Classifier'],['n_estimators','300'],['max_depth','8'],['learning_rate','0.05'],['Test Accuracy','99.67%'],['Train samples','973,956'],['Test samples','243,489'],['Features','9']].map(([k,v],i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: '#4a5a42' }}>{k}</span>
            <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: k === 'Test Accuracy' ? '#22c55e' : '#c8d4c0', fontWeight: k === 'Test Accuracy' ? 600 : 400 }}>{v}</span>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, fontFamily: 'JetBrains Mono', color: '#2d3d28', marginTop: 40 }}>
        FireGuard Analytics · NASA MODIS FIRMS · India 2010–2024
      </p>
    </div>
  )
}
