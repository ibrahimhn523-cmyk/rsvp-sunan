async function loadToday() {
  const res = await fetch('/api/today');
  const data = await res.json();
  const tbody = document.querySelector('#todayTable tbody');
  tbody.innerHTML = (data.participants || []).map((p) => `<tr><td>${p.name}</td><td>${p.correct_count}</td></tr>`).join('');
}
loadToday();
setInterval(loadToday, 60000);
