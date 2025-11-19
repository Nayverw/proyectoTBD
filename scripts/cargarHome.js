// C:\xampp\htdocs\proyectoTBD\scripts\cargarHome.js

document.addEventListener("DOMContentLoaded", () => {
  // Recuperar los datos del usuario
  const idRolUsuario = sessionStorage.getItem("id_rol_usuario");
  const nombreUsuario = sessionStorage.getItem("nombre_usuario") || "Usuario";

  // Mapeo de botones → módulos
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

  // Asignar eventos dinámicamente
  Object.entries(botones).forEach(([id, nombreModulo]) => {
    const boton = document.getElementById(`btn-${id}`);
    if (!boton) return;

    boton.addEventListener("click", async () => {
      try {
        const modulo = await import(`./${nombreModulo}.js`);

        if (typeof modulo.iniciar === "function") {
          // Para Cursos.js
          modulo.iniciar({ idRolUsuario, nombreUsuario });
        } else if (typeof modulo.mostrarContenido === "function") {
          // Para los otros 9 módulos
          modulo.mostrarContenido({ idRolUsuario, nombreUsuario });
        } else {
          console.warn(`El módulo ${nombreModulo}.js no tiene funciones válidas exportadas.`);
        }
      } catch (error) {
        console.error(`Error al cargar el módulo ${nombreModulo}.js:`, error);
      }
    });
  });
});
