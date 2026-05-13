import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

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
      const store = getStore('students');
      const { blobs } = await store.list();
      const students = await Promise.all(
        blobs.map(b => store.get(b.key, { type: 'json' }))
      );
      return new Response(JSON.stringify(students), { headers });
    }

    if (path === '/students' && method === 'POST') {
      const store = getStore('students');
      const student = await req.json();
      await store.setJSON(student.id, student);
      return new Response(JSON.stringify(student), { status: 201, headers });
    }

    if (path === '/students/batch' && method === 'POST') {
      const store = getStore('students');
      const students = await req.json();
      await Promise.all(students.map((s: any) => store.setJSON(s.id, s)));
      return new Response(JSON.stringify({ count: students.length }), { status: 201, headers });
    }

    if (path.startsWith('/students/') && method === 'DELETE') {
      const store = getStore('students');
      const id = path.split('/students/')[1];
      await store.delete(id);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // /classes
    if (path === '/classes' && method === 'GET') {
      const store = getStore('classes');
      const { blobs } = await store.list();
      const classes = await Promise.all(
        blobs.map(b => store.get(b.key, { type: 'json' }))
      );
      return new Response(JSON.stringify(classes), { headers });
    }

    if (path === '/classes' && method === 'POST') {
      const store = getStore('classes');
      const cls = await req.json();
      await store.setJSON(cls.id, cls);
      return new Response(JSON.stringify(cls), { status: 201, headers });
    }

    if (path.startsWith('/classes/') && method === 'DELETE') {
      const store = getStore('classes');
      const id = path.split('/classes/')[1];
      await store.delete(id);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // /attendance
    if (path === '/attendance' && method === 'GET') {
      const classId = url.searchParams.get('classId');
      const date = url.searchParams.get('date');
      const store = getStore('attendance');
      const { blobs } = await store.list();
      const all = await Promise.all(
        blobs.map(b => store.get(b.key, { type: 'json' }))
      );
      let filtered = all.filter(Boolean);
      if (classId) filtered = filtered.filter((r: any) => r.classId === classId);
      if (date) filtered = filtered.filter((r: any) => r.date === date);
      return new Response(JSON.stringify(filtered), { headers });
    }

    if (path === '/attendance' && method === 'POST') {
      const store = getStore('attendance');
      const record = await req.json();
      await store.setJSON(record.id, record);
      return new Response(JSON.stringify(record), { status: 201, headers });
    }

    if (path.startsWith('/attendance/') && method === 'DELETE') {
      const store = getStore('attendance');
      const id = path.split('/attendance/')[1];
      await store.delete(id);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export const config = {
  path: '/.netlify/functions/api/*',
};
