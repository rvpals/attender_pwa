import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPreferences } from '../db';

export default function Home() {
  const [tagline, setTagline] = useState('A simple way to take attendance.');

  useEffect(() => {
    getPreferences().then(prefs => {
      if (prefs.tagline) setTagline(prefs.tagline);
    });
  }, []);

  return (
    <div className="page home-page">
      <div className="hero">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bg-grad" x1="0" y1="0" x2="80" y2="80">
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="clip-grad" x1="24" y1="16" x2="56" y2="68">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#e0e7ff" />
                </linearGradient>
              </defs>
              <rect width="80" height="80" rx="20" fill="url(#bg-grad)" />
              <rect x="22" y="14" width="36" height="48" rx="4" fill="url(#clip-grad)" />
              <rect x="30" y="10" width="20" height="10" rx="5" fill="#4f46e5" />
              <circle cx="32" cy="34" r="3" fill="#4f46e5" />
              <rect x="39" y="32" width="14" height="4" rx="2" fill="#c7d2fe" />
              <circle cx="32" cy="46" r="3" fill="#4f46e5" />
              <rect x="39" y="44" width="14" height="4" rx="2" fill="#c7d2fe" />
              <path d="M29.5 33.5l2 2 4.5-4.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M29.5 45.5l2 2 4.5-4.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="logo-title">Ting Sun's Attender</h1>
          <p className="logo-subtitle">{tagline}</p>
        </div>
      </div>

      <nav className="home-nav">
        <Link to="/attendance" className="nav-card nav-card-primary">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </span>
          <span className="nav-card-label">Take Attendance</span>
        </Link>
        <Link to="/classes" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
          </span>
          <span className="nav-card-label">Manage Classes</span>
        </Link>
        <Link to="/students" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </span>
          <span className="nav-card-label">Manage Students</span>
        </Link>
        <Link to="/reports" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10" />
              <path d="M12 20V4" />
              <path d="M6 20v-6" />
            </svg>
          </span>
          <span className="nav-card-label">Reports</span>
        </Link>
        <Link to="/preferences" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </span>
          <span className="nav-card-label">Preferences</span>
        </Link>
      </nav>
    </div>
  );
}
