import './globals.css';

export const metadata = {
  title: 'ExportCoffee - Traceability',
  description: 'De la finca a la taza: Trazabilidad real de café de altura.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: 0 }}>EXPORTCOFFEE</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="btn btn-secondary" style={{ padding: '8px 16px' }}>Dashboard</button>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="container" style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid var(--border)', marginTop: '40px', color: 'var(--muted)' }}>
          <p>© 2026 ExportCoffee - De la Finca a la Taza</p>
        </footer>
      </body>
    </html>
  )
}
