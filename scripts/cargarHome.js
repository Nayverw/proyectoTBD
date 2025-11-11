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

  // Mensaje de bienvenida
  if (bienvenida) {
    bienvenida.textContent = `¡Bienvenido, ${nombreUsuario}!`;
  }

  // Botón volver
  const btnVolver = document.createElement("button");
  btnVolver.textContent = "Volver al inicio";
  btnVolver.className = "volver-btn";
  btnVolver.style.display = "none";
  contenedorDisponibles.parentElement.appendChild(btnVolver);

  btnVolver.addEventListener("click", () => {
    contenedorInscritos.style.display = "none";
    contenedorDisponibles.style.display = "none";
    btnVolver.style.display = "none";
    mainBox.style.display = "flex";
  });

  // === Crear modal flotante ===
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "modal-overlay";
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = 0;
  modalOverlay.style.left = 0;
  modalOverlay.style.width = "100vw";
  modalOverlay.style.height = "100vh";
  modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modalOverlay.style.display = "none";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = "9999";

  const modalContent = document.createElement("div");
  modalContent.id = "modal-content";
  modalContent.style.backgroundColor = "white";
  modalContent.style.borderRadius = "10px";
  modalContent.style.padding = "20px";
  modalContent.style.width = "60%";
  modalContent.style.maxHeight = "80vh";
  modalContent.style.overflowY = "auto";
  modalContent.style.position = "relative";
  modalContent.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";

  // Botón cerrar modal
  const closeModalBtn = document.createElement("button");
  closeModalBtn.textContent = "✖";
  closeModalBtn.style.position = "absolute";
  closeModalBtn.style.top = "10px";
  closeModalBtn.style.right = "15px";
  closeModalBtn.style.background = "none";
  closeModalBtn.style.border = "none";
  closeModalBtn.style.fontSize = "20px";
  closeModalBtn.style.cursor = "pointer";

  closeModalBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });

  modalContent.appendChild(closeModalBtn);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // === Función para abrir modal con contenido dinámico ===
  function abrirModal(titulo, contenidoHTML) {
    modalContent.innerHTML = `
      <button id="close-modal" style="
        position:absolute; top:10px; right:15px;
        background:none; border:none; font-size:20px; cursor:pointer;
      ">✖</button>
      <h2 style="margin-top:30px; color:#0a0a5c; font-weight:700; text-align:center;">
        ${titulo}
      </h2>
      <div>${contenidoHTML}</div>
    `;

    modalOverlay.style.display = "flex";
    document.getElementById("close-modal").addEventListener("click", () => {
      modalOverlay.style.display = "none";
    });
  }

  // === Crear tarjeta curso ===
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
    } else if (tipo === "inscrito") {
      const btn = document.createElement("button");
      btn.textContent = "Retirarse";
      btn.className = "small-button danger";
      btn.addEventListener("click", () => retirarseCurso(curso.id_curso));
      card.appendChild(btn);
    }

    return card;
  }

  // === Cargar cursos ===
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

        const rol = data.rol || "";

        if (rol === "ESTUDIANTE") {
          document.querySelector("#cursos-inscritos-container .cursos-titulo").textContent = "Cursos Activos";
          if (data.cursos_inscritos?.length > 0) {
            data.cursos_inscritos.forEach(curso => {
              divInscritos.appendChild(crearCursoCard(curso, "inscrito"));
            });
          } else {
            divInscritos.innerHTML = "<p>No tienes cursos activos.</p>";
          }

          document.querySelector("#cursos-disponibles-container .cursos-titulo").textContent = "Cursos Disponibles";
          if (data.cursos_disponibles?.length > 0) {
            data.cursos_disponibles.forEach(curso => {
              divDisponibles.appendChild(crearCursoCard(curso, "disponible"));
            });
          } else {
            divDisponibles.innerHTML = "<p>No hay cursos disponibles.</p>";
          }
        } else if (rol === "DOCENTE") {
          document.querySelector("#cursos-inscritos-container .cursos-titulo").textContent = "Cursos que Dictas";
          contenedorDisponibles.style.display = "none";

          if (data.cursos?.length > 0) {
            data.cursos.forEach(curso => {
              const card = document.createElement("div");
              card.classList.add("curso-rectangulo");
              card.innerHTML = `
                <h3>${curso.nombre_curso}</h3>
                <p>Estado: ${curso.estado}</p>
              `;

              const btn = document.createElement("button");
              btn.textContent = "Ver alumnos inscritos";
              btn.className = "small-button";
              btn.addEventListener("click", () => cargarAlumnosCurso(curso.id_curso, curso.nombre_curso));
              card.appendChild(btn);

              divInscritos.appendChild(card);
            });
          } else {
            divInscritos.innerHTML = "<p>No estás dictando ningún curso actualmente.</p>";
          }
        }

        btnVolver.style.display = "block";
      })
      .catch(err => console.error("Error al cargar cursos:", err));
  }

  // === Inscribirse ===
  function inscribirseCurso(idCurso) {
    const formData = new FormData();
    formData.append("id_curso", idCurso);
    formData.append("id_rol_usuario", idRolUsuario);

    fetch("../processes/inscribirseCurso.php", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        alert(data.success ? "Inscripción exitosa." : data.error || "Error al inscribirse.");
        if (data.success) cargarCursos();
      })
      .catch(err => console.error("Error en inscripción:", err));
  }

  // === Retirarse ===
  function retirarseCurso(idCurso) {
    if (!confirm("¿Seguro que deseas retirarte de este curso?")) return;
    alert("Te has retirado del curso (solo visualmente).");
    cargarCursos();
  }

  // === Mostrar alumnos ===
  function cargarAlumnosCurso(idCurso, nombreCurso) {
    fetch(`../processes/obtenerAlumnosCurso.php?id_curso=${idCurso}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          alert(data.error || "No se pudieron cargar los alumnos.");
          return;
        }

        let contenido = "";
        if (data.alumnos.length === 0) {
          contenido = "<p>No hay alumnos inscritos.</p>";
        } else {
          contenido = `<ul class="lista-alumnos">
            ${data.alumnos
              .map(a => `<li>👤 ${a.nombre_usuario} <span>(${a.correo})</span></li>`)
              .join("")}
          </ul>`;

        }

        abrirModal(`Alumnos de ${nombreCurso}`, contenido);
      })
      .catch(err => console.error("Error al cargar alumnos:", err));
  }

  // === Estado inicial ===
  mainBox.style.display = "flex";
  contenedorInscritos.style.display = "none";
  contenedorDisponibles.style.display = "none";
  btnVolver.style.display = "none";

  btnCursos.addEventListener("click", () => {
    mainBox.style.display = "none";
    contenedorInscritos.style.display = "flex";
    contenedorDisponibles.style.display = "flex";
    cargarCursos();
  });
});