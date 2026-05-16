import { useState, useEffect } from 'react';
import { getPreferences, putPreferences } from '../db';

export default function Preferences() {
  const [tagline, setTagline] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreferences().then(prefs => {
      setTagline(prefs.tagline);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    await putPreferences({ id: 'app-preferences', tagline });
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
        <button className="btn btn-primary btn-save" onClick={handleSave}>
          Save
        </button>
        {saved && <p style={{ color: 'var(--success)', fontWeight: 500, textAlign: 'center' }}>Preferences saved!</p>}
      </div>
    </div>
  );
}
