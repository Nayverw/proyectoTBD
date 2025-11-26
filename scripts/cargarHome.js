document.addEventListener("DOMContentLoaded", () => {
  const idRolUsuario = sessionStorage.getItem("id_rol_usuario");
  const nombreUsuario = sessionStorage.getItem("nombre_usuario") || "Usuario";

  // ==== BOTÓN CERRAR SESIÓN ====
  const btnCerrar = document.getElementById("btn-cerrar");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "../index.html";
    });
  }

  const botones = {
    cursos: "Cursos",
    docentes: "Docentes",
    recompensas: "Recompensas",
    insignias: "Insignias",
    pagos: "Pagos",
    oferta: "Oferta",
    seminarios: "Seminarios",
    foros: "Foros",
    canjear: "CanjearRecompensas",
    gestionpuntos: "GestionPuntos",
    logros: "Logros",
    ranking: "Ranking",
    almacen: "Almacen"
  };

  Object.entries(botones).forEach(([id, nombreModulo]) => {
    const boton = document.getElementById(`btn-${id}`);
    if (!boton) return;

    boton.addEventListener("click", async () => {
      try {
        const modulo = await import(`./${nombreModulo}.js`);

        if (typeof modulo.iniciar === "function") {
          modulo.iniciar({ idRolUsuario, nombreUsuario });
        } else if (typeof modulo.mostrarContenido === "function") {
          modulo.mostrarContenido({ idRolUsuario, nombreUsuario });
        }
      } catch (error) {
        console.error(`Error al cargar el módulo ${nombreModulo}.js:`, error);
      }
    });
  });
});
