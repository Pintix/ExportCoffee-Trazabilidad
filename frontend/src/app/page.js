'use client';

import { useState } from 'react';
import { Coffee, Clipboard, Droplets, Thermometer, QrCode } from 'lucide-react';

export default function Home() {
  const [tab, setTab] = useState('register'); // 'register' or 'status'

  return (
    <div className="container animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Hola, Juan Pérez</h1>
        <p style={{ color: 'var(--muted)' }}>Gestiona la trazabilidad de tus lotes hoy.</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button 
          onClick={() => setTab('register')}
          className={`btn ${tab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, border: tab !== 'register' ? '1px solid var(--border)' : 'none' }}
        >
          Nuevo Lote
        </button>
        <button 
          onClick={() => setTab('status')}
          className={`btn ${tab === 'status' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, border: tab !== 'status' ? '1px solid var(--border)' : 'none' }}
        >
          Mis Lotes
        </button>
      </div>

      {tab === 'register' ? (
        <section className="premium-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Clipboard size={24} /> Registro de Cosecha
          </h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label>Variedad de Café</label>
              <select>
                <option>Caturra</option>
                <option>Geisha</option>
                <option>Bourbon</option>
                <option>Marsellesa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Peso Inicial (kg)</label>
              <input type="number" placeholder="Ej: 150" />
            </div>
            <div className="form-group">
              <label>Altura (msnm)</label>
              <input type="number" placeholder="Ej: 1850" />
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Registrar Lote
            </button>
          </form>
        </section>
      ) : (
        <section>
          <div className="premium-card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4 style={{ color: 'var(--accent)' }}>LOTE #2026-001</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Variedad: Geisha | 1950 msnm</p>
              </div>
              <span style={{ padding: '4px 12px', background: 'rgba(188, 108, 37, 0.1)', color: 'var(--accent)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                En Secado
              </span>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Thermometer size={16}/> 24°C</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Droplets size={16}/> 11% Hum.</span>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="btn" style={{ fontSize: '0.8rem', border: '1px solid var(--border)', flex: 1 }}>Actualizar Variables</button>
              <button className="btn" style={{ fontSize: '0.8rem', border: '1px solid var(--border)', flex: 1 }}>Ver QR</button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Summary Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
        <div className="premium-card" style={{ padding: '16px', margin: 0, textAlign: 'center' }}>
          <Coffee size={32} style={{ color: 'var(--primary)', marginBottom: '8px' }}/>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Total Kilos</p>
          <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>1,250</p>
        </div>
        <div className="premium-card" style={{ padding: '16px', margin: 0, textAlign: 'center' }}>
          <QrCode size={32} style={{ color: 'var(--accent)', marginBottom: '8px' }}/>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Pasaportes</p>
          <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>14</p>
        </div>
      </div>
    </div>
  );
}
