import { getToken, isLoggedIn } from './auth.js';

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas?.getContext('2d');
if (canvas) {
  canvas.width = 520;
  canvas.height = 520;
  ctx.fillStyle = '#2A3F46';
  ctx.beginPath();
  ctx.arc(260, 260, 240, 0, Math.PI * 2);
  ctx.fill();
}

const drawBtn = document.getElementById('drawBtn');
if (drawBtn) drawBtn.style.display = isLoggedIn() ? 'block' : 'none';

drawBtn?.addEventListener('click', async () => {
  const res = await fetch('/api/draw', { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` } });
  const data = await res.json();
  const out = document.getElementById('winners');
  if (data.winner) out.innerHTML += `<li>جائزة ${data.prize_number}: ${data.winner}</li>`;
  else out.innerHTML += `<li>${data.error || 'تعذر السحب'}</li>`;
});
