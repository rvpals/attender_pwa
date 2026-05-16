import type { Student, ClassRoom, AttendanceRecord, Preferences } from '../types';

const API_BASE = '/.netlify/functions/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Students
export async function getAllStudents(): Promise<Student[]> {
  return request('/students');
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const students = await getAllStudents();
  return students.find(s => s.id === id);
}

export async function putStudent(student: Student): Promise<void> {
  await request('/students', { method: 'POST', body: JSON.stringify(student) });
}

export async function putStudents(students: Student[]): Promise<void> {
  await request('/students/batch', { method: 'POST', body: JSON.stringify(students) });
}

export async function deleteStudent(id: string): Promise<void> {
  await request(`/students/${id}`, { method: 'DELETE' });
}

// Classes
export async function getAllClasses(): Promise<ClassRoom[]> {
  return request('/classes');
}

export async function getClass(id: string): Promise<ClassRoom | undefined> {
  const classes = await getAllClasses();
  return classes.find(c => c.id === id);
}

export async function putClass(cls: ClassRoom): Promise<void> {
  await request('/classes', { method: 'POST', body: JSON.stringify(cls) });
}

export async function deleteClass(id: string): Promise<void> {
  await request(`/classes/${id}`, { method: 'DELETE' });
}

// Attendance
export async function getAttendanceForClassDate(classId: string, date: string): Promise<AttendanceRecord | undefined> {
  const records: AttendanceRecord[] = await request(`/attendance?classId=${classId}&date=${date}`);
  return records[0];
}

export async function getAllAttendanceForClass(classId: string): Promise<AttendanceRecord[]> {
  return request(`/attendance?classId=${classId}`);
}

export async function putAttendance(record: AttendanceRecord): Promise<void> {
  await request('/attendance', { method: 'POST', body: JSON.stringify(record) });
}

export async function deleteAttendance(id: string): Promise<void> {
  await request(`/attendance/${id}`, { method: 'DELETE' });
}

// Preferences
export async function getPreferences(): Promise<Preferences> {
  return request('/preferences');
}

export async function putPreferences(prefs: Preferences): Promise<void> {
  await request('/preferences', { method: 'POST', body: JSON.stringify(prefs) });
}
