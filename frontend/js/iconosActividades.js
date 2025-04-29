function getIcon(nombreActividad) {
    const nom = (nombreActividad || '').toLowerCase();
    if (nom.includes("pintura")) return "🎨";
    if (nom.includes("zumba")) return "💃";
    if (nom.includes("pilates")) return "🧘";
    if (nom.includes("escacs")) return "♟️";
    if (nom.includes("esgrima")) return "⚔️";
    return "🎯"; // icono genérico
  }
  