'use client';

import { MapPin, Calendar, Layers, Thermometer, Droplets, User } from 'lucide-react';

export default function PasaporteDigital({ params }) {
  // Datos simulados (luego se consumirán de la API GET /api/lotes/:id)
  const data = {
    id: params.id || '2026-X89',
    variedad: 'Geisha de Altura',
    finca: 'Finca El Mirador',
    productor: 'María Rodríguez',
    region: 'Chirripó, Costa Rica',
    altura: '1,950 msnm',
    cosecha: '15 de Mayo, 2026',
    procesos: [
      { tipo: 'Cosecha', fecha: '15 Mayo', desc: 'Manual, solo granos rojos maduros.', icon: <Calendar/> },
      { tipo: 'Fermentación', fecha: '16 Mayo', desc: '48 horas en anaeróbico.', icon: <Layers/> },
      { tipo: 'Secado', fecha: '20 Mayo', desc: 'Secado al sol en camas africanas.', icon: <Droplets/> }
    ]
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Hero Header */}
      <section className="premium-card" style={{ background: 'var(--primary)', color: '#fff', textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--secondary)', fontSize: '2rem', marginBottom: '10px' }}>Pasaporte Digital</h1>
        <p style={{ opacity: 0.9 }}>ID: {data.id}</p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.9rem' }}>
          <div>
            <p style={{ color: 'var(--secondary)', fontWeight: 700 }}>{data.altura}</p>
            <p style={{ opacity: 0.7 }}>Altitud</p>
          </div>
          <div>
            <p style={{ color: 'var(--secondary)', fontWeight: 700 }}>{data.variedad}</p>
            <p style={{ opacity: 0.7 }}>Variedad</p>
          </div>
        </div>
      </section>

      {/* Origen */}
      <section className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--background)', padding: '15px', borderRadius: '50%' }}>
          <MapPin size={32} style={{ color: 'var(--accent)' }}/>
        </div>
        <div>
          <h3 style={{ marginBottom: '4px' }}>{data.finca}</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{data.region}</p>
        </div>
      </section>

      <section className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ background: 'var(--background)', padding: '15px', borderRadius: '50%' }}>
          <User size={32} style={{ color: 'var(--accent)' }}/>
        </div>
        <div>
          <h3 style={{ marginBottom: '4px' }}>Productor</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{data.productor}</p>
        </div>
      </section>

      {/* Timeline de Trazabilidad */}
      <h3 style={{ margin: '30px 0 20px', textAlign: 'center' }}>Historia de este Grano</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {data.procesos.map((p, i) => (
          <div key={i} className="premium-card" style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '15px', alignItems: 'center' }}>
            <div style={{ color: 'var(--accent)' }}>{p.icon}</div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0 }}>{p.tipo}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{p.fecha}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '4px' }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
      <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.6 }}>
        <p style={{ fontSize: '0.8rem' }}>Verificado por ExportCoffee Blockchain Technology</p>
      </div>
    </div>
  );
}
