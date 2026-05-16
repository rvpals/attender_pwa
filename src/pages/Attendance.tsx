import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClasses, getClass, getAttendanceForClassDate, putAttendance, getAllStudents } from '../db';
import type { ClassRoom, Student, AttendanceRecord } from '../types';
import { useViewMode } from '../hooks/useViewMode';
import ViewToggle from '../components/ViewToggle';

export default function Attendance() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState<Student[]>([]);
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [savedMessage, setSavedMessage] = useState('');
  const navigate = useNavigate();
  const [viewMode, toggleView] = useViewMode('attendance-view');

  useEffect(() => {
    getAllClasses().then(setClasses);
  }, []);

  useEffect(() => {
    if (selectedClassId && date) loadRoster();
  }, [selectedClassId, date]);

  async function loadRoster() {
    const cls = await getClass(selectedClassId);
    if (!cls) return;
    const allStudents = await getAllStudents();
    const classStudents = allStudents.filter(s => cls.studentIds.includes(s.id));
    classStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
    setRoster(classStudents);

    const existing = await getAttendanceForClassDate(selectedClassId, date);
    setPresentIds(new Set(existing?.presentStudentIds || []));
    setSavedMessage('');
  }

  function toggleStudent(id: string) {
    setPresentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSavedMessage('');
  }

  async function handleSave() {
    const existing = await getAttendanceForClassDate(selectedClassId, date);
    const record: AttendanceRecord = {
      id: existing?.id || crypto.randomUUID(),
      classId: selectedClassId,
      date,
      presentStudentIds: [...presentIds],
    };
    await putAttendance(record);
    const className = classes.find(c => c.id === selectedClassId)?.name || '';
    setSavedMessage(`${className} for ${date} attendance is saved.`);
    setTimeout(() => navigate('/'), 2000);
  }

  function markAllPresent() {
    setPresentIds(new Set(roster.map(s => s.id)));
    setSavedMessage('');
  }

  function markAllAbsent() {
    setPresentIds(new Set());
    setSavedMessage('');
  }

  return (
    <div className="page">
      <h1>Take Attendance</h1>

      <div className="attendance-controls">
        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
          <option value="">Select a class...</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      {roster.length > 0 && (
        <>
          <div className="attendance-summary">
            <span>{presentIds.size}/{roster.length} present</span>
            <button className="btn-sm" onClick={markAllPresent}>All Present</button>
            <button className="btn-sm" onClick={markAllAbsent}>All Absent</button>
            <ViewToggle mode={viewMode} onToggle={toggleView} />
          </div>

          {viewMode === 'list' ? (
            <ul className="attendance-list">
              {roster.map(s => (
                <li
                  key={s.id}
                  className={`attendance-item ${presentIds.has(s.id) ? 'present' : 'absent'}`}
                  onClick={() => toggleStudent(s.id)}
                >
                  <span className="attendance-name">
                    {s.lastName}, {s.firstName}
                    {s.nickname && <span className="nickname"> "{s.nickname}"</span>}
                  </span>
                  <span className="attendance-status">
                    {presentIds.has(s.id) ? '✓' : '✗'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card-grid card-grid-attendance">
              {roster.map(s => (
                <div
                  key={s.id}
                  className={`item-card item-card-attendance ${presentIds.has(s.id) ? 'present' : 'absent'}`}
                  onClick={() => toggleStudent(s.id)}
                >
                  <div className={`item-card-avatar ${presentIds.has(s.id) ? 'item-card-avatar-present' : 'item-card-avatar-absent'}`}>
                    {presentIds.has(s.id) ? '✓' : '✗'}
                  </div>
                  <div className="item-card-body">
                    <div className="item-card-title">{s.firstName} {s.lastName}</div>
                    {s.nickname && <div className="item-card-subtitle">"{s.nickname}"</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary btn-save" onClick={handleSave} disabled={!!savedMessage}>
            {savedMessage ? 'Saved ✓' : 'Save Attendance'}
          </button>
          {savedMessage && <p style={{ color: 'var(--success)', fontWeight: 600, textAlign: 'center', marginTop: '0.75rem' }}>{savedMessage}</p>}
        </>
      )}
    </div>
  );
}
