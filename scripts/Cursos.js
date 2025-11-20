// C:\xampp\htdocs\proyectoTBD\scripts\Cursos.js

export function iniciar({ idRolUsuario, nombreUsuario }) {

  console.log("📘 CARGANDO MÓDULO CURSOS");

  const contenidoCentral = document.getElementById("contenido-central");
  if (!contenidoCentral) return;

  // ----------- ENVOLTURA CON SCROLL (SOLUCIÓN PRINCIPAL) ------------
  contenidoCentral.innerHTML = `
    <div id="wrapper-cursos"
         style="width:100%; height:100%; overflow-y:auto; padding:20px; box-sizing:border-box;">
      
      <h2 class="cursos-titulo" style="text-align:center; margin-bottom:20px;">
        Cursos
      </h2>

      <div id="cursos-contenedor" style="width:100%; display:flex; flex-direction:column; gap:25px;">
        
        <div class="bloque-cursos">
          <h3 class="cursos-titulo">Cursos Activos</h3>
          <div id="cursos-inscritos" 
               style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;"></div>
        </div>

        <div class="bloque-cursos">
          <h3 class="cursos-titulo">Cursos Disponibles</h3>
          <div id="cursos-disponibles" 
               style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;"></div>
        </div>

      </div>
    </div>
  `;

  // Lanzamos carga de cursos
  cargarCursos();

  // ================================
  //      FUNCIONES
  // ================================

  function cargarCursos() {
    fetch(`../processes/cargarHome.php?id_rol_usuario=${idRolUsuario}`)
      .then(r => r.json())
      .then(data => {

        const divIns = document.getElementById("cursos-inscritos");
        const divDisp = document.getElementById("cursos-disponibles");

        divIns.innerHTML = "";
        divDisp.innerHTML = "";

        if (!data.success) {
          divIns.innerHTML = "<p>Error al cargar cursos.</p>";
          divDisp.innerHTML = "<p>Error al cargar cursos.</p>";
          return;
        }

        const rol = data.rol;

        if (rol === "ESTUDIANTE") {
          mostrarCursos(divIns, data.cursos_inscritos, "inscrito");
          mostrarCursos(divDisp, data.cursos_disponibles, "disponible");

        } else if (rol === "DOCENTE") {
          document.querySelectorAll(".bloque-cursos")[1].style.display = "none";
          mostrarCursosDocente(divIns, data.cursos);
        }

      })
      .catch(err => console.error(err));
  }

  function mostrarCursos(div, lista, tipo) {
    if (!lista || lista.length === 0) {
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
    card.className = "curso-rectangulo";
    card.innerHTML = `
      <h3>${curso.nombre_curso}</h3>
      ${curso.descripcion ? `<p>${curso.descripcion}</p>` : ""}
    `;

    const btn = document.createElement("button");
    btn.className = "small-button";

    if (tipo === "disponible") {
      btn.textContent = "Inscribirse";
      btn.onclick = () => inscribirseCurso(curso.id_curso);
    } else {
      btn.textContent = "Retirarse";
      btn.onclick = () => retirarseCurso(curso.id_curso);
    }

    card.appendChild(btn);
    return card;
  }

  function mostrarCursosDocente(div, lista) {
    if (!lista || lista.length === 0) {
      div.innerHTML = "<p>No estás dictando cursos.</p>";
      return;
    }

    lista.forEach(curso => {
      const card = document.createElement("div");
      card.className = "curso-rectangulo";
      card.innerHTML = `
        <h3>${curso.nombre_curso}</h3>
        <p>Estado: ${curso.estado}</p>
      `;

      const btn = document.createElement("button");
      btn.className = "small-button";
      btn.textContent = "Ver alumnos";
      btn.onclick = () => cargarAlumnosCurso(curso.id_curso, curso.nombre_curso);

      card.appendChild(btn);
      div.appendChild(card);
    });
  }

  // ======================================
  //        FUNCIONES DE ACCIÓN
  // ======================================

  function inscribirseCurso(idCurso) {
    const fd = new FormData();
    fd.append("id_curso", idCurso);
    fd.append("id_rol_usuario", idRolUsuario);

    fetch("../processes/inscribirseCurso.php", { method: "POST", body: fd })
      .then(r => r.json())
      .then(d => {
        alert(d.success ? "Inscripción exitosa" : d.error);
        if (d.success) cargarCursos();
      });
  }

  function retirarseCurso() {
    alert("Te retiraste del curso (visual).");
    cargarCursos();
  }
}
