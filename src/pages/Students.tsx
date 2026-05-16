import { useState, useEffect, useRef } from 'react';
import { getAllStudents, putStudent, putStudents, deleteStudent } from '../db';
import type { Student } from '../types';
import Papa from 'papaparse';
import { useViewMode } from '../hooks/useViewMode';
import ViewToggle from '../components/ViewToggle';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Student | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewMode, toggleView] = useViewMode('students-view');

  useEffect(() => { load(); }, []);

  async function load() {
    setStudents(await getAllStudents());
  }

  function handleImportClick() {
    setShowImportDialog(true);
  }

  function handleBrowseFile() {
    fileRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const imported: Student[] = results.data.map((row: any) => ({
          id: crypto.randomUUID(),
          studentId: row.student_id || row.studentId || row.id || '',
          firstName: row.first_name || row.firstName || row.First || '',
          lastName: row.last_name || row.lastName || row.Last || '',
          nickname: row.nickname || row.Nickname || '',
          note: row.note || row.Note || '',
        }));
        await putStudents(imported);
        await load();
        setShowImportDialog(false);
        if (fileRef.current) fileRef.current.value = '';
      },
    });
  }

  async function handleSave(student: Student) {
    await putStudent(student);
    setEditing(null);
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === student.id);
      if (idx >= 0) return prev.map(s => s.id === student.id ? student : s);
      return [...prev, student];
    });
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this student?')) {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  }

  function handleAdd() {
    setEditing({
      id: crypto.randomUUID(),
      studentId: '',
      firstName: '',
      lastName: '',
      nickname: '',
      note: '',
    });
  }

  return (
    <div className="page">
      <h1>Students</h1>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={handleAdd}>Add Student</button>
        <button className="btn" onClick={handleImportClick}>Import CSV</button>
        <ViewToggle mode={viewMode} onToggle={toggleView} />
        <input type="file" accept=".csv" hidden ref={fileRef} onChange={handleFileChange} />
      </div>

      {showImportDialog && (
        <div className="form-card">
          <h3>CSV Import Format</h3>
          <p className="import-desc">Your CSV file should have a header row with these columns:</p>
          <pre className="csv-example">student_id,first_name,last_name,nickname,note{'\n'}001,John,Smith,Johnny,Transfer student{'\n'}002,Jane,Doe,,{'\n'}003,Bob,Wilson,Bobby,Needs front seat</pre>
          <p className="import-desc">Columns <strong>nickname</strong> and <strong>note</strong> are optional.</p>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleBrowseFile}>Browse File...</button>
            <button className="btn" onClick={() => setShowImportDialog(false)}>Cancel</button>
          </div>
        </div>
      )}

      {editing && (
        <StudentForm student={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      {viewMode === 'list' ? (
        <ul className="student-list">
          {students.map(s => (
            <li key={s.id} className="student-item">
              <div className="student-info">
                <strong>{s.lastName}, {s.firstName}</strong>
                {s.nickname && <span className="nickname">"{s.nickname}"</span>}
                <span className="student-id">ID: {s.studentId}</span>
                {s.note && <span className="note">{s.note}</span>}
              </div>
              <div className="student-actions">
                <button className="btn-sm" onClick={() => setEditing(s)}>Edit</button>
                <button className="btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Del</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card-grid">
          {students.map(s => (
            <div key={s.id} className="item-card">
              <div className="item-card-avatar">
                {s.firstName[0]}{s.lastName[0]}
              </div>
              <div className="item-card-body">
                <div className="item-card-title">{s.firstName} {s.lastName}</div>
                {s.nickname && <div className="item-card-subtitle">"{s.nickname}"</div>}
                <div className="item-card-meta">ID: {s.studentId}</div>
                {s.note && <div className="item-card-meta">{s.note}</div>}
              </div>
              <div className="item-card-actions">
                <button className="btn-sm" onClick={() => setEditing(s)}>Edit</button>
                <button className="btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentForm({ student, onSave, onCancel }: {
  student: Student;
  onSave: (s: Student) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(student);

  function update(field: keyof Student, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  return (
    <div className="form-card">
      <input placeholder="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} />
      <input placeholder="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} />
      <input placeholder="Student ID" value={form.studentId} onChange={e => update('studentId', e.target.value)} />
      <input placeholder="Nickname" value={form.nickname} onChange={e => update('nickname', e.target.value)} />
      <input placeholder="Note" value={form.note} onChange={e => update('note', e.target.value)} />
      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => onSave(form)}>Save</button>
        <button className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
