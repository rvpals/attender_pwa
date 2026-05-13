import { useState, useEffect } from 'react';
import { getAllClasses, putClass, deleteClass, getAllStudents } from '../db';
import type { ClassRoom, Student } from '../types';

export default function Classes() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<ClassRoom | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setClasses(await getAllClasses());
    setStudents(await getAllStudents());
  }

  function handleAdd() {
    setEditing({ id: crypto.randomUUID(), name: '', studentIds: [] });
  }

  async function handleSave(cls: ClassRoom) {
    await putClass(cls);
    setEditing(null);
    await load();
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this class?')) {
      await deleteClass(id);
      await load();
    }
  }

  return (
    <div className="page">
      <h1>Classes</h1>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={handleAdd}>Add Class</button>
      </div>

      {editing && (
        <ClassForm cls={editing} students={students} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      <ul className="class-list">
        {classes.map(c => (
          <li key={c.id} className="class-item">
            <div>
              <strong>{c.name}</strong>
              <span className="class-count">{c.studentIds.length} students</span>
            </div>
            <div className="student-actions">
              <button className="btn-sm" onClick={() => setEditing(c)}>Edit</button>
              <button className="btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Del</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClassForm({ cls, students, onSave, onCancel }: {
  cls: ClassRoom;
  students: Student[];
  onSave: (c: ClassRoom) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(cls.name);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(cls.studentIds));

  function toggle(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(students.map(s => s.id)));
  }

  function selectNone() {
    setSelectedIds(new Set());
  }

  return (
    <div className="form-card">
      <input placeholder="Class Name" value={name} onChange={e => setName(e.target.value)} />
      <div className="roster-select">
        <div className="roster-header">
          <span>Assign Students ({selectedIds.size}/{students.length})</span>
          <button className="btn-sm" onClick={selectAll}>All</button>
          <button className="btn-sm" onClick={selectNone}>None</button>
        </div>
        <ul className="roster-list">
          {students.map(s => (
            <li key={s.id} className={`roster-item ${selectedIds.has(s.id) ? 'selected' : ''}`} onClick={() => toggle(s.id)}>
              {s.lastName}, {s.firstName} {s.nickname && `"${s.nickname}"`}
            </li>
          ))}
        </ul>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => onSave({ ...cls, name, studentIds: [...selectedIds] })}>Save</button>
        <button className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
