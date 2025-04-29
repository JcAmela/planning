function renderizarActivitats(data, todayDate, mesSeleccionado) {
    const container = document.getElementById("activitiesContainer");
    container.innerHTML = '';
  
    const agrupado = agruparPerDia(data);
    let bloqueDelDiaActual = null;
  
    const horaActual = new Date().toTimeString().slice(0, 5); // formato "HH:MM"
    const esMesActual = mesSeleccionado === obtenerMesActual();
  
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
  
        // ✅ Solo aplicamos clases si el mes visible es el actual
        if (esMesActual && estado === "past") {
          bloque.classList.add("day-past");
        }
        if (esMesActual && estado === "today") {
          bloque.classList.add("day-today");
          bloqueDelDiaActual = bloque;
        }
  
        const cardsHTML = actividades.map(act => {
          const esAhora = esMesActual && act.Hora?.startsWith(horaActual);
          return `
            <div class="activity-card${esAhora ? ' activity-now' : ''}">
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
  
    // Scroll automático al día de hoy si existe
    if (bloqueDelDiaActual) {
      bloqueDelDiaActual.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
  
  // Agrupar actividades por día
  function agruparPerDia(data) {
    return data.reduce((acc, act) => {
      acc[act.Dia] = acc[act.Dia] || [];
      acc[act.Dia].push(act);
      return acc;
    }, {});
  }
  