import { useState, useEffect } from 'react';
import { getAllClasses, putClass, deleteClass, getAllStudents } from '../db';
import type { ClassRoom, Student } from '../types';
import { useViewMode } from '../hooks/useViewMode';
import ViewToggle from '../components/ViewToggle';

export default function Classes() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<ClassRoom | null>(null);
  const [viewMode, toggleView] = useViewMode('classes-view');

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
    setClasses(prev => {
      const idx = prev.findIndex(c => c.id === cls.id);
      if (idx >= 0) return prev.map(c => c.id === cls.id ? cls : c);
      return [...prev, cls];
    });
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this class?')) {
      await deleteClass(id);
      setClasses(prev => prev.filter(c => c.id !== id));
    }
  }

  return (
    <div className="page">
      <h1>Classes</h1>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={handleAdd}>Add Class</button>
        <ViewToggle mode={viewMode} onToggle={toggleView} />
      </div>

      {editing && (
        <ClassForm cls={editing} students={students} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      {viewMode === 'list' ? (
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
      ) : (
        <div className="card-grid">
          {classes.map(c => (
            <div key={c.id} className="item-card">
              <div className="item-card-avatar item-card-avatar-class">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" opacity="0.4" />
                  <path d="M2 12l10 5 10-5" opacity="0.7" />
                </svg>
              </div>
              <div className="item-card-body">
                <div className="item-card-title">{c.name}</div>
                <div className="item-card-meta">{c.studentIds.length} students</div>
              </div>
              <div className="item-card-actions">
                <button className="btn-sm" onClick={() => setEditing(c)}>Edit</button>
                <button className="btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
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
