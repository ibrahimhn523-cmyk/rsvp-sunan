async function loadQuestion() {
  const res = await fetch('/api/question');
  const data = await res.json();
  const container = document.getElementById('questions');
  container.innerHTML = '';
  if (!data.questions?.length) return (container.innerHTML = '<p class="muted">لا يوجد أسئلة متاحة حالياً.</p>');

  data.questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>سؤال ${idx + 1}</h3>
      <p>${q.question_text}</p>
      ${['a','b','c','d'].map((k) => `<label class="option"><input required name="${q.question_id}" type="radio" value="${k}"> ${q.options[k]}</label>`).join('')}
    `;
    container.appendChild(card);
  });
}

document.getElementById('quizForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const name = form.get('name');
  const phone = form.get('phone');
  const answers = {};
  for (const [k, v] of form.entries()) if (!['name', 'phone'].includes(k)) answers[k] = v;

  const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, answers }) });
  const data = await res.json();
  document.getElementById('status').textContent = data.error || data.message || 'تم';
});

loadQuestion();
