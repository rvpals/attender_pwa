export default function About() {
  return (
    <div className="page">
      <h1>About This Application</h1>
      <div className="form-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ting Sun's Attender</p>
        <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Version 1.4.0</p>
        <p style={{ color: 'var(--text-muted)' }}>Copyright &copy; 2026 rvpals@gmail.com</p>
      </div>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Change Log</h3>
      <div className="form-card" style={{ padding: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600 }}>v1.4.0</p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>Added About the App page with version info and changelog</li>
            <li>Attendance save now shows confirmation message and returns to home</li>
            <li>Fixed list refresh issue after adding/deleting students and classes</li>
          </ul>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600 }}>v1.3.0</p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>Renamed app to Ting Sun's Attender</li>
            <li>Added Preferences page with customizable tagline</li>
          </ul>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600 }}>v1.2.0</p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>Redesigned home page with clipboard logo and improved UI</li>
          </ul>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600 }}>v1.1.0</p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>Switched storage from IndexedDB to Netlify Blobs (server-side persistence)</li>
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>v1.0.0</p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <li>Initial release: PWA attendance tracker</li>
            <li>Student roster management with CSV import</li>
            <li>Class creation and student assignment</li>
            <li>Tap-to-mark attendance</li>
            <li>Reports with CSV export</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
