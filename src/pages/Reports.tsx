import { useState, useEffect } from 'react';
import { getAllClasses, getAllAttendanceForClass, getAllStudents } from '../db';
import type { ClassRoom, Student, AttendanceRecord } from '../types';

export default function Reports() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classStudentIds, setClassStudentIds] = useState<string[]>([]);

  useEffect(() => {
    getAllClasses().then(setClasses);
    getAllStudents().then(setStudents);
  }, []);

  useEffect(() => {
    if (selectedClassId) loadReport();
  }, [selectedClassId]);

  async function loadReport() {
    const cls = classes.find(c => c.id === selectedClassId);
    if (!cls) return;
    setClassStudentIds(cls.studentIds);
    const recs = await getAllAttendanceForClass(selectedClassId);
    recs.sort((a, b) => a.date.localeCompare(b.date));
    setRecords(recs);
  }

  function getStudent(id: string) {
    return students.find(s => s.id === id);
  }

  function getAttendanceRate(studentId: string): string {
    if (records.length === 0) return 'N/A';
    const present = records.filter(r => r.presentStudentIds.includes(studentId)).length;
    return `${Math.round((present / records.length) * 100)}%`;
  }

  function exportCSV() {
    const header = ['Student ID', 'Last Name', 'First Name', ...records.map(r => r.date), 'Attendance Rate'];
    const rows = classStudentIds.map(sid => {
      const s = getStudent(sid);
      if (!s) return [];
      const attendance = records.map(r => r.presentStudentIds.includes(sid) ? 'P' : 'A');
      return [s.studentId, s.lastName, s.firstName, ...attendance, getAttendanceRate(sid)];
    });

    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedClassId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <h1>Reports</h1>

      <div className="attendance-controls">
        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
          <option value="">Select a class...</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {records.length > 0 && (
          <button className="btn" onClick={exportCSV}>Export CSV</button>
        )}
      </div>

      {records.length > 0 && (
        <div className="report-table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Student</th>
                {records.map(r => (
                  <th key={r.id}>{r.date.slice(5)}</th>
                ))}
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {classStudentIds.map(sid => {
                const s = getStudent(sid);
                if (!s) return null;
                return (
                  <tr key={sid}>
                    <td className="student-cell">{s.lastName}, {s.firstName}</td>
                    {records.map(r => (
                      <td key={r.id} className={r.presentStudentIds.includes(sid) ? 'cell-present' : 'cell-absent'}>
                        {r.presentStudentIds.includes(sid) ? 'P' : 'A'}
                      </td>
                    ))}
                    <td className="rate-cell">{getAttendanceRate(sid)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        )}

      {selectedClassId && records.length === 0 && (
        <p className="empty-state">No attendance records yet for this class.</p>
      )}
    </div>
  );
}
