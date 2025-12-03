export function iniciar({ idRolUsuario, nombreUsuario }) {

    const mainBox = document.getElementById("main-box");
    const contenidoCentral = document.getElementById("contenido-central") || mainBox;
    const btnVolver = document.getElementById("btn-volver");

    if (!mainBox || !contenidoCentral) return;

    if (btnVolver) {
        btnVolver.style.display = "block";
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

    // ------------------------
    // MODAL
    // ------------------------
    function abrirModal(titulo, contenidoHTML) {
        let modal = document.getElementById("modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modal";
            modal.style = `
                display:none;
                position:fixed;
                top:0; left:0;
                width:100%; height:100%;
                background:rgba(0,0,0,0.5);
                justify-content:center;
                align-items:center;
                z-index:1000;
            `;
            modal.innerHTML = `
                <div id="modal-content" style="
                    background:white;
                    padding:20px;
                    border-radius:8px;
                    max-width:600px;
                    width:90%;
                    position:relative;
                    max-height:90%;
                    overflow-y:auto;
                ">
                    <span id="modal-close" style="position:absolute; top:10px; right:15px; cursor:pointer; font-weight:bold;">&times;</span>
                    <div id="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById("modal-close").onclick = cerrarModal;
            window.onclick = function(e) {
                if (e.target === modal) cerrarModal();
            };
        }
        document.getElementById("modal-body").innerHTML = `<h3>${titulo}</h3>${contenidoHTML}`;
        modal.style.display = "flex";
    }

    function cerrarModal() {
        const modal = document.getElementById("modal");
        if (modal) modal.style.display = "none";
    }

    // ------------------------
    // CARGAR CURSOS
    // ------------------------
    function cargarCursos() {
        fetch(`../processes/cargarHome.php?id_rol_usuario=${idRolUsuario}`)
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    contenidoCentral.innerHTML = `<p>Error: ${data.error}</p>`;
                    return;
                }

                const rol = data.rol || "";

                contenidoCentral.innerHTML = `
                    <div style="display:flex; flex-direction:column; height:100%;">
                        <h2 class="cursos-titulo" style="
                            position:sticky; 
                            top:0; 
                            background:white; 
                            padding:12px 0; 
                            text-align:center; 
                            z-index:10;
                            border-bottom:1px solid #ccc;
                        ">Mis cursos</h2>
                        <div id="cursos-container" style="
                            display:grid;
                            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                            gap:20px;
                            padding:10px;
                            overflow-y:auto;
                            flex:1;
                        "></div>
                    </div>
                `;

                const cont = document.getElementById("cursos-container");

                if (rol === "ESTUDIANTE") {
                    mostrarCursosEstudiante(cont, data.cursos_inscritos || []);
                } else if (rol === "DOCENTE") {
                    cargarCursosDocente(idRolUsuario);
                }
            })
            .catch(err => console.error("Error al cargar cursos:", err));
    }

    // ------------------------
    // ESTUDIANTE
    // ------------------------
    function mostrarCursosEstudiante(cont, lista) {
        cont.innerHTML = "";
        if(!lista.length){
            cont.innerHTML = "<p>No estás inscrito en ningún curso.</p>";
            return;       
        }

        lista.forEach(curso => cont.appendChild(crearCardEstudiante(curso)));
    }

    function crearCardEstudiante(curso) {
        const card = document.createElement("div");
        card.className = "curso-rectangulo";
        card.style.background = "#99ccff"; // azul
        card.style.padding = "12px";
        card.style.borderRadius = "8px";
        card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        card.innerHTML = `
            <h3>${curso.nombre_curso}</h3>
            <p><strong>Estado:</strong> ${curso.estado || "ACTIVO"}</p>
            <div style="display:flex; gap:8px; margin-top:12px;">
                <button class="small-button btn-ver">Ver curso</button>
                <button class="small-button danger btn-retirarse">Retirarse</button>
            </div>
        `;

        // Corregido: pasar id_curso y nombre_curso
        card.querySelector(".btn-ver").onclick = () => mostrarCursoEstudianteConModulos(curso.id_curso, curso.nombre_curso);

        card.querySelector(".btn-retirarse").onclick = () => {
            retirarseCurso(curso.id_curso, idRolUsuario);
        };

        return card;
    }

    function mostrarCursoEstudianteConModulos(idCurso, nombreCurso) {

        abrirModal(`Módulos del curso: ${nombreCurso}`, `
            <div id="lista-modulos" style="display:flex; flex-direction:column; gap:10px;"></div>
            <div id="form-crear-modulo-container"></div>
        `);

        const listaModulos = document.getElementById("lista-modulos");
        

        // Función interna para cargar módulos
        function cargarModulos() {
            fetch(`../processes/obtenerModulos.php?id_curso=${idCurso}`)
                .then(r => r.json())
                .then(data => {
                    if (!data.success) return listaModulos.innerHTML = `<p>${data.error}</p>`;
                    if (!data.modulos.length) return listaModulos.innerHTML = `<p>No hay módulos creados.</p>`;
         
                    listaModulos.innerHTML = data.modulos.map(m => `
                        <div style="border:1px solid #ccc; padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; background:#f9f9f9;">
                            <div>
                                <h4>${m.nombre} (${m.valor_puntos} pts)</h4>
                                <div style="background:#eee; border-radius:6px; overflow:hidden; width:200px; height:12px; margin-top:4px;">
                                    <div id="progress-${m.id_modulo}" style="background:#4caf50; height:100%; width:0%;"></div>
                                </div>
                            </div>
                            <div style="display:flex; gap:6px;">
                                 <button class="small-button btn-ver-examenes" data-id="${m.id_modulo}">Ver exámenes</button>
                            </div>
                        </div>
                    `).join("");
                    
                    // --- Cargar progreso por módulo ---
                data.modulos.forEach(m => {
                    fetch(`../processes/obtenerProgresoModulo.php?id_modulo=${m.id_modulo}&id_usuario=${idRolUsuario}`)
                        .then(r => r.json())
                        .then(res => {
                            const prog = res.success && res.progreso != null ? res.progreso : 0;
                            const barra = document.getElementById(`progress-${m.id_modulo}`);
                            if (barra) barra.style.width = `${prog}%`;
                        });
                });

                // --- Ver exámenes ---
                document.querySelectorAll(".btn-ver-examenes").forEach(btn => {
                    btn.onclick = () => {
                        abrirModal("Exámenes del módulo", `<div id="lista-examenes">Cargando...</div>`);
                        fetch(`../processes/obtenerExamenes.php?id_modulo=${btn.dataset.id}`)
                            .then(r=>r.json())
                            .then(res=>{
                                const lista = document.getElementById("lista-examenes");
                                if(!res.success) return lista.innerHTML = `<p>${res.error}</p>`;
                                if(!res.examenes.length) return lista.innerHTML = `<p>No hay exámenes.</p>`;
                                lista.innerHTML = res.examenes.map(e => `<p>${e.nombre_examen}</p>`).join("");
                            })
                            .catch(err => document.getElementById("lista-examenes").innerHTML = `<p>Error: ${err}</p>`);
                    };
                });

            })
            .catch(err => listaModulos.innerHTML = `<p>Error al cargar módulos: ${err}</p>`);
        }

       

        // Inicializa la carga de módulos
        cargarModulos();
    }

    function inscribirseCurso(idCurso) {
        const fd = new FormData();
        fd.append("id_curso", idCurso);
        fd.append("id_rol_usuario", idRolUsuario);
        fetch("../processes/inscribirseCurso.php", { method: "POST", body: fd })
            .then(r => r.json())
            .then(d => { alert(d.success ? "Inscripción exitosa" : d.mensaje); cargarCursos(); });
    }

    function retirarseCurso(idCurso, idRolUsuario) {
        if (!confirm("¿Seguro que deseas retirarte?")) return;

        const fd = new FormData();
        fd.append("id_curso", idCurso);
        fd.append("id_rol_usuario", idRolUsuario);

        fetch("../processes/retirarseCurso.php", { method: "POST", body: fd })
        .then(r => r.json())
        .then(d => {
            alert(d.success ? "Te has retirado del curso" : d.error);
            cargarCursos();
        })
        .catch(err => console.error("Error al retirarse:", err));     
    }

    // ------------------------
    // DOCENTE
    // ------------------------
    function cargarCursosDocente(idDocente) {
        const cont = document.getElementById("cursos-container");
        if (!cont) return;

        cont.innerHTML = "";

        const btnAgregar = document.createElement("button");
        btnAgregar.textContent = "+ Añadir curso";
        btnAgregar.className = "small-button";
        btnAgregar.style.marginBottom = "12px";
        btnAgregar.onclick = mostrarFormularioCrearCurso;
        cont.appendChild(btnAgregar);

        fetch(`../processes/obtenerCursosDocentes.php?id_docente=${idDocente}`)
            .then(res => res.json())
            .then(data => {
                if (!data.success) { cont.innerHTML += `<p>Error: ${data.error}</p>`; return; }
                const lista = data.cursos || [];
                if (!lista.length) { cont.innerHTML += "<p>No estás dictando cursos.</p>"; return; }

                lista.forEach(curso => {
                    const card = document.createElement("div");
                    card.className = "curso-rectangulo";
                    card.style.background = "#99ccff"; // 
                    card.style.padding = "12px";
                    card.style.borderRadius = "8px";
                    card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                    card.innerHTML = `<h3>${curso.nombre_curso}</h3>
                        <p><strong>Estado:</strong> ${curso.estado}</p>
                        <p><strong>Duración:</strong> ${curso.duracion || 0} hrs</p>
                        <p><strong>Cupo:</strong> ${curso.cupo || 0}</p>
                    `;

                    const footer = document.createElement("div");
                    footer.style.display = "flex";
                    footer.style.gap = "6px";
                    footer.style.marginTop = "10px";

                    const btnVer = document.createElement("button");
                    btnVer.textContent = "Asistencia";
                    btnVer.className = "small-button";
                    btnVer.onclick = () => mostrarAlumnos(curso.id_curso, curso.nombre_curso);

                    const btnEditar = document.createElement("button");
                    btnEditar.textContent = "Editar";
                    btnEditar.className = "small-button";
                    btnEditar.onclick = () => mostrarFormularioEditarCurso(curso);

                    const btnEliminar = document.createElement("button");
                    btnEliminar.textContent = "Eliminar";
                    btnEliminar.className = "small-button danger";
                    btnEliminar.onclick = () => { if(confirm("¿Eliminar curso?")) eliminarCurso(curso.id_curso); };

                    const btnGestionModulos = document.createElement("button");
                    btnGestionModulos.textContent = "Gestionar módulos";
                    btnGestionModulos.className = "small-button";
                    btnGestionModulos.onclick = () => mostrarModuloCurso(curso.id_curso, curso.nombre_curso);

                    footer.append(btnVer, btnEditar, btnEliminar, btnGestionModulos);
                    card.appendChild(footer);
                    cont.appendChild(card);
                });
            })
            .catch(err => { cont.innerHTML += `<p>Error al cargar cursos: ${err}</p>`; console.error(err); });
    }
 function mostrarAlumnos(idCurso, nombreCurso) {
    fetch(`../processes/obtenerInscritos.php?id_curso=${idCurso}`)
        .then(r => r.json())
        .then(data => {
            if (!data.success) return alert(data.error);
            const alumnos = data.alumnos;
            
            if (!alumnos.length) {
                abrirModal(`Alumnos de ${nombreCurso}`, "<p>No hay alumnos inscritos.</p>");
                return;
            }

            // Construir lista con checkboxes
            const contenidoHTML = `
                <form id="form-asistencia">
                    <ul style="list-style:none; padding:0; max-height:300px; overflow-y:auto;">
                        ${alumnos.map(a => `
                            <li>
                                <label>
                                    <input type="checkbox" name="asistente" value="${a.id_rol_usuario}">
                                    ${a.nombres} ${a.apellidos} — ${a.correo} — progreso: ${a.progreso || 0}%
                                </label>
                            </li>
                        `).join("")}
                    </ul>
                    <button type="submit" class="small-button" style="margin-top:10px;">Registrar asistencia</button>
                </form>
            `;
            abrirModal(`Alumnos de ${nombreCurso}`, contenidoHTML);

            // Enviar asistencia
            const form = document.getElementById("form-asistencia");
            form.onsubmit = function(e) {
                e.preventDefault();
                const checkedBoxes = Array.from(form.querySelectorAll('input[name="asistente"]:checked'));
                const asistentes = checkedBoxes.map(cb => parseInt(cb.value));

                if (!asistentes.length) {
                    alert("No se seleccionó ningún alumno");
                    return;
                }

                const formData = new FormData();
                formData.append("id_curso", idCurso);
                formData.append("asistentes", JSON.stringify(asistentes));

                fetch("../processes/registrarAsistencia.php", { method: "POST", body: formData })
                    .then(res => res.json())
                    .then(res => {
                        if (res.success) {
                            alert( `Asistencia registrada`);
                            cerrarModal();
                        } else {
                            alert("Error al registrar asistencia: " + res.error);
                        }
                    })
                    .catch(err => alert("Error al conectar con el servidor: " + err));
            };
        })
        .catch(err => alert("Error al cargar alumnos: " + err));
 }

 





    // ------------------------
    // FORMULARIOS DOCENTE
    // ------------------------
    function mostrarFormularioCrearCurso() {
        abrirModal("Crear curso", `<p>Cargando...</p>`);
        Promise.all([
            fetch("../processes/obtenerHorarios.php").then(r => r.json()),
            fetch("../processes/obtenerAulas.php").then(r => r.json())
        ])
        .then(([horariosData, aulasData]) => {
            const horarios = horariosData.horarios || [];
            const aulas = aulasData.aulas || [];

            let optionsHorarios = horarios.map(h => `<option value="${h.id_horario}">${h.dia} - ${h.hora}</option>`).join("");
            let optionsAulas = aulas.map(a => `<option value="${a.id_aula}">${a.nombre} - ${a.ubicacion}</option>`).join("");

            abrirModal("Crear nuevo curso", `
                <form id="form-crear-curso" style="display:flex; flex-direction:column; gap:10px;">
                    <label>Nombre del curso:</label>
                    <input type="text" name="nombre_curso" required placeholder="Nombre del curso">
                    <label>Curso extra:</label>
                    <select name="curso_extra" required>
                        <option value="SI">SI</option>
                        <option value="NO" selected>NO</option>
                    </select>
                    <label>Precio/Puntos:</label>
                    <input type="number" step="0.01" name="preciopuntos" required>
                    <label>Duración (hrs):</label>
                    <input type="number" step="0.1" name="duracion" required>
                    <label>Cupo máximo:</label>
                    <input type="number" name="cupo" required>
                    <label>Estado:</label>
                    <select name="estado">
                        <option value="ACTIVO" selected>ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                    </select>
                    <label>Horario:</label>
                    <select name="id_horario" required>${optionsHorarios}</select>
                    <label>Aula:</label>
                    <select name="id_aula" required>${optionsAulas}</select>
                    <button type="submit" class="small-button" style="margin-top:10px;">Crear curso</button>
                </form>
            `);

            document.getElementById("form-crear-curso").onsubmit = function(e){
                e.preventDefault();
                const formData = new FormData(this);
                formData.append("id_docente", idRolUsuario);

                fetch("../processes/agregarCurso.php", { method:"POST", body:formData })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.success ? data.mensaje : data.mensaje);
                        if(data.success){
                            cerrarModal();
                            cargarCursos();
                        }
                    })
                    .catch(err => console.error(err));
            };
        })
        .catch(err => abrirModal("Error", `<p>No se pudo cargar aulas y horarios: ${err}</p>`));
    }

 function mostrarModuloCurso(idCurso, nombreCurso) {

    // Función para cargar módulos dentro del modal
    function cargarModulos() {
        const listaModulos = document.getElementById("lista-modulos");
        fetch(`../processes/obtenerModulos.php?id_curso=${idCurso}`)
            .then(r => r.json())
            .then(data => {
                if (!data.success) return listaModulos.innerHTML = `<p>${data.error}</p>`;
                if (!data.modulos.length) return listaModulos.innerHTML = `<p>No hay módulos creados.</p>`;

                // Renderizar módulos
                listaModulos.innerHTML = data.modulos.map(m => `
                    <div style="border:1px solid #ccc; padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; background:#f9f9f9;">
                        <div>
                            <h4>${m.nombre} (${m.valor_puntos} pts)</h4>
                            <div style="background:#eee; border-radius:6px; overflow:hidden; width:200px; height:12px; margin-top:4px;">
                                <div id="progress-${m.id_modulo}" style="background:#4caf50; height:100%; width:0%;"></div>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px; flex-wrap:wrap;">
                            <button class="small-button btn-crear-examen" data-id="${m.id_modulo}">Crear Examen</button>
                            <button class="small-button btn-editar-modulo" data-id="${m.id_modulo}" data-nombre="${m.nombre}" data-puntos="${m.valor_puntos}">Editar</button>
                            <button class="small-button danger btn-eliminar-modulo" data-id="${m.id_modulo}">Eliminar</button>
                            <button class="small-button btn-ver-examenes" data-id="${m.id_modulo}">Ver Exámenes</button>
                        </div>
                    </div>
                `).join("");

                // Cargar progreso por módulo
                data.modulos.forEach(m => {
                    fetch(`../processes/obtenerProgresoModulo.php?id_modulo=${m.id_modulo}&id_usuario=${idRolUsuario}`)
                        .then(r => r.json())
                        .then(res => {
                            const barra = document.getElementById(`progress-${m.id_modulo}`);
                            if (barra) barra.style.width = `${res.success && res.progreso != null ? res.progreso : 0}%`;
                        });
                });

                // --- Eventos de botones ---
                document.querySelectorAll(".btn-editar-modulo").forEach(btn => {
                    btn.onclick = () => {
                        abrirModal("Editar módulo", `
                            <form id="form-editar-modulo" style="display:flex; flex-direction:column; gap:10px;">
                                <label>Nombre:</label>
                                <input type="text" name="nombre_modulo" required value="${btn.dataset.nombre}">
                                <label>Puntos:</label>
                                <input type="number" name="valor_puntos" required value="${btn.dataset.puntos}">
                                <input type="hidden" name="id_modulo" value="${btn.dataset.id}">
                                <button type="submit" class="small-button">Guardar cambios</button>
                            </form>
                        `, () => mostrarModuloCurso(idCurso, nombreCurso));

                        document.getElementById("form-editar-modulo").onsubmit = e => {
                            e.preventDefault();
                            fetch("../processes/editarModulo.php", { method:"POST", body:new FormData(e.target)})
                                .then(r => r.json())
                                .then(res => {
                                    alert(res.success ? res.mensaje : res.error);
                                    mostrarModuloCurso(idCurso, nombreCurso);
                                });
                        };
                    };
                });

                document.querySelectorAll(".btn-eliminar-modulo").forEach(btn => {
                    btn.onclick = () => {
                        if (!confirm("¿Eliminar módulo?")) return;
                        const fd = new FormData();
                        fd.append("id_modulo", btn.dataset.id);
                        fetch("../processes/eliminarModulo.php", { method:"POST", body:fd })
                            .then(r => r.json())
                            .then(res => {
                                alert(res.success ? res.mensaje : res.error);
                                mostrarModuloCurso(idCurso, nombreCurso);
                            });
                    };
                });

                document.querySelectorAll(".btn-crear-examen").forEach(btn => {
                    btn.onclick = () => {
                        abrirModal("Crear examen", `
                            <form id="form-crear-examen" style="display:flex; flex-direction:column; gap:10px;">
                                <label>Nombre del examen:</label>
                                <input type="text" name="nombre_examen" required>
                                <input type="hidden" name="id_modulo" value="${btn.dataset.id}">
                                <button type="submit" class="small-button">Crear examen</button>
                            </form>
                        `, () => mostrarModuloCurso(idCurso, nombreCurso));

                        document.getElementById("form-crear-examen").onsubmit = e => {
                            e.preventDefault();
                            fetch("../processes/crearExamen.php", { method:"POST", body:new FormData(e.target)})
                                .then(r => r.json())
                                .then(res => {
                                    alert(res.success ? res.mensaje : res.error);
                                    mostrarModuloCurso(idCurso, nombreCurso);
                                });
                        };
                    };
                });

                document.querySelectorAll(".btn-ver-examenes").forEach(btn => {
                    btn.onclick = () => {
                        abrirModal("Exámenes del módulo", `<div id="lista-examenes">Cargando...</div>`, () => mostrarModuloCurso(idCurso, nombreCurso));
                        fetch(`../processes/obtenerExamenes.php?id_modulo=${btn.dataset.id}`)
                            .then(r => r.json())
                            .then(res => {
                                const lista = document.getElementById("lista-examenes");
                                if(!res.success) return lista.innerHTML = `<p>${res.error}</p>`;
                                lista.innerHTML = res.examenes.length
                                    ? res.examenes.map(e => `<p>${e.nombre_examen}</p>`).join("")
                                    : "<p>No hay exámenes.</p>";
                            });
                    };
                });

            })
            .catch(err => listaModulos.innerHTML = `<p>Error al cargar módulos: ${err}</p>`);
    }

    // --- Abrir modal principal de módulos ---
    abrirModal(`Módulos del curso: ${nombreCurso}`, `
        <button id="btn-crear-modulo" class="small-button" style="margin-bottom:10px;">Crear módulo</button>
        <div id="lista-modulos" style="display:flex; flex-direction:column; gap:10px;"></div>
    `);

    // --- Crear módulo ---
    document.getElementById("btn-crear-modulo").onclick = () => {
        abrirModal("Crear módulo", `
            <form id="form-crear-modulo" style="display:flex; flex-direction:column; gap:10px;">
                <label>Nombre módulo:</label>
                <input type="text" name="nombre_modulo" required>
                <label>Valor puntos:</label>
                <input type="number" name="valor_puntos" required>
                <input type="hidden" name="id_curso" value="${idCurso}">
                <button type="submit" class="small-button">Crear módulo</button>
            </form>
        `, () => mostrarModuloCurso(idCurso, nombreCurso));

        document.getElementById("form-crear-modulo").onsubmit = e => {
            e.preventDefault();
            fetch("../processes/agregarModulo.php", { method:"POST", body:new FormData(e.target)})
                .then(r => r.json())
                .then(res => {
                    alert(res.success ? "Módulo creado" : res.error);
                    mostrarModuloCurso(idCurso, nombreCurso);
                });
        };
    };

    // Carga inicial de módulos
    cargarModulos();
 }




    // Inicialización
    cargarCursos();
}
