// C:\xampp\htdocs\proyectoTBD\scripts\Cursos.js
export function iniciar({ idRolUsuario, nombreUsuario }) {
  // Referencias generales
  const mainBox = document.getElementById("main-box");           
  const contenidoCentral = document.getElementById("contenido-central"); 
  const btnVolver = document.getElementById("btn-volver");

  if (!mainBox || !contenidoCentral) {
    console.error("No se encontró #main-box o #contenido-central en el DOM.");
    return;
  }

  // === 1) Preparar la estructura interna dentro de #contenido-central ===
  contenidoCentral.innerHTML = `
    <div class="bienvenida-container cursos-vista">
      <div style="width:100%; text-align:left; margin-bottom:10px;">
        <h2 class="cursos-titulo">Cursos</h2>
      </div>

      <div id="cursos-contenedor" style="width:100%; display:flex; gap:20px; flex-direction:column;">
        <div id="cursos-inscritos-container" class="main-box cursos" style="display:flex; flex-direction:column;">
          <h3 class="cursos-titulo">Cursos Activos</h3>
          <div id="cursos-inscritos" class="cursos-scroll" style="padding:10px 0;"></div>
        </div>

        <div id="cursos-disponibles-container" class="main-box cursos" style="display:flex; flex-direction:column;">
          <h3 class="cursos-titulo">Cursos Disponibles</h3>
          <div id="cursos-disponibles" class="cursos-scroll" style="padding:10px 0;"></div>
        </div>
      </div>
    </div>
  `;

  // Mostrar botón volver
  if (btnVolver) btnVolver.style.display = "block";

  // Referencias internas creadas dinámicamente
  const contenedorInscritos = document.getElementById("cursos-inscritos-container");
  const contenedorDisponibles = document.getElementById("cursos-disponibles-container");
  const divInscritos = document.getElementById("cursos-inscritos");
  const divDisponibles = document.getElementById("cursos-disponibles");

  // Botón volver: limpiar y volver a bienvenida original
  if (btnVolver) {
    btnVolver.onclick = () => {
      // Restaurar contenido de bienvenida (puedes personalizar el HTML)
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

  // === 2) Funciones (idénticas a las tuyas pero usando las referencias nuevas) ===

  function cargarCursos() {
    fetch(`../processes/cargarHome.php?id_rol_usuario=${idRolUsuario}`)
      .then(res => res.json())
      .then(data => {
        // limpiar listas
        if (divInscritos) divInscritos.innerHTML = "";
        if (divDisponibles) divDisponibles.innerHTML = "";

        if (!data.success) {
          alert(data.error || "Error al cargar los cursos.");
          return;
        }

        const rol = data.rol || "";

        if (rol === "ESTUDIANTE") {
          // Títulos (ya están en el HTML, pero los dejamos por si quieres actualizar)
          const tituloIns = document.querySelector("#cursos-inscritos-container .cursos-titulo");
          const tituloDisp = document.querySelector("#cursos-disponibles-container .cursos-titulo");
          if (tituloIns) tituloIns.textContent = "Cursos Activos";
          if (tituloDisp) tituloDisp.textContent = "Cursos Disponibles";

          mostrarCursos(divInscritos, data.cursos_inscritos, "inscrito");
          mostrarCursos(divDisponibles, data.cursos_disponibles, "disponible");
        } else if (rol === "DOCENTE") {
          const tituloIns = document.querySelector("#cursos-inscritos-container .cursos-titulo");
          if (tituloIns) tituloIns.textContent = "Cursos que Dictas";
          if (contenedorDisponibles) contenedorDisponibles.style.display = "none";
          mostrarCursosDocente(divInscritos, data.cursos);
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

  function crearCursoCard(curso, tipo) {
    const card = document.createElement("div");
    card.classList.add("curso-rectangulo");
    card.innerHTML = `<h3>${curso.nombre_curso || "Curso sin nombre"}</h3>
                      ${curso.descripcion ? `<p>${curso.descripcion}</p>` : ""}`;

    const btn = document.createElement("button");
    btn.className = "small-button";

    if (tipo === "disponible") {
      btn.textContent = "Inscribirse";
      btn.addEventListener("click", () => inscribirseCurso(curso.id_curso));
    } else if (tipo === "inscrito") {
      btn.textContent = "Retirarse";
      btn.classList.add("danger");
      btn.addEventListener("click", () => retirarseCurso(curso.id_curso));
    }

    card.appendChild(btn);
    return card;
  }

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
      btn.addEventListener("click", () => cargarAlumnosCurso(curso.id_curso, curso.nombre_curso));

      card.appendChild(btn);
      div.appendChild(card);
    });
  }

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

  function retirarseCurso(idCurso) {
    if (!confirm("¿Seguro que deseas retirarte de este curso?")) return;
    alert("Te has retirado del curso (solo visualmente).");
    cargarCursos();
  }

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
            ${data.alumnos.map(a => `<li>👤 ${a.nombre_usuario} <span>(${a.correo})</span></li>`).join("")}
          </ul>`;
        }

        abrirModal(`Alumnos de ${nombreCurso}`, contenido);
      })
      .catch(err => console.error("Error al cargar alumnos:", err));
  }

  // === Modal (si no existe lo creamos) ===
  if (!document.getElementById("modal-overlay")) crearModalBase();

  function crearModalBase() {
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "modal-overlay";
    Object.assign(modalOverlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "9999"
    });

    const modalContent = document.createElement("div");
    modalContent.id = "modal-content";
    Object.assign(modalContent.style, {
      backgroundColor: "white",
      borderRadius: "10px",
      padding: "20px",
      width: "60%",
      maxHeight: "80vh",
      overflowY: "auto",
      position: "relative",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
    });

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
  }

  function abrirModal(titulo, contenidoHTML) {
    const overlay = document.getElementById("modal-overlay");
    const content = document.getElementById("modal-content");

    content.innerHTML = `
      <button id="close-modal" style="
        position:absolute; top:10px; right:15px;
        background:none; border:none; font-size:20px; cursor:pointer;
      ">✖</button>
      <h2 style="margin-top:30px; color:#0a0a5c; font-weight:700; text-align:center;">
        ${titulo}
      </h2>
      <div>${contenidoHTML}</div>
    `;

    overlay.style.display = "flex";
    document.getElementById("close-modal").addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  // === 3) Lanzar la carga inicial de cursos ===
  cargarCursos();
}