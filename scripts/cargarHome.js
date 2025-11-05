document.addEventListener("DOMContentLoaded", () => {
  const idRolUsuario = sessionStorage.getItem("id_rol_usuario");
  const nombreUsuario = sessionStorage.getItem("nombre_usuario") || "Usuario";

  const mainBox = document.getElementById("main-box");
  const contenedorInscritos = document.getElementById("cursos-inscritos-container");
  const contenedorDisponibles = document.getElementById("cursos-disponibles-container");
  const divInscritos = document.getElementById("cursos-inscritos");
  const divDisponibles = document.getElementById("cursos-disponibles");
  const btnCursos = document.getElementById("btn-cursos");
  const bienvenida = document.getElementById("bienvenida");

  // Mostrar mensaje de bienvenida dinámico
  if (bienvenida) {
    bienvenida.textContent = `¡Bienvenido, ${nombreUsuario}!`;
  }

  // Crear botón "Volver al inicio"
  const btnVolver = document.createElement("button");
  btnVolver.textContent = "Volver al inicio";
  btnVolver.className = "volver-btn";
  btnVolver.style.display = "none"; // Oculto al principio
  contenedorDisponibles.parentElement.appendChild(btnVolver); // Se agrega fuera del contenedor blanco

  // Acción del botón "Volver al inicio"
  btnVolver.addEventListener("click", () => {
    contenedorInscritos.style.display = "none";
    contenedorDisponibles.style.display = "none";
    btnVolver.style.display = "none";
    mainBox.style.display = "flex";
  });

  // Crear tarjeta de curso
  function crearCursoCard(curso, tipo) {
    const card = document.createElement("div");
    card.classList.add("curso-rectangulo");
    card.innerHTML = `
      <h3>${curso.nombre_curso || "Curso sin nombre"}</h3>
      ${curso.descripcion ? `<p>${curso.descripcion}</p>` : ""}
    `;

    if (tipo === "disponible") {
      const btn = document.createElement("button");
      btn.textContent = "Inscribirse";
      btn.className = "small-button";
      btn.addEventListener("click", () => inscribirseCurso(curso.id_curso));
      card.appendChild(btn);
    }

    return card;
  }

  // Cargar cursos desde el servidor
  function cargarCursos() {
    if (!idRolUsuario) {
      alert("No se encontró el ID del usuario. Inicia sesión nuevamente.");
      return;
    }

    fetch(`../processes/cargarHome.php?id_rol_usuario=${idRolUsuario}`)
      .then(res => res.json())
      .then(data => {
        divInscritos.innerHTML = "";
        divDisponibles.innerHTML = "";

        if (!data.success) {
          alert(data.error || "Error al cargar los cursos.");
          return;
        }

        // Títulos
        document.querySelector("#cursos-inscritos-container .cursos-titulo").textContent = "Cursos Activos";
        document.querySelector("#cursos-disponibles-container .cursos-titulo").textContent = "Cursos Disponibles";

        // Cursos activos
        if (data.cursos_inscritos && data.cursos_inscritos.length > 0) {
          data.cursos_inscritos.forEach(curso => {
            divInscritos.appendChild(crearCursoCard(curso, "inscrito"));
          });
        } else {
          divInscritos.innerHTML = "<p>No tienes cursos activos.</p>";
        }

        // Cursos disponibles
        if (data.cursos_disponibles && data.cursos_disponibles.length > 0) {
          data.cursos_disponibles.forEach(curso => {
            divDisponibles.appendChild(crearCursoCard(curso, "disponible"));
          });
        } else {
          divDisponibles.innerHTML = "<p>No hay cursos disponibles.</p>";
        }

        // Mostrar el botón "Volver al inicio"
        btnVolver.style.display = "block";
      })
      .catch(err => console.error("Error al cargar cursos:", err));
  }

  // Función de inscripción
  function inscribirseCurso(idCurso) {
    const formData = new FormData();
    formData.append("id_curso", idCurso);
    formData.append("id_rol_usuario", idRolUsuario);

    fetch("../processes/inscribirseCurso.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Inscripción exitosa.");
          cargarCursos();
        } else {
          alert(data.error || "Error al inscribirse.");
        }
      })
      .catch(err => console.error("Error en inscripción:", err));
  }

  // Estado inicial
  mainBox.style.display = "flex";
  contenedorInscritos.style.display = "none";
  contenedorDisponibles.style.display = "none";
  btnVolver.style.display = "none";

  // Evento botón "Cursos"
  btnCursos.addEventListener("click", () => {
    mainBox.style.display = "none";
    contenedorInscritos.style.display = "flex";
    contenedorDisponibles.style.display = "flex";
    cargarCursos();
  });
});
