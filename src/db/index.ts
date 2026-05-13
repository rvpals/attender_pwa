import { openDB, type IDBPDatabase } from 'idb';
import type { Student, ClassRoom, AttendanceRecord } from '../types';

const DB_NAME = 'attender';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase>;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('students', { keyPath: 'id' });
        db.createObjectStore('classes', { keyPath: 'id' });
        const attendanceStore = db.createObjectStore('attendance', { keyPath: 'id' });
        attendanceStore.createIndex('classDate', ['classId', 'date']);
      },
    });
  }
  return dbPromise;
}

// Students
export async function getAllStudents(): Promise<Student[]> {
  const db = await getDB();
  return db.getAll('students');
}

export async function getStudent(id: string): Promise<Student | undefined> {
  const db = await getDB();
  return db.get('students', id);
}

export async function putStudent(student: Student): Promise<void> {
  const db = await getDB();
  await db.put('students', student);
}

export async function putStudents(students: Student[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('students', 'readwrite');
  for (const s of students) {
    tx.store.put(s);
  }
  await tx.done;
}

export async function deleteStudent(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('students', id);
}

// Classes
export async function getAllClasses(): Promise<ClassRoom[]> {
  const db = await getDB();
  return db.getAll('classes');
}

export async function getClass(id: string): Promise<ClassRoom | undefined> {
  const db = await getDB();
  return db.get('classes', id);
}

export async function putClass(cls: ClassRoom): Promise<void> {
  const db = await getDB();
  await db.put('classes', cls);
}

export async function deleteClass(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('classes', id);
}

// Attendance
export async function getAttendanceForClassDate(classId: string, date: string): Promise<AttendanceRecord | undefined> {
  const db = await getDB();
  const records = await db.getAllFromIndex('attendance', 'classDate', [classId, date]);
  return records[0];
}

export async function getAllAttendanceForClass(classId: string): Promise<AttendanceRecord[]> {
  const db = await getDB();
  const all = await db.getAll('attendance');
  return all.filter(r => r.classId === classId);
}

export async function putAttendance(record: AttendanceRecord): Promise<void> {
  const db = await getDB();
  await db.put('attendance', record);
}

export async function deleteAttendance(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('attendance', id);
}
