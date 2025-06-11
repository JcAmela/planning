// vistas.js

// -------- Utilidades de fecha --------
function getTodayFromServer() {
  return fetch('http://localhost:3000/api/date')
    .then(res => res.json())
    .then(data => {
      const today = new Date(data.today);
      today.setHours(0, 0, 0, 0);
      return today;
    })
    .catch(() => {
      const fallback = new Date();
      fallback.setHours(0, 0, 0, 0);
      return fallback;
    });
}

function compararFechaConHoy(fechaDia, today) {
  const dia = new Date(fechaDia);
  dia.setHours(0, 0, 0, 0);
  if (dia.getTime() < today.getTime()) return 'past';
  if (dia.getTime() === today.getTime()) return 'today';
  return 'future';
}

function obtenerMesActual() {
  const now = new Date();
  const mesesCatalan = [
    'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
    'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
  ];
  return `${mesesCatalan[now.getMonth()]} ${now.getFullYear()}`;
}

// -------- Carga de datos --------
function fetchData(mes) {
  return fetch(`http://localhost:3000/api/planning/${mes}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error('Format de dades incorrecte');
      }
      return data;
    });
}

function filtrarActivitats(data, query) {
  const lower = query.toLowerCase();
  return data.filter(row =>
    (row.Dia || '').toLowerCase().includes(lower) ||
    (row.Hora || '').toLowerCase().includes(lower) ||
    (row.Activitat || '').toLowerCase().includes(lower) ||
    (row.Espai || '').toLowerCase().includes(lower)
  );
}

// -------- Iconos --------
function getIcon(nombreActividad) {
  const nom = (nombreActividad || '').toLowerCase();
  if (nom.includes('pintura')) return '🎨';
  if (nom.includes('zumba')) return '💃';
  if (nom.includes('pilates')) return '🧘';
  if (nom.includes('escacs')) return '♟️';
  if (nom.includes('esgrima')) return '⚔️';
  return '🎯';
}

// -------- Vista mensual --------
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

function agruparPerDia(data) {
  return data.reduce((acc, act) => {
    acc[act.Dia] = acc[act.Dia] || [];
    acc[act.Dia].push(act);
    return acc;
  }, {});
}

function renderizarActivitats(data, todayDate, mesSeleccionado) {
  const container = document.getElementById('activitiesContainer');
  if (!container) return;

  container.innerHTML = '';
  const agrupado = agruparPerDia(data);
  let bloqueDelDiaActual = null;

  const horaActual = new Date().toTimeString().slice(0, 5);
  const esMesActual = mesSeleccionado === obtenerMesActual();
  const diaActualNum = todayDate.getDate();

  Object.keys(agrupado)
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
      return numA - numB;
    })
    .forEach(diaText => {
      const acts = agrupado[diaText];
      const bloque = document.createElement('div');
      bloque.className = 'day-block';

      const diaNum = parseInt(diaText.match(/\d+/)?.[0] || 0, 10);
      const fechaDelDia = new Date(todayDate);
      fechaDelDia.setDate(diaNum);

      const estado = compararFechaConHoy(fechaDelDia, todayDate);
      if (esMesActual && estado === 'past') bloque.classList.add('day-past');
      if (esMesActual && estado === 'today') {
        bloque.classList.add('day-today');
        bloqueDelDiaActual = bloque;
      }

      const esHoy = diaNum === diaActualNum;

      const cardsHTML = acts
        .map(act => {
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
            </div>`;
        })
        .join('');

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

// -------- Vista diaria --------
function pintarVistaDiaria(actividades, dia) {
  const contenedor = document.getElementById('dayContainer');
  if (!contenedor) return;

  const filtradas = actividades
    .filter(a => a.Dia.toLowerCase().includes(dia.toLowerCase()))
    .sort((a, b) => a.Hora.localeCompare(b.Hora));

  contenedor.innerHTML = '';

  if (!filtradas.length) {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No hay actividades para este día.';
    contenedor.appendChild(mensaje);
    return;
  }

  filtradas.forEach(act => {
    const card = document.createElement('div');
    card.className = 'activity-card';

    const left = document.createElement('div');
    left.className = 'activity-left';

    const nombre = document.createElement('div');
    nombre.className = 'activity-name';
    nombre.textContent = act.Activitat;

    const espacio = document.createElement('div');
    espacio.className = 'activity-space';
    espacio.textContent = `${act.Espai} · ${act.Organitza}`;

    left.appendChild(nombre);
    left.appendChild(espacio);

    const hora = document.createElement('div');
    hora.className = 'activity-hour';
    hora.textContent = act.Hora;

    card.appendChild(left);
    card.appendChild(hora);
    contenedor.appendChild(card);
  });
}

// -------- Vista semanal --------
function pintarSemana(data) {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horas = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','16:30','17:30','18:30','19:30','20:30','21:30'];
  const contenedor = document.getElementById('weekContainer');
  if (!contenedor) return;
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

// -------- Menú lateral --------
function initSidebar(buscarCallback, recargarCallback, cambiarMesCallback) {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const searchInput = document.getElementById('sidebarSearchInput');
  const refreshBtn = document.getElementById('sidebarRefresh');
  const monthSelect = document.getElementById('sidebarMonthSelect');

  function abrirSidebar() {
    sidebar.classList.add('open');
    document.body.classList.add('sidebar-open');
    toggle.style.display = 'none';
    searchInput?.focus();
  }

  function cerrarSidebar() {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
    toggle.style.display = 'flex';
  }

  toggle.addEventListener('click', () => {
    const abierto = sidebar.classList.contains('open');
    if (abierto) {
      cerrarSidebar();
    } else {
      abrirSidebar();
    }
  });

  searchInput.addEventListener('input', e => {
    buscarCallback(e.target.value);
  });

  refreshBtn.addEventListener('click', () => {
    recargarCallback();
  });

  monthSelect.addEventListener('change', e => {
    cambiarMesCallback(e.target.value);
  });

  document.addEventListener('click', e => {
    if (document.body.classList.contains('sidebar-open') && !sidebar.contains(e.target) && e.target !== toggle) {
      cerrarSidebar();
    }
  });

  document.addEventListener('mousemove', e => {
    if (e.clientX <= 10 && !sidebar.classList.contains('open')) {
      abrirSidebar();
    }
  });
}

// -------- Lógica principal --------
document.addEventListener('DOMContentLoaded', async () => {
  const hoy = await getTodayFromServer();
  let actividades = [];
  let mesSeleccionado = obtenerMesActual();

  const btnDaily = document.getElementById('btnDaily');
  const btnWeekly = document.getElementById('btnWeekly');
  const btnMonthly = document.getElementById('btnMonthly');

  const dailyView = document.getElementById('dailyView');
  const weeklyView = document.getElementById('weeklyView');
  const monthlyView = document.getElementById('monthlyView');

  const select = document.getElementById('daySelect');
  const prevDayBtn = document.getElementById('prevDay');
  const nextDayBtn = document.getElementById('nextDay');

  let dias = [];
  let indice = 0;

  function mostrar(vista) {
    dailyView.classList.add('d-none');
    weeklyView.classList.add('d-none');
    monthlyView.classList.add('d-none');
    if (vista === 'daily') dailyView.classList.remove('d-none');
    if (vista === 'weekly') weeklyView.classList.remove('d-none');
    if (vista === 'monthly') monthlyView.classList.remove('d-none');
  }

  btnDaily.addEventListener('click', () => mostrar('daily'));
  btnWeekly.addEventListener('click', () => mostrar('weekly'));
  btnMonthly.addEventListener('click', () => mostrar('monthly'));

  function rellenarSelect() {
    select.innerHTML = '';
    dias.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    });
  }

  function actualizarDia() {
    const dia = dias[indice];
    pintarVistaDiaria(actividades, dia);
    select.value = dia;
  }

  select.addEventListener('change', () => {
    indice = dias.indexOf(select.value);
    actualizarDia();
  });

  prevDayBtn.addEventListener('click', () => {
    indice = (indice - 1 + dias.length) % dias.length;
    actualizarDia();
  });

  nextDayBtn.addEventListener('click', () => {
    indice = (indice + 1) % dias.length;
    actualizarDia();
  });

  async function cargarYMosstrar(mes) {
    try {
      mesSeleccionado = mes;
      actividades = await fetchData(mes);
      dias = [...new Set(actividades.map(a => a.Dia))];
      rellenarSelect();
      indice = 0;
      actualizarDia();
      pintarSemana(actividades);
      renderizarActivitats(actividades, hoy, mesSeleccionado);
    } catch (err) {
      console.error('Error carregant activitats:', err);
    }
  }

  function buscar(texto) {
    const filtradas = filtrarActivitats(actividades, texto);
    renderizarActivitats(filtradas, hoy, mesSeleccionado);
  }

  function refrescar() {
    const valor = document.getElementById('sidebarSearchInput')?.value || '';
    buscar(valor);
  }

  function cambiarMes(nuevoMes) {
    cargarYMosstrar(nuevoMes);
  }

  initSidebar(buscar, refrescar, cambiarMes);

  await cargarYMosstrar(mesSeleccionado);
  mostrar('monthly');
});

