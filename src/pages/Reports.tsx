import { useState, useEffect, useMemo } from 'react';
import { getAllClasses, getAllAttendance, getAllStudents } from '../db';
import type { ClassRoom, Student, AttendanceRecord } from '../types';

export default function Reports() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    Promise.all([getAllClasses(), getAllStudents(), getAllAttendance()])
      .then(([cls, stu, att]) => {
        setClasses(cls);
        setStudents(stu);
        att.sort((a, b) => a.date.localeCompare(b.date));
        setAllRecords(att);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let recs = allRecords;
    if (selectedClassId) recs = recs.filter(r => r.classId === selectedClassId);
    if (dateFrom) recs = recs.filter(r => r.date >= dateFrom);
    if (dateTo) recs = recs.filter(r => r.date <= dateTo);
    return recs;
  }, [allRecords, selectedClassId, dateFrom, dateTo]);

  const classesInView = useMemo(() => {
    if (selectedClassId) return classes.filter(c => c.id === selectedClassId);
    const ids = new Set(filtered.map(r => r.classId));
    return classes.filter(c => ids.has(c.id));
  }, [classes, filtered, selectedClassId]);

  function getStudent(id: string) {
    return students.find(s => s.id === id);
  }

  function getAttendanceRate(studentId: string, recs: AttendanceRecord[]): string {
    if (recs.length === 0) return 'N/A';
    const present = recs.filter(r => r.presentStudentIds.includes(studentId)).length;
    return `${Math.round((present / recs.length) * 100)}%`;
  }

  function exportCSV() {
    const lines: string[][] = [];
    for (const cls of classesInView) {
      const classRecords = filtered.filter(r => r.classId === cls.id);
      if (classRecords.length === 0) continue;
      const header = ['Class', 'Student ID', 'Last Name', 'First Name', ...classRecords.map(r => r.date), 'Rate'];
      lines.push(header);
      for (const sid of cls.studentIds) {
        const s = getStudent(sid);
        if (!s) continue;
        const attendance = classRecords.map(r => r.presentStudentIds.includes(sid) ? 'P' : 'A');
        lines.push([cls.name, s.studentId, s.lastName, s.firstName, ...attendance, getAttendanceRate(sid, classRecords)]);
      }
    }
    if (lines.length === 0) return;
    const csv = lines.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1>Reports</h1>

      <div className="form-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Class</label>
          <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(selectedClassId || dateFrom || dateTo) && (
            <button className="btn" onClick={() => { setSelectedClassId(''); setDateFrom(''); setDateTo(''); }}>Clear</button>
          )}
          {filtered.length > 0 && (
            <button className="btn btn-primary" onClick={exportCSV}>Export CSV</button>
          )}
        </div>
      </div>

      {classesInView.length === 0 && (
        <p className="empty-state">No attendance records found.</p>
      )}

      {classesInView.map(cls => {
        const classRecords = filtered.filter(r => r.classId === cls.id);
        if (classRecords.length === 0) return null;
        return (
          <div key={cls.id} style={{ marginTop: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{cls.name}</h3>
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    {classRecords.map(r => (
                      <th key={r.id}>{r.date.slice(5)}</th>
                    ))}
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {cls.studentIds.map(sid => {
                    const s = getStudent(sid);
                    if (!s) return null;
                    return (
                      <tr key={sid}>
                        <td className="student-cell">{s.lastName}, {s.firstName}</td>
                        {classRecords.map(r => (
                          <td key={r.id} className={r.presentStudentIds.includes(sid) ? 'cell-present' : 'cell-absent'}>
                            {r.presentStudentIds.includes(sid) ? 'P' : 'A'}
                          </td>
                        ))}
                        <td className="rate-cell">{getAttendanceRate(sid, classRecords)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
