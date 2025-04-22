document.addEventListener("DOMContentLoaded", () => {
  const monthSelect = document.getElementById("monthSelect");
  const searchInput = document.getElementById("searchInput");
  const tableBody = document.getElementById("planningTableBody");

  async function fetchData(month) {
    try {
      const res = await fetch(`http://localhost:3000/api/planning/${month}`);
      const data = await res.json();
      console.log("📦 Datos recibidos:", data);

      if (!Array.isArray(data)) {
        tableBody.innerHTML = '<tr><td colspan="4">⚠️ Error en el format de dades.</td></tr>';
        return;
      }

      renderTable(data);
      searchInput.addEventListener("input", () => filterTable(data));
    } catch (error) {
      console.error("❌ Error:", error);
      tableBody.innerHTML = '<tr><td colspan="4">⚠️ Error carregant dades.</td></tr>';
    }
  }

  function renderTable(data) {
    tableBody.innerHTML = data.map(row => `
      <tr>
        <td>${row.Dia}</td>
        <td>${row.Hora}</td>
        <td>${row.Activitat}</td>
        <td>${row.Espai}</td>
      </tr>`).join('');
  }

  function filterTable(data) {
    const query = searchInput.value.toLowerCase();
    const filtered = data.filter(row =>
      (row.Dia || '').toLowerCase().includes(query) ||
      (row.Hora || '').toLowerCase().includes(query) ||
      (row.Activitat || '').toLowerCase().includes(query) ||
      (row.Espai || '').toLowerCase().includes(query)
    );
    renderTable(filtered);
  }

  monthSelect.addEventListener("change", () => fetchData(monthSelect.value));
  fetchData(monthSelect.value);
});