// Obtener la fecha real desde el backend
function getTodayFromServer() {
    return fetch('http://localhost:3000/api/date')
      .then(res => res.json())
      .then(data => {
        const today = new Date(data.today);
        today.setHours(0, 0, 0, 0);
        return today;
      })
      .catch(error => {
        console.error("❌ Error obtenint la data del servidor:", error);
        const fallback = new Date();
        fallback.setHours(0, 0, 0, 0);
        return fallback;
      });
  }
  
  // Comparar una fecha con hoy → devuelve 'past' | 'today' | 'future'
  function compararFechaConHoy(fechaDia, today) {
    const dia = new Date(fechaDia);
    dia.setHours(0, 0, 0, 0);
    if (dia.getTime() < today.getTime()) return 'past';
    if (dia.getTime() === today.getTime()) return 'today';
    return 'future';
  }
  
  // Obtener el nombre del mes actual (por ejemplo: "Abril 2025")
  function obtenerMesActual() {
    const now = new Date();
    const mesesCatalan = [
      "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
      "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
    ];
    const nombre = `${mesesCatalan[now.getMonth()]} ${now.getFullYear()}`;
    return nombre;
  }
  