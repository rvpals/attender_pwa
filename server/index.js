import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Database setup ---

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'attender.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL DEFAULT '',
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    nickname TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS class_students (
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    PRIMARY KEY (class_id, student_id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attendance_students (
    attendance_id TEXT NOT NULL REFERENCES attendance(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    PRIMARY KEY (attendance_id, student_id)
  );

  CREATE TABLE IF NOT EXISTS preferences (
    id TEXT PRIMARY KEY DEFAULT 'app-preferences',
    app_name TEXT NOT NULL DEFAULT '',
    tagline TEXT NOT NULL DEFAULT '',
    theme TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
  CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance(class_id, date);
`);

// --- Helpers ---

function studentRow(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    firstName: row.first_name,
    lastName: row.last_name,
    nickname: row.nickname,
    note: row.note,
  };
}

const getClassStudentIds = db.prepare(
  'SELECT student_id FROM class_students WHERE class_id = ?'
);

function classRow(row) {
  return {
    id: row.id,
    name: row.name,
    studentIds: getClassStudentIds.all(row.id).map((r) => r.student_id),
  };
}

const getAttendanceStudentIds = db.prepare(
  'SELECT student_id FROM attendance_students WHERE attendance_id = ?'
);

function attendanceRow(row) {
  return {
    id: row.id,
    classId: row.class_id,
    date: row.date,
    presentStudentIds: getAttendanceStudentIds
      .all(row.id)
      .map((r) => r.student_id),
  };
}

// --- Student routes ---

app.get('/api/students', (req, res) => {
  const rows = db.prepare('SELECT * FROM students').all();
  res.json(rows.map(studentRow));
});

app.post('/api/students', (req, res) => {
  const s = req.body;
  db.prepare(
    `INSERT OR REPLACE INTO students (id, student_id, first_name, last_name, nickname, note)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(s.id, s.studentId, s.firstName, s.lastName, s.nickname, s.note);
  res.status(201).json(s);
});

const batchUpsertStudents = db.transaction((students) => {
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO students (id, student_id, first_name, last_name, nickname, note)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  for (const s of students) {
    stmt.run(s.id, s.studentId, s.firstName, s.lastName, s.nickname, s.note);
  }
});

app.post('/api/students/batch', (req, res) => {
  const students = req.body;
  batchUpsertStudents(students);
  res.status(201).json({ count: students.length });
});

app.delete('/api/students/:id', (req, res) => {
  db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// --- Class routes ---

app.get('/api/classes', (req, res) => {
  const rows = db.prepare('SELECT * FROM classes').all();
  res.json(rows.map(classRow));
});

const upsertClass = db.transaction((cls) => {
  db.prepare('INSERT OR REPLACE INTO classes (id, name) VALUES (?, ?)').run(
    cls.id,
    cls.name
  );
  db.prepare('DELETE FROM class_students WHERE class_id = ?').run(cls.id);
  const insert = db.prepare(
    'INSERT INTO class_students (class_id, student_id) VALUES (?, ?)'
  );
  for (const sid of cls.studentIds || []) {
    insert.run(cls.id, sid);
  }
});

app.post('/api/classes', (req, res) => {
  const cls = req.body;
  upsertClass(cls);
  res.status(201).json(cls);
});

app.delete('/api/classes/:id', (req, res) => {
  db.prepare('DELETE FROM classes WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// --- Attendance routes ---

app.get('/api/attendance', (req, res) => {
  const { classId, date } = req.query;
  let sql = 'SELECT * FROM attendance WHERE 1=1';
  const params = [];
  if (classId) {
    sql += ' AND class_id = ?';
    params.push(classId);
  }
  if (date) {
    sql += ' AND date = ?';
    params.push(date);
  }
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(attendanceRow));
});

const upsertAttendance = db.transaction((record) => {
  db.prepare(
    'INSERT OR REPLACE INTO attendance (id, class_id, date) VALUES (?, ?, ?)'
  ).run(record.id, record.classId, record.date);
  db.prepare('DELETE FROM attendance_students WHERE attendance_id = ?').run(
    record.id
  );
  const insert = db.prepare(
    'INSERT INTO attendance_students (attendance_id, student_id) VALUES (?, ?)'
  );
  for (const sid of record.presentStudentIds || []) {
    insert.run(record.id, sid);
  }
});

app.post('/api/attendance', (req, res) => {
  const record = req.body;
  upsertAttendance(record);
  res.status(201).json(record);
});

app.delete('/api/attendance/:id', (req, res) => {
  db.prepare('DELETE FROM attendance WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// --- Preferences routes ---

app.get('/api/preferences', (req, res) => {
  const row = db.prepare("SELECT * FROM preferences WHERE id = 'app-preferences'").get();
  if (!row) {
    res.json({ id: 'app-preferences', appName: '', tagline: '', theme: '' });
    return;
  }
  res.json({
    id: row.id,
    appName: row.app_name,
    tagline: row.tagline,
    theme: row.theme,
  });
});

app.post('/api/preferences', (req, res) => {
  const prefs = req.body;
  prefs.id = 'app-preferences';
  db.prepare(
    `INSERT OR REPLACE INTO preferences (id, app_name, tagline, theme)
     VALUES (?, ?, ?, ?)`
  ).run(prefs.id, prefs.appName, prefs.tagline, prefs.theme);
  res.status(201).json(prefs);
});

// --- Production: serve built frontend ---

const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
