// Cargar datos desde el backend para un mes concreto
function fetchData(mes) {
    return fetch(`http://localhost:3000/api/planning/${mes}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("⚠️ El format de dades no és vàlid.");
        }
        return data;
      });
  }
  
  // Filtrar actividades según un texto (nombre, día, hora, espai)
  function filtrarActivitats(data, query) {
    const lower = query.toLowerCase();
    return data.filter(row =>
      (row.Dia || '').toLowerCase().includes(lower) ||
      (row.Hora || '').toLowerCase().includes(lower) ||
      (row.Activitat || '').toLowerCase().includes(lower) ||
      (row.Espai || '').toLowerCase().includes(lower)
    );
  }
  