import { saveToken } from './auth.js';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const payload = { username: form.get('username'), password: form.get('password') };
  const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (data.token) {
    saveToken(data.token);
    location.href = '/admin/dashboard.html';
  } else {
    document.getElementById('status').textContent = data.error || 'تعذر الدخول';
  }
});
