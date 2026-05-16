import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

async function getCollection(storeName: string): Promise<any[]> {
  const store = getStore(storeName);
  const data = await store.get('_all', { type: 'json' });
  return (data as any[]) || [];
}

async function setCollection(storeName: string, items: any[]): Promise<void> {
  const store = getStore(storeName);
  await store.setJSON('_all', items);
}

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/.netlify/functions/api', '');
  const method = req.method;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // /students
    if (path === '/students' && method === 'GET') {
      const students = await getCollection('students');
      return new Response(JSON.stringify(students), { headers });
    }

    if (path === '/students' && method === 'POST') {
      const student = await req.json();
      const students = await getCollection('students');
      const idx = students.findIndex((s: any) => s.id === student.id);
      if (idx >= 0) students[idx] = student;
      else students.push(student);
      await setCollection('students', students);
      return new Response(JSON.stringify(student), { status: 201, headers });
    }

    if (path === '/students/batch' && method === 'POST') {
      const newStudents = await req.json();
      const students = await getCollection('students');
      for (const s of newStudents) {
        const idx = students.findIndex((existing: any) => existing.id === s.id);
        if (idx >= 0) students[idx] = s;
        else students.push(s);
      }
      await setCollection('students', students);
      return new Response(JSON.stringify({ count: newStudents.length }), { status: 201, headers });
    }

    if (path.startsWith('/students/') && method === 'DELETE') {
      const id = path.split('/students/')[1];
      const students = await getCollection('students');
      await setCollection('students', students.filter((s: any) => s.id !== id));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // /classes
    if (path === '/classes' && method === 'GET') {
      const classes = await getCollection('classes');
      return new Response(JSON.stringify(classes), { headers });
    }

    if (path === '/classes' && method === 'POST') {
      const cls = await req.json();
      const classes = await getCollection('classes');
      const idx = classes.findIndex((c: any) => c.id === cls.id);
      if (idx >= 0) classes[idx] = cls;
      else classes.push(cls);
      await setCollection('classes', classes);
      return new Response(JSON.stringify(cls), { status: 201, headers });
    }

    if (path.startsWith('/classes/') && method === 'DELETE') {
      const id = path.split('/classes/')[1];
      const classes = await getCollection('classes');
      await setCollection('classes', classes.filter((c: any) => c.id !== id));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // /attendance
    if (path === '/attendance' && method === 'GET') {
      const classId = url.searchParams.get('classId');
      const date = url.searchParams.get('date');
      let records = await getCollection('attendance');
      if (classId) records = records.filter((r: any) => r.classId === classId);
      if (date) records = records.filter((r: any) => r.date === date);
      return new Response(JSON.stringify(records), { headers });
    }

    if (path === '/attendance' && method === 'POST') {
      const record = await req.json();
      const records = await getCollection('attendance');
      const idx = records.findIndex((r: any) => r.id === record.id);
      if (idx >= 0) records[idx] = record;
      else records.push(record);
      await setCollection('attendance', records);
      return new Response(JSON.stringify(record), { status: 201, headers });
    }

    if (path.startsWith('/attendance/') && method === 'DELETE') {
      const id = path.split('/attendance/')[1];
      const records = await getCollection('attendance');
      await setCollection('attendance', records.filter((r: any) => r.id !== id));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // /preferences
    if (path === '/preferences' && method === 'GET') {
      const store = getStore('preferences');
      const prefs = await store.get('app-preferences', { type: 'json' });
      if (!prefs) {
        return new Response(JSON.stringify({ id: 'app-preferences', tagline: '', theme: '' }), { headers });
      }
      return new Response(JSON.stringify(prefs), { headers });
    }

    if (path === '/preferences' && method === 'POST') {
      const store = getStore('preferences');
      const prefs = await req.json();
      prefs.id = 'app-preferences';
      await store.setJSON('app-preferences', prefs);
      return new Response(JSON.stringify(prefs), { status: 201, headers });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export const config = {
  path: '/.netlify/functions/api/*',
};
