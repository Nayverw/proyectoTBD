// C:\xampp\htdocs\proyectoTBD\scripts\cargarHome.js

document.addEventListener("DOMContentLoaded", () => {
  const idRolUsuario = sessionStorage.getItem("id_rol_usuario");
  const nombreUsuario = sessionStorage.getItem("nombre_usuario") || "Usuario";
  const rolUsuario = (sessionStorage.getItem("rol_usuario") || "").toUpperCase();

  // ==== BOTÓN CERRAR SESIÓN ====
  const btnCerrar = document.getElementById("btn-cerrar");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "../index.html";
    });
  }

  const actionsBlock = document.querySelector(".actions-block");

  // ==== BOTÓN BITÁCORA SOLO PARA ADMIN ====
  if (rolUsuario === "ADMINISTRADOR" && actionsBlock) {
    const btnBitacora = document.createElement("button");
    btnBitacora.textContent = "Bitácora";
    btnBitacora.classList.add("menu-button");
    btnBitacora.id = "btn-bitacora";
    actionsBlock.appendChild(btnBitacora);
  }

  // ==== BOTÓN CURSOS / HORARIOS SEGÚN ROL ====
  const btnCursos = document.getElementById("btn-cursos");
  if (btnCursos && rolUsuario === "ADMINISTRADOR") {
    btnCursos.textContent = "Horarios"; // mostrar como Horarios para admin
  }

  // ==== MAPA DE BOTONES Y MÓDULOS ====
  const botones = {
    cursos: rolUsuario === "ADMINISTRADOR" ? "Horarios" : "Cursos", // admin -> Horarios
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
    almacen: "Almacen",
    bitacora: "Bitacora"
  };

  // ==== AGREGAR EVENT LISTENER A LOS BOTONES ====
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
