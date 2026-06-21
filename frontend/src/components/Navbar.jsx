import { NavLink } from 'react-router-dom'
import { Flame, BarChart2, Github } from 'lucide-react'

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(7,13,4,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,107,53,0.12)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Flame size={20} color="#ff6b35" />
          <span style={{ fontWeight: 700, fontSize: 16, color: '#f0ece4' }}>
            Fire<span style={{ color: '#ff6b35' }}>Guard</span>
          </span>
        </NavLink>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <NavLink to="/" end style={({ isActive }) => ({
            textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
            color: isActive ? '#ff6b35' : '#7a8a72',
          })}>
            <Flame size={13} /> Predict
          </NavLink>

          <NavLink to="/analytics" style={({ isActive }) => ({
            textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
            color: isActive ? '#ff6b35' : '#7a8a72',
          })}>
            <BarChart2 size={13} /> Analytics
          </NavLink>

          <a href="https://github.com/Hinduja30/ForestFireRiskPredictor"
            target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, color: '#7a8a72' }}>
            <Github size={13} /> GitHub
          </a>
        </div>

        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#4a5a42' }}>
          MODIS · India · 2010–2024
        </div>
      </div>
    </nav>
  )
}
