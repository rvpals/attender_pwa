export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  nickname: string;
  note: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  studentIds: string[];
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string; // ISO date string YYYY-MM-DD
  presentStudentIds: string[];
}

export interface Preferences {
  id: string;
  appName: string;
  tagline: string;
  theme: string;
}
