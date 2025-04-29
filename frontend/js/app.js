document.addEventListener("DOMContentLoaded", async () => {
  const selectMes = document.getElementById("monthSelect");
  const inputBuscar = document.getElementById("searchInput");

  const mesActual = obtenerMesActual();
  selectMes.value = mesActual;

  const hoy = await getTodayFromServer();
  let actividades = [];

  async function cargarYMosstrar(mes) {
    try {
      actividades = await fetchData(mes);
      renderizarActivitats(actividades, hoy, mes);
    } catch (err) {
      console.error("❌ Error carregant activitats:", err);
    }
  }

  selectMes.addEventListener("change", () => {
    cargarYMosstrar(selectMes.value);
  });

  inputBuscar.addEventListener("input", () => {
    const filtradas = filtrarActivitats(actividades, inputBuscar.value);
    renderizarActivitats(filtradas, hoy, selectMes.value);
  });

  await cargarYMosstrar(mesActual);
});
