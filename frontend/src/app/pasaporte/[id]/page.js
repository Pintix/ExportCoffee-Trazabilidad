'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Layers, Droplets, User, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

export default function PasaporteDigital({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoteData = async () => {
      try {
        const record = await pb.collection('lotes').getOne(params.id, {
          expand: 'caficultor',
        });
        
        // Cargar todos los lotes para calcular el número secuencial
        const allLotes = await pb.collection('lotes').getFullList({ sort: '-created' });
        const loteIndex = allLotes.findIndex(l => l.id === params.id);
        const numeroLote = loteIndex !== -1 ? allLotes.length - loteIndex : '?';
        
        // Cargar procesos relacionados
        const procesosRecords = await pb.collection('procesos').getFullList({
          filter: `lote = "${params.id}"`,
          sort: '-created',
        });

        const formattedData = {
          id: record.id,
          numero: numeroLote,
          variedad: record.variedad,
          altura: record.altura,
          peso_inicial: record.peso_inicial,
          fecha_cosecha: record.fecha_cosecha,
          caficultor: record.expand?.caficultor || { nombre: 'Desconocido', finca: 'N/A', region: 'N/A' },
          procesos: procesosRecords.map(p => ({
            id: p.id,
            tipo: p.tipo,
            sub_tipo: p.sub_tipo,
            temperatura_promedio: p.temperatura,
            humedad_promedio: p.humedad,
            notas: p.notas,
            fecha: p.created
          }))
        };

        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLoteData();
  }, [params.id]);

  if (loading) {
    return <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--muted)' }}>Cargando información del pasaporte...</div>;
  }

  if (error || !data) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Error</h2>
        <p style={{ color: 'var(--muted)' }}>{error || 'No se pudo cargar la información del lote.'}</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  const { caficultor, procesos } = data;
  
  const downloadPassportImage = () => {
    const element = document.getElementById('passport-content');
    html2canvas(element, {
      backgroundColor: '#121212', // Match our dark theme
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Pasaporte-Lote-${data.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // Mock inicial de procesos si la bd aún no tiene procesos detallados para el lote
  const displayProcesos = procesos && procesos.length > 0 ? procesos.map(p => ({
    tipo: p.tipo,
    fecha: new Date(p.fecha || p.created || Date.now()).toLocaleDateString(),
    desc: p.notas || `Subtipo: ${p.sub_tipo || 'N/A'}, Temp: ${p.temperatura_promedio || 'N/A'}, Hum: ${p.humedad_promedio || 'N/A'}`,
    icon: <Layers/>
  })) : [
    { tipo: 'Cosecha', fecha: new Date(data.fecha_cosecha || Date.now()).toLocaleDateString(), desc: 'Registro inicial del lote y recolección de granos maduros.', icon: <Calendar/> }
  ];

  // Construir query de búsqueda para Google Maps
  const mapQuery = caficultor ? `${caficultor.finca}, ${caficultor.region}, Costa Rica` : 'Costa Rica';

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Volver
        </Link>
        <button 
          onClick={downloadPassportImage}
          className="btn" 
          style={{ fontSize: '0.8rem', border: '1px solid var(--border)', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={16} /> Guardar Imagen
        </button>
      </div>

      <div id="passport-content" style={{ padding: '10px' }}>
        {/* Hero Header */}
      <section className="premium-card" style={{ background: 'var(--primary)', color: '#fff', textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--secondary)', fontSize: '2.2rem', marginBottom: '10px' }}>Pasaporte Digital</h1>
        <p style={{ opacity: 0.9, letterSpacing: '1px' }}>LOTE {data.numero}</p>
        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '1.2rem' }}>{data.altura} msnm</p>
            <p style={{ opacity: 0.7 }}>Altitud</p>
          </div>
          <div>
            <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '1.2rem' }}>{data.variedad}</p>
            <p style={{ opacity: 0.7 }}>Variedad</p>
          </div>
          <div>
            <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '1.2rem' }}>{data.peso_inicial} kg</p>
            <p style={{ opacity: 0.7 }}>Peso Inicial</p>
          </div>
        </div>
      </section>

      {/* Origen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <section className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: 0 }}>
          <div style={{ background: 'var(--background)', padding: '15px', borderRadius: '50%' }}>
            <MapPin size={32} style={{ color: 'var(--accent)' }}/>
          </div>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: '1.2rem' }}>{caficultor?.finca || 'Finca no registrada'}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{caficultor?.region || 'Región no registrada'}</p>
          </div>
        </section>

        <section className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: 0 }}>
          <div style={{ background: 'var(--background)', padding: '15px', borderRadius: '50%' }}>
            <User size={32} style={{ color: 'var(--accent)' }}/>
          </div>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: '1.2rem' }}>Productor</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{caficultor?.nombre || 'Desconocido'}</p>
          </div>
        </section>
      </div>

      {/* Mapa de Google */}
      <h3 style={{ margin: '40px 0 20px', textAlign: 'center', color: 'var(--foreground)' }}>Ubicación de Origen</h3>
      <div className="premium-card" style={{ padding: 0, overflow: 'hidden', height: '350px', border: '1px solid var(--border)' }}>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
        ></iframe>
      </div>

      {/* Timeline de Trazabilidad */}
      <h3 style={{ margin: '40px 0 20px', textAlign: 'center', color: 'var(--foreground)' }}>Historia de este Grano</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {displayProcesos.map((p, i) => (
          <div key={i} className="premium-card" style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '15px', alignItems: 'center' }}>
            <div style={{ color: 'var(--accent)', background: 'var(--background)', padding: '10px', borderRadius: '50%', display: 'flex', justifyContent: 'center' }}>
              {p.icon}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, color: 'var(--foreground)' }}>{p.tipo}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, background: 'var(--background)', padding: '2px 8px', borderRadius: '12px' }}>{p.fecha}</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
        <div style={{ marginTop: '50px', textAlign: 'center', opacity: 0.7 }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Verificado por ExportCoffee Trazabilidad Integral</p>
        </div>
      </div>
    </div>
  );
}
