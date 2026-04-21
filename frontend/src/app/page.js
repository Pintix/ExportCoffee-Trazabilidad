'use client';

import { useState, useEffect } from 'react';
import { Coffee, Clipboard, Droplets, Thermometer, QrCode, RefreshCw, Calendar, Users, MapPin, Layers, X, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function Home() {
  const [tab, setTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [caficultores, setCaficultores] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [qrLote, setQrLote] = useState(null);
  const [serverIP, setServerIP] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setServerIP(window.location.hostname + ':' + window.location.port);
    }
  }, []);

  // Estados del formulario de Lotes
  const [formData, setFormData] = useState({
    variedad: 'Caturra',
    peso_inicial: '',
    altura: '',
    caficultor_id: ''
  });

  // Estado del formulario de Productores
  const [provData, setProvData] = useState({
    nombre: '',
    finca: '',
    region: ''
  });
  
  // Estado del formulario de Procesos
  const [processData, setProcessData] = useState({
    lote_id: '',
    tipo: 'fermentacion',
    sub_tipo: 'Lavado',
    temperatura_promedio: '',
    humedad_promedio: '',
    notas: ''
  });

  // Cargar lotes
  const fetchLotes = async () => {
    setLoadingList(true);
    try {
      const response = await fetch('http://localhost:4000/api/lotes');
      if (response.ok) {
        const data = await response.json();
        setLotes(data);
      }
    } catch (error) {
      console.error('Error fetching lotes:', error);
    } finally {
      setLoadingList(false);
    }
  };

  // Cargar caficultores
  const fetchCaficultores = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/caficultores');
      if (response.ok) {
        const data = await response.json();
        setCaficultores(data);
        if (data.length > 0 && !formData.caficultor_id) {
          setFormData(prev => ({ ...prev, caficultor_id: data[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching caficultores:', error);
    }
  };

  const fetchLotesOnly = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/lotes');
      if (response.ok) {
        const data = await response.json();
        setLotes(data);
        if (data.length > 0 && !processData.lote_id) {
          setProcessData(prev => ({ ...prev, lote_id: data[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching lotes for processes:', error);
    }
  };

  useEffect(() => {
    fetchCaficultores();
    fetchLotesOnly();
    if (tab === 'status') fetchLotes();
  }, [tab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProvChange = (e) => {
    setProvData({ ...provData, [e.target.name]: e.target.value });
  };

  const handleProcessChange = (e) => {
    setProcessData({ ...processData, [e.target.name]: e.target.value });
  };

  // Enviar Lote
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.caficultor_id) {
      setMessage({ type: 'error', text: 'Debes seleccionar un productor.' });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:4000/api/lotes', {
        withCredentials: true,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '¡Lote registrado exitosamente!' });
        setFormData({ ...formData, peso_inicial: '', altura: '' });
        setTimeout(() => setTab('status'), 1500);
      } else {
        setMessage({ type: 'error', text: 'Error al registrar el lote.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // Enviar Productor
  const handleProvSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/caficultores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provData),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: '¡Productor registrado exitosamente!' });
        setProvData({ nombre: '', finca: '', region: '' });
        fetchCaficultores();
        setTimeout(() => setTab('register'), 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al registrar productor.' });
    } finally {
      setLoading(false);
    }
  };

  // Enviar Proceso
  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!processData.lote_id) {
      setMessage({ type: 'error', text: 'Debes seleccionar un lote activo.' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/lotes/procesos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processData),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: '¡Proceso registrado exitosamente!' });
        setProcessData({ ...processData, temperatura_promedio: '', humedad_promedio: '', notas: '' });
        setTimeout(() => setTab('status'), 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al registrar proceso.' });
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = (loteId) => {
    const canvas = document.getElementById(`qr-canvas-${loteId}`);
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `QR-Lote-${loteId}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="container animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ExportCoffee</h1>
        <p style={{ color: 'var(--muted)' }}>Trazabilidad Integral del Grano</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setTab('register'); setMessage(null); }}
          className={`btn ${tab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, minWidth: '120px', border: tab !== 'register' ? '1px solid var(--border)' : 'none' }}
        >
          <Coffee size={18} style={{ marginRight: '8px' }} /> Lotes
        </button>
        <button
          onClick={() => { setTab('producers'); setMessage(null); }}
          className={`btn ${tab === 'producers' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, minWidth: '120px', border: tab !== 'producers' ? '1px solid var(--border)' : 'none' }}
        >
          <Users size={18} style={{ marginRight: '8px' }} /> Productores
        </button>
        <button
          onClick={() => { setTab('process'); setMessage(null); }}
          className={`btn ${tab === 'process' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, minWidth: '120px', border: tab !== 'process' ? '1px solid var(--border)' : 'none' }}
        >
          <Layers size={18} style={{ marginRight: '8px' }} /> Procesos
        </button>
        <button
          onClick={() => { setTab('status'); setMessage(null); }}
          className={`btn ${tab === 'status' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, minWidth: '120px', border: tab !== 'status' ? '1px solid var(--border)' : 'none' }}
        >
          Ver Todo
        </button>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
          color: message.type === 'success' ? '#28a745' : '#dc3545',
          border: `1px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`,
          fontSize: '0.9rem'
        }}>
          {message.text}
        </div>
      )}

      {tab === 'register' ? (
        <section className="premium-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Clipboard size={24} /> Nuevo Lote
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label>Seleccionar Productor</label>
              <select name="caficultor_id" value={formData.caficultor_id} onChange={handleChange} required>
                <option value="">Seleccione un productor...</option>
                {caficultores.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} - {c.finca}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Variedad de Café</label>
              <select name="variedad" value={formData.variedad} onChange={handleChange}>
                <option value="Caturra">Caturra</option>
                <option value="Geisha">Geisha</option>
                <option value="Bourbon">Bourbon</option>
                <option value="Marsellesa">Marsellesa</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Peso Inicial (kg)</label>
                <input name="peso_inicial" type="number" value={formData.peso_inicial} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Altura (msnm)</label>
                <input name="altura" type="number" value={formData.altura} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={loading}>
              {loading ? 'Procesando...' : 'Registrar Lote'}
            </button>
          </form>
        </section>
      ) : tab === 'producers' ? (
        <section className="premium-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Users size={24} /> Registrar Productor
          </h3>
          <form onSubmit={handleProvSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input name="nombre" type="text" value={provData.nombre} onChange={handleProvChange} required placeholder="Ej: Carlos Alvarado" />
            </div>
            <div className="form-group">
              <label>Nombre de la Finca</label>
              <input name="finca" type="text" value={provData.finca} onChange={handleProvChange} required placeholder="Ej: Finca El Roble" />
            </div>
            <div className="form-group">
              <label>Región</label>
              <input name="region" type="text" value={provData.region} onChange={handleProvChange} required placeholder="Ej: Tarrazú" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={loading}>
              {loading ? 'Registrando...' : 'Agregar Productor'}
            </button>
          </form>
          
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', borderRadius: '8px', color: '#ffc107', fontSize: '0.9rem' }}>
            <strong>Nota para Pasaportes:</strong> Para que la información de trazabilidad esté completa en los pasaportes digitales, a futuro se requerirá añadir las <strong>coordenadas geográficas</strong> de la finca (para Google Maps) y un registro detallado de los procesos post-cosecha asociados a cada lote.
          </div>
        </section>
      ) : tab === 'process' ? (
        <section className="premium-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Layers size={24} /> Registrar Variables de Proceso
          </h3>
          <form onSubmit={handleProcessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label>Seleccionar Lote Activo</label>
              <select name="lote_id" value={processData.lote_id} onChange={handleProcessChange} required>
                <option value="">Seleccione un lote...</option>
                {lotes.map(l => (
                  <option key={l.id} value={l.id}>Lote #{l.id.toString().padStart(3, '0')} - {l.variedad}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Tipo de Proceso</label>
                <select name="tipo" value={processData.tipo} onChange={handleProcessChange}>
                  <option value="fermentacion">Fermentación</option>
                  <option value="secado">Secado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Método / Sub-tipo</label>
                <input name="sub_tipo" type="text" value={processData.sub_tipo} onChange={handleProcessChange} placeholder="Ej: Lavado, Honey, Natural" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Temperatura Promedio (°C)</label>
                <input name="temperatura_promedio" type="number" step="0.1" value={processData.temperatura_promedio} onChange={handleProcessChange} placeholder="Ej: 24.5" />
              </div>
              <div className="form-group">
                <label>Humedad Promedio (%)</label>
                <input name="humedad_promedio" type="number" step="0.1" value={processData.humedad_promedio} onChange={handleProcessChange} placeholder="Ej: 11.2" />
              </div>
            </div>
            <div className="form-group">
              <label>Notas de Proceso</label>
              <textarea name="notas" value={processData.notas} onChange={handleProcessChange} rows="3" placeholder="Observaciones sobre el proceso..."></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={loading}>
              {loading ? 'Guardando...' : 'Registrar Datos Técnicos'}
            </button>
          </form>
        </section>
      ) : (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Lotes Activos</h3>
            <button onClick={fetchLotes} className="btn" style={{ padding: '8px', border: '1px solid var(--border)' }}>
              <RefreshCw size={18} className={loadingList ? 'animate-spin' : ''} />
            </button>
          </div>

          {loadingList ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Cargando lotes...</p>
          ) : lotes.length === 0 ? (
            <div className="premium-card" style={{ textAlign: 'center', padding: '40px' }}>
              <Coffee size={40} style={{ color: 'var(--border)', marginBottom: '10px' }} />
              <p style={{ color: 'var(--muted)' }}>No hay lotes registrados todavía.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {lotes.map((lote) => (
                <div key={lote.id} className="premium-card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ color: 'var(--accent)', textTransform: 'uppercase' }}>LOTE #{lote.id.toString().padStart(3, '0')}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Productor: {lote.caficultor_nombre} | {lote.finca}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Variedad: {lote.variedad} | {lote.altura} msnm</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '15px', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Coffee size={16} /> {lote.peso_inicial} kg
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={16} /> {new Date(lote.fecha_cosecha).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: lote.procesos_count > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                      <Layers size={16} /> {lote.procesos_count} {lote.procesos_count === 1 ? 'proceso' : 'procesos'}
                    </span>
                  </div>
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => window.location.href = `/pasaporte/${lote.id}`}
                      className="btn"
                      style={{ fontSize: '0.8rem', border: '1px solid var(--border)', flex: 1, background: 'var(--primary)', color: '#fff' }}
                    >
                      Ver Pasaporte Digital
                    </button>
                    <button
                      onClick={() => setQrLote(lote)}
                      className="btn"
                      style={{ fontSize: '0.8rem', border: '1px solid var(--border)', flex: 1, background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                    >
                      <QrCode size={16} /> QR del Lote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* QR Modal Overlay */}
      {qrLote && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="premium-card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', position: 'relative' }}>
            <button 
              onClick={() => setQrLote(null)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '20px' }}>Pasaporte Digital QR</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '15px' }}>Lote #{qrLote.id.toString().padStart(3, '0')} - {qrLote.variedad}</p>
            
            <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.8rem' }}>IP del Servidor (para el Celular)</label>
              <input 
                type="text" 
                value={serverIP} 
                onChange={(e) => setServerIP(e.target.value)} 
                placeholder="Ej: 192.168.1.15:3000"
                style={{ fontSize: '0.8rem', padding: '8px' }}
              />
              <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '5px' }}>Cambia 'localhost' por tu IP local para que el celular lo reconozca.</p>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', display: 'inline-block', marginBottom: '20px' }}>
              <QRCodeCanvas 
                id={`qr-canvas-${qrLote.id}`}
                value={`http://${serverIP}/pasaporte/${qrLote.id}`} 
                size={200}
                level={"H"}
                includeMargin={true}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => downloadQR(qrLote.id)}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <Download size={18} /> Descargar Imagen QR
              </button>
              <button 
                onClick={() => setQrLote(null)}
                className="btn"
                style={{ width: '100%', border: '1px solid var(--border)' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Summary Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
        <div className="premium-card" style={{ padding: '16px', margin: 0, textAlign: 'center' }}>
          <Coffee size={32} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Total Kilos</p>
          <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>{lotes.reduce((acc, l) => acc + parseFloat(l.peso_inicial || 0), 0)}</p>
        </div>
        <div className="premium-card" style={{ padding: '16px', margin: 0, textAlign: 'center' }}>
          <QrCode size={32} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Pasaportes</p>
          <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>{lotes.length}</p>
        </div>
      </div>
    </div>
  );
}
