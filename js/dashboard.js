import { getToken, isLoggedIn, logout } from './auth.js';

if (!isLoggedIn()) location.href = '/admin/login.html';

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  logout();
  location.href = '/admin/login.html';
});

document.getElementById('settingsForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  document.getElementById('status').textContent = data.message || data.error;
});

document.getElementById('questionsForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const quiz_date = fd.get('quiz_date');
  const questions = [];
  for (let i = 1; i <= 4; i += 1) {
    const question_text = fd.get(`q${i}_text`);
    if (!question_text) continue;
    questions.push({
      question_order: i,
      question_text,
      option_a: fd.get(`q${i}_a`),
      option_b: fd.get(`q${i}_b`),
      option_c: fd.get(`q${i}_c`),
      option_d: fd.get(`q${i}_d`),
      correct_opt: fd.get(`q${i}_correct`)
    });
  }
  const res = await fetch('/api/question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ quiz_date, questions })
  });
  const data = await res.json();
  document.getElementById('status').textContent = data.message || data.error;
});
