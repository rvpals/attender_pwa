import { useState, useEffect } from 'react';
import { getPreferences, putPreferences } from '../db';

const THEMES = [
  { id: 'ocean-blue', name: 'Ocean Blue', color: '#2563eb' },
  { id: 'emerald-green', name: 'Emerald Green', color: '#059669' },
  { id: 'sunset-orange', name: 'Sunset Orange', color: '#ea580c' },
  { id: 'royal-purple', name: 'Royal Purple', color: '#7c3aed' },
  { id: 'rose-pink', name: 'Rose Pink', color: '#e11d48' },
];

export default function Preferences() {
  const [tagline, setTagline] = useState('');
  const [theme, setTheme] = useState('ocean-blue');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreferences().then(prefs => {
      setTagline(prefs.tagline);
      if (prefs.theme) setTheme(prefs.theme);
      setLoading(false);
    });
  }, []);

  function handleThemeChange(themeId: string) {
    setTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  }

  async function handleSave() {
    await putPreferences({ id: 'app-preferences', tagline, theme });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1>Preferences</h1>
      <div className="form-card">
        <label htmlFor="tagline" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
          Application Tag Line
        </label>
        <input
          id="tagline"
          type="text"
          placeholder="A simple way to take attendance."
          value={tagline}
          onChange={e => setTagline(e.target.value)}
        />
      </div>

      <div className="form-card">
        <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>Themes</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          {THEMES.map(t => (
            <label
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                border: theme === t.id ? `2px solid ${t.color}` : '2px solid var(--border)',
                cursor: 'pointer',
                background: theme === t.id ? 'var(--primary-bg)' : 'transparent',
              }}
            >
              <input
                type="radio"
                name="theme"
                value={t.id}
                checked={theme === t.id}
                onChange={() => handleThemeChange(t.id)}
                style={{ display: 'none' }}
              />
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: t.color,
                flexShrink: 0,
              }} />
              <span style={{ fontWeight: 500 }}>{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-save" onClick={handleSave}>
        Save
      </button>
      {saved && <p style={{ color: 'var(--success)', fontWeight: 500, textAlign: 'center', marginTop: '0.75rem' }}>Preferences saved!</p>}
    </div>
  );
}
