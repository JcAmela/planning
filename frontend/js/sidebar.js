// sidebar.js

export function initSidebar(buscarCallback, recargarCallback, cambiarMesCallback) {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");
    const searchInput = document.getElementById("sidebarSearchInput");
    const refreshBtn = document.getElementById("sidebarRefresh");
    const monthSelect = document.getElementById("sidebarMonthSelect");
  
    function abrirSidebar() {
      sidebar.classList.add("open");
      document.body.classList.add("sidebar-open");
      toggle.style.display = "none";
      searchInput?.focus();
    }
  
    function cerrarSidebar() {
      sidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      toggle.style.display = "flex";
    }
  
    // Toggle de apertura/cierre manual
    toggle.addEventListener("click", () => {
      const abierto = sidebar.classList.contains("open");
      if (abierto) {
        cerrarSidebar();
      } else {
        abrirSidebar();
      }
    });
  
    // Buscar mientras se escribe
    searchInput.addEventListener("input", (e) => {
      buscarCallback(e.target.value);
    });
  
    // Botón actualizar
    refreshBtn.addEventListener("click", () => {
      recargarCallback();
    });
  
    // Cambio de mes
    monthSelect.addEventListener("change", (e) => {
      cambiarMesCallback(e.target.value);
    });
  
    // Cierre automático al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (
        document.body.classList.contains("sidebar-open") &&
        !sidebar.contains(e.target) &&
        e.target !== toggle
      ) {
        cerrarSidebar();
      }
    });
  
    // Apertura automática al pasar el ratón por el borde izquierdo
    document.addEventListener("mousemove", (e) => {
      if (e.clientX <= 10 && !sidebar.classList.contains("open")) {
        abrirSidebar();
      }
    });
  }
  