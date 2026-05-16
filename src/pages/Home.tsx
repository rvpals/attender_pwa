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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2zm2 4v2h2V7H6zm4 0v2h8V7h-8zM6 11v2h2v-2H6zm4 0v2h8v-2h-8zM6 15v2h2v-2H6zm4 0v2h8v-2h-8z" />
              <path d="M17 8l-5 5-2-2-1.5 1.5L11.5 15.5 18.5 8.5z" opacity="0.6" />
            </svg>
          </span>
          <span className="nav-card-label">Take Attendance</span>
        </Link>
        <Link to="/classes" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" opacity="0.4" />
              <path d="M2 12l10 5 10-5" opacity="0.7" />
            </svg>
          </span>
          <span className="nav-card-label">Manage Classes</span>
        </Link>
        <Link to="/students" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2H3z" />
              <circle cx="17" cy="7" r="3" opacity="0.6" />
              <path d="M17 14h2a3 3 0 013 3v2h-5" opacity="0.6" />
            </svg>
          </span>
          <span className="nav-card-label">Manage Students</span>
        </Link>
        <Link to="/reports" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="12" width="4" height="9" rx="1" opacity="0.5" />
              <rect x="10" y="6" width="4" height="15" rx="1" />
              <rect x="16" y="9" width="4" height="12" rx="1" opacity="0.7" />
              <circle cx="6" cy="10" r="1.5" />
              <circle cx="12" cy="4" r="1.5" />
              <circle cx="18" cy="7" r="1.5" />
              <path d="M6 10l6-6 6 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="nav-card-label">Reports</span>
        </Link>
        <Link to="/preferences" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 7h3v2H4V7zm6 0h10v2H10V7zM4 15h3v2H4v-2zm6 0h10v2H10v-2zM14 11h3v2h-3v-2zm-10 0h8v2H4v-2z" opacity="0.4" />
              <circle cx="8" cy="8" r="3" />
              <circle cx="16" cy="16" r="3" />
              <circle cx="14" cy="12" r="2.5" opacity="0.7" />
            </svg>
          </span>
          <span className="nav-card-label">Preferences</span>
        </Link>
        <Link to="/about" className="nav-card">
          <span className="nav-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="8" r="1.5" fill="white" />
              <rect x="11" y="11" width="2" height="6" rx="1" fill="white" />
            </svg>
          </span>
          <span className="nav-card-label">About the App</span>
        </Link>
      </nav>
    </div>
  );
}
