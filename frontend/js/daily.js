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
