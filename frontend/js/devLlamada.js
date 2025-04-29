// devLlamada.js

document.addEventListener("DOMContentLoaded", async () => {
    const mesActual = obtenerMesActualDebug();
  
    try {
      const respuesta = await fetch(`http://localhost:3000/api/planning/${mesActual}`);
      const data = await respuesta.json();
  
      console.log("\uD83D\uDD0D JSON recibido del backend:", data);
    } catch (error) {
      console.error("❌ Error al hacer fetch en devLlamada.js:", error);
    }
  });
  
  function obtenerMesActualDebug() {
    const now = new Date();
    const mesesCatalan = [
      "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
      "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
    ];
    return `${mesesCatalan[now.getMonth()]} ${now.getFullYear()}`;
  }
  