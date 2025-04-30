// app.js
import { initSidebar } from './sidebar.js';

document.addEventListener("DOMContentLoaded", async () => {
  const hoy = await getTodayFromServer();
  let actividades = [];
  let mesSeleccionado = obtenerMesActual();

  // Cargar y mostrar actividades de un mes
  async function cargarYMosstrar(mes) {
    try {
      mesSeleccionado = mes;
      actividades = await fetchData(mes);
      renderizarActivitats(actividades, hoy, mes);

      // Actualizar selector del sidebar tras carga (solo si existe)
      const mesSelector = document.getElementById("sidebarMonthSelect");
      if (mesSelector) mesSelector.value = mes;
    } catch (err) {
      console.error("❌ Error carregant activitats:", err);
    }
  }

  // Buscar actividades por texto
  function buscarActivitats(texto) {
    const filtradas = filtrarActivitats(actividades, texto);
    renderizarActivitats(filtradas, hoy, mesSeleccionado);
  }

  // Refrescar la vista sin volver a cargar
  function refrescarVista() {
    const valor = document.getElementById("sidebarSearchInput")?.value || "";
    buscarActivitats(valor);
  }

  // Cambiar mes desde el menú lateral
  function cambiarMes(nuevoMes) {
    cargarYMosstrar(nuevoMes);
  }

  // Inicializar menú lateral con callbacks
  initSidebar(buscarActivitats, refrescarVista, cambiarMes);

  // Cargar automáticamente el mes actual y hacer scroll al día actual
  await cargarYMosstrar(mesSeleccionado);
});
