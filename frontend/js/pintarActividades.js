function renderizarActivitats(data, todayDate, mesSeleccionado) {
  const container = document.getElementById("activitiesContainer");
  container.innerHTML = '';

  const agrupado = agruparPerDia(data);
  let bloqueDelDiaActual = null;

  const horaActual = new Date().toTimeString().slice(0, 5); // HH:MM
  const esMesActual = mesSeleccionado === obtenerMesActual();
  const diaActualNum = todayDate.getDate();

  Object.keys(agrupado)
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
      return numA - numB;
    })
    .forEach(diaText => {
      const actividades = agrupado[diaText];
      const bloque = document.createElement("div");
      bloque.className = "day-block";

      const diaNum = parseInt(diaText.match(/\d+/)?.[0] || 0, 10);
      const fechaDelDia = new Date(todayDate);
      fechaDelDia.setDate(diaNum);

      const estado = compararFechaConHoy(fechaDelDia, todayDate);

      if (esMesActual && estado === "past") {
        bloque.classList.add("day-past");
      }
      if (esMesActual && estado === "today") {
        bloque.classList.add("day-today");
        bloqueDelDiaActual = bloque;
      }

      const esHoy = diaNum === diaActualNum;

      const cardsHTML = actividades.map(act => {
        const esAhora = esMesActual && esHoy && actividadEnCurso(act.Hora, horaActual);
        const tooltip = `Organitza: ${act.Organitza || ''}\nResponsable: ${act.Responsable || ''}\nTelèfon: ${act.Telefon || ''}\nObs: ${act.Observacions || ''}`;

        return `
          <div class="activity-card${esAhora ? ' activity-now' : ''}" title="${tooltip}">
            <div class="activity-left">
              <div class="activity-icon">${getIcon(act.Activitat)}</div>
              <div>
                <div class="activity-name">${act.Activitat}</div>
                <div class="activity-space">${act.Espai}</div>
              </div>
            </div>
            <div class="activity-hour">${act.Hora}</div>
          </div>
        `;
      }).join('');

      bloque.innerHTML = `
        <div class="day-header">🗓️ ${diaText}</div>
        <div class="activities-list">${cardsHTML}</div>
      `;

      container.appendChild(bloque);
    });

  if (bloqueDelDiaActual) {
    bloqueDelDiaActual.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function agruparPerDia(data) {
  return data.reduce((acc, act) => {
    acc[act.Dia] = acc[act.Dia] || [];
    acc[act.Dia].push(act);
    return acc;
  }, {});
}

function actividadEnCurso(rangoHorario, horaActual) {
  if (!rangoHorario || typeof rangoHorario !== 'string') return false;

  const limpio = rangoHorario.replace('h', '').trim();
  const [inicioStr, finStr] = limpio.split('-').map(s => s.trim());

  if (!inicioStr || !finStr) return false;

  const toMinutes = str => {
    const [h, m = '00'] = str.split(/[.:]/);
    return parseInt(h, 10) * 60 + parseInt(m, 10);
  };

  const horaEnMin = toMinutes(horaActual);
  const inicioEnMin = toMinutes(inicioStr);
  const finEnMin = toMinutes(finStr);

  return horaEnMin >= inicioEnMin && horaEnMin <= finEnMin;
}