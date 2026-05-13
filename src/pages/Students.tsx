import { useState, useEffect, useRef } from 'react';
import { getAllStudents, putStudent, putStudents, deleteStudent } from '../db';
import type { Student } from '../types';
import Papa from 'papaparse';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Student | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setStudents(await getAllStudents());
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
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
        if (fileRef.current) fileRef.current.value = '';
      },
    });
  }

  async function handleSave(student: Student) {
    await putStudent(student);
    setEditing(null);
    await load();
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this student?')) {
      await deleteStudent(id);
      await load();
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
        <label className="btn">
          Import CSV
          <input type="file" accept=".csv" hidden ref={fileRef} onChange={handleImport} />
        </label>
      </div>

      {editing && (
        <StudentForm student={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

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
