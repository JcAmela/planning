document.addEventListener('DOMContentLoaded', async () => {
  const mesActual = obtenerMesActual();
  try {
    const actividades = await fetchData(mesActual);
    pintarSemana(actividades);
  } catch (err) {
    console.error('❌ Error carregant activitats:', err);
  }
});
