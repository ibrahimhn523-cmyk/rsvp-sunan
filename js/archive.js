async function loadArchive() {
  const res = await fetch('/api/archive');
  const data = await res.json();
  document.querySelector('#archiveTable tbody').innerHTML = (data.data || []).map((r) => `<tr><td>${r.name}</td><td>${r.total_correct}</td></tr>`).join('');
}
loadArchive();
