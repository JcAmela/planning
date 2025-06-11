function pintarSemana(data) {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horas = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','16:30','17:30','18:30','19:30','20:30','21:30'];
  const contenedor = document.getElementById('weekContainer');
  contenedor.innerHTML = '';

  dias.forEach(dia => {
    const columna = document.createElement('div');
    columna.className = 'day-column';

    const cabecera = document.createElement('div');
    cabecera.className = 'day-header';
    cabecera.textContent = dia;
    columna.appendChild(cabecera);

    horas.forEach(hora => {
      const bloque = document.createElement('div');
      bloque.className = 'timeslot';

      const actividad = data.find(a => a.Dia.toLowerCase().includes(dia.toLowerCase()) && a.Hora === hora);
      if (actividad) {
        bloque.innerHTML = `<span><strong>${actividad.Hora}</strong></span>` +
          `<span>${actividad.Activitat}</span>` +
          `<span>${actividad.Espai}</span>` +
          `<span>${actividad.Organitza}</span>`;
      } else {
        bloque.classList.add('empty');
      }

      columna.appendChild(bloque);
    });

    contenedor.appendChild(columna);
  });
}
