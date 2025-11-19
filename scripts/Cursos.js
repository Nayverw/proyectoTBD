// C:\xampp\htdocs\proyectoTBD\scripts\Cursos.js
export function iniciar({ idRolUsuario, nombreUsuario }) {

  const mainBox = document.getElementById("main-box");
  const contenidoCentral = document.getElementById("contenido-central");
  const btnVolver = document.getElementById("btn-volver");

  if (!mainBox || !contenidoCentral) {
    console.error("No se encontró #main-box o #contenido-central en el DOM.");
    return;
  }

  // ============================
  // 1) ESTRUCTURA PRINCIPAL
  // ============================
  contenidoCentral.innerHTML = `
    <div id="cursos-inscritos-container" style="display:flex; flex-direction:column; height:100%; margin-bottom:20px;">
      <h3 class="cursos-titulo">Cursos Activos</h3>
      <div id="cursos-inscritos" class="cursos-scroll"></div>
    </div>
  `;

  if (btnVolver) btnVolver.style.display = "block";

  const contenedorInscritos = document.getElementById("cursos-inscritos-container");
  const contenedorDisponibles = document.getElementById("cursos-disponibles-container");
  const divInscritos = document.getElementById("cursos-inscritos");
  const divDisponibles = document.getElementById("cursos-disponibles");

  // botón volver
  if (btnVolver) {
    btnVolver.onclick = () => {
      contenidoCentral.innerHTML = `
        <div class="bienvenida-left">
          <h2 id="bienvenida-usuario">Bienvenido, ${nombreUsuario}</h2>
        </div>
        <div class="bienvenida-right">
          <p>Explora tus cursos y comienza a aprender hoy mismo.</p>
        </div>
      `;
      btnVolver.style.display = "none";
    };
  }

  // ============================
  // 2) CARGA DE CURSOS
  // ============================
  function cargarCursos() {
    fetch(`../processes/cargarHome.php?id_rol_usuario=${idRolUsuario}`)
      .then(res => res.json())
      .then(data => {
        if (divInscritos) divInscritos.innerHTML = "";
        if (divDisponibles) divDisponibles.innerHTML = "";

        if (!data.success) {
          alert(data.error || "Error al cargar los cursos.");
          return;
        }

        const rol = data.rol || "";

        if (rol === "ESTUDIANTE") {
          mostrarCursos(divInscritos, data.cursos_inscritos, "inscrito");
          if (divDisponibles) mostrarCursos(divDisponibles, data.cursos_disponibles, "disponible");
        }

        if (rol === "DOCENTE") {
          mostrarCursosDocente(divInscritos, data.cursos);
          if (contenedorDisponibles) contenedorDisponibles.style.display = "none";
        }
      })
      .catch(err => console.error("Error al cargar cursos:", err));
  }

  function mostrarCursos(div, lista, tipo) {
    if (!div) return;
    if (!lista?.length) {
      div.innerHTML = "<p>No hay cursos disponibles.</p>";
      return;
    }

    lista.forEach(curso => {
      const card = crearCursoCard(curso, tipo);
      div.appendChild(card);
    });
  }

  // ============================
  // 3) MODIFICADO → TARJETA DE CURSO
  // ============================
  function crearCursoCard(curso, tipo) {
    const card = document.createElement("div");
    card.classList.add("curso-rectangulo");
    card.innerHTML = `<h3>${curso.nombre_curso}</h3>`;

    const btn = document.createElement("button");
    btn.className = "small-button";

    if (tipo === "disponible") {
      btn.textContent = "Inscribirse";
      btn.addEventListener("click", () => mostrarInfoCurso(curso.id_curso));
    } 
    else if (tipo === "inscrito") {
      btn.textContent = "Retirarse";
      btn.classList.add("danger");
      btn.addEventListener("click", () => retirarseCurso(curso.id_curso));
    }

    card.appendChild(btn);
    return card;
  }

  // ============================
  // 4) NUEVO: MODAL DE INFORMACIÓN DEL CURSO
  // ============================
  function mostrarInfoCurso(idCurso) {
    fetch(`../processes/infoCurso.php?id_curso=${idCurso}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          alert(data.error || "No se pudo cargar información del curso.");
          return;
        }

        const curso = data.curso;

        const contenidoHTML = `
          <p><strong>Docente:</strong> ${curso.docente}</p>
          <p><strong>Descripción:</strong> ${curso.descripcion}</p>
          <p><strong>Duración:</strong> ${curso.duracion}</p>
          <p><strong>Modalidad:</strong> ${curso.modalidad}</p>
          <p><strong>Estado:</strong> ${curso.estado}</p>

          <button id="btn-confirmar-inscripcion" class="small-button" style="margin-top:20px;">
            Confirmar inscripción
          </button>
        `;

        abrirModal(`Información del curso: ${curso.nombre_curso}`, contenidoHTML);

        document.getElementById("btn-confirmar-inscripcion").onclick = () => {
          inscribirseCurso(idCurso);
          cerrarModal();
        };
      });
  }

  // ============================
  // 5) INSCRIBIR Y RETIRAR
  // ============================
  function inscribirseCurso(idCurso) {
    const formData = new FormData();
    formData.append("id_curso", idCurso);
    formData.append("id_rol_usuario", idRolUsuario);

    fetch("../processes/inscribirseCurso.php", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        alert(data.success ? "Inscripción exitosa." : data.error);
        if (data.success) cargarCursos();
      })
      .catch(err => console.error("Error en inscripción:", err));
  }

  function retirarseCurso(idCurso) {
    if (!confirm("¿Seguro que deseas retirarte de este curso?")) return;
    const fd = new FormData();
    fd.append("id_curso", idCurso);
    fd.append("id_rol_usuario", idRolUsuario);

    fetch("../processes/retirarseCurso.php", { method: "POST", body: fd })
      .then(r => r.json())
      .then(data => {
        alert(data.success ? "Te has retirado del curso." : data.error);
        cargarCursos();
      })
      .catch(err => console.error("Error al retirarse:", err));
  }

  // ============================
  // 6) DOCENTE
  // ============================
  function mostrarCursosDocente(div, cursos) {
    if (!div) return;

    if (!cursos?.length) {
      div.innerHTML = "<p>No estás dictando ningún curso actualmente.</p>";
      return;
    }

    cursos.forEach(curso => {
      const card = document.createElement("div");
      card.classList.add("curso-rectangulo");
      card.innerHTML = `
        <h3>${curso.nombre_curso}</h3>
        <p>Estado: ${curso.estado}</p>
      `;

      const btn = document.createElement("button");
      btn.textContent = "Ver alumnos inscritos";
      btn.className = "small-button";
      btn.addEventListener("click", () =>
        cargarAlumnosCurso(curso.id_curso, curso.nombre_curso)
      );

      card.appendChild(btn);
      div.appendChild(card);
    });
  }

  function cargarAlumnosCurso(idCurso, nombreCurso) {
    fetch(`../processes/obtenerAlumnosCurso.php?id_curso=${idCurso}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          alert(data.error);
          return;
        }

        let contenido = data.alumnos.length
          ? `<ul class="lista-alumnos">${data.alumnos
              .map(a => `<li>👤 ${a.nombre_usuario} <span>(${a.correo})</span></li>`)
              .join("")}</ul>`
          : "<p>No hay alumnos inscritos.</p>";

        abrirModal(`Alumnos de ${nombreCurso}`, contenido);
      });
  }

  // ============================
  // 7) SISTEMA DE MODALES
  // ============================
  if (!document.getElementById("modal-overlay")) crearModalBase();

  function crearModalBase() {
    const overlay = document.createElement("div");
    overlay.id = "modal-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "9999"
    });

    const modal = document.createElement("div");
    modal.id = "modal-content";
    Object.assign(modal.style, {
      backgroundColor: "white",
      borderRadius: "10px",
      padding: "20px",
      width: "60%",
      maxHeight: "80vh",
      overflowY: "auto",
      position: "relative",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function abrirModal(titulo, contenidoHTML) {
    const overlay = document.getElementById("modal-overlay");
    const modal = document.getElementById("modal-content");

    modal.innerHTML = `
      <button id="close-modal"
        style="position:absolute; top:10px; right:15px; background:none; border:none; font-size:20px; cursor:pointer;">
        ✖
      </button>

      <h2 style="margin-top:30px; color:#0a0a5c; font-weight:700; text-align:center;">
        ${titulo}
      </h2>

      <div>${contenidoHTML}</div>
    `;

    overlay.style.display = "flex";

    document.getElementById("close-modal").onclick = cerrarModal;
  }

  function cerrarModal() {
    document.getElementById("modal-overlay").style.display = "none";
  }

  // ============================
  // 8) CARGAR CURSOS AL INICIAR
  // ============================
  cargarCursos();
}
