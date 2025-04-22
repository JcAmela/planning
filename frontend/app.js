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
  const container = document.getElementById("activitiesContainer");
  container.innerHTML = '';

  const groupedByDay = data.reduce((acc, row) => {
    acc[row.Dia] = acc[row.Dia] || [];
    acc[row.Dia].push(row);
    return acc;
  }, {});

  Object.keys(groupedByDay)
  .sort((a, b) => {
    // Extrae el número de día del texto, ej: "Dijous 16" => 16
    const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
    return numA - numB;
  })
  .forEach(day => {
    const activities = groupedByDay[day];
    const dayBlock = document.createElement("div");
    dayBlock.className = "day-block";

    dayBlock.innerHTML = `
      <div class="day-header">🗓️ ${day}</div>
      <div class="activities-list">
        ${activities.map(act => `
          <div class="activity-card">
            <div class="activity-left">
              <div class="activity-icon">${getIcon(act.Activitat)}</div>
              <div>
                <div class="activity-name">${act.Activitat}</div>
                <div class="activity-space">${act.Espai}</div>
              </div>
            </div>
            <div class="activity-hour">${act.Hora}</div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(dayBlock);
  });
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

function getIcon(activityName) {
  const name = activityName.toLowerCase();
  if (name.includes("pintura")) return "🎨";
  if (name.includes("zumba")) return "💃";
  if (name.includes("pilates")) return "🧘";
  if (name.includes("escacs")) return "♟️";
  if (name.includes("esgrima")) return "⚔️";
  return "🎯"; // genérico
}
