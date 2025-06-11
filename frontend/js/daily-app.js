document.addEventListener('DOMContentLoaded', async () => {
  const mesActual = obtenerMesActual();
  try {
    const actividades = await fetchData(mesActual);
    const dias = [...new Set(actividades.map(a => a.Dia))];
    const select = document.getElementById('daySelect');
    dias.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
    let indice = 0;
    function actualizar() {
      const dia = dias[indice];
      pintarVistaDiaria(actividades, dia);
      select.value = dia;
    }
    select.addEventListener('change', () => {
      indice = dias.indexOf(select.value);
      actualizar();
    });
    document.getElementById('prevDay').addEventListener('click', () => {
      indice = (indice - 1 + dias.length) % dias.length;
      actualizar();
    });
    document.getElementById('nextDay').addEventListener('click', () => {
      indice = (indice + 1) % dias.length;
      actualizar();
    });
    actualizar();
  } catch (err) {
    console.error('❌ Error carregant activitats:', err);
  }
});
