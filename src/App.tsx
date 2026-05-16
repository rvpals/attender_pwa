import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Students from './pages/Students';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Preferences from './pages/Preferences';
import About from './pages/About';
import { getPreferences } from './db';

function NavBar() {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <header className="navbar">
      <Link to="/" className="nav-back">← Home</Link>
    </header>
  );
}

export default function App() {
  useEffect(() => {
    getPreferences().then(prefs => {
      if (prefs.theme) document.documentElement.setAttribute('data-theme', prefs.theme);
      document.title = prefs.appName || "Ting Sun's Attender";
    });
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
