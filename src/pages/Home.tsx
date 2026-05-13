import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <h1>Attender</h1>
      <nav className="home-nav">
        <Link to="/attendance" className="btn btn-primary">Take Attendance</Link>
        <Link to="/classes" className="btn">Manage Classes</Link>
        <Link to="/students" className="btn">Manage Students</Link>
        <Link to="/reports" className="btn">Reports</Link>
      </nav>
    </div>
  );
}
