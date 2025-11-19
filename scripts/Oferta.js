export function mostrarContenido({ idRolUsuario, nombreUsuario }) {

    const cont = document.getElementById("contenido-central");

    cont.innerHTML = `
        <div style="width:100%; display:flex; justify-content:center;">
            <div class="main-box" style="width:90%; height:100%; overflow:hidden;">
                <h3 class="cursos-titulo">Cursos Disponibles</h3>

                <div id="oferta-lista" class="cursos-scroll"></div>
            </div>
        </div>

        <!-- Modal (se añade si no existe) -->
        <div id="modal-curso" class="modal">
            <div class="modal-content">
                <span id="cerrar-modal" class="close-modal">&times;</span>
                <h2 id="modal-titulo"></h2>
                <p><strong>Docente:</strong> <span id="modal-docente"></span></p>
                <p><strong>Modalidad:</strong> <span id="modal-modalidad"></span></p>
                <p><strong>Descripción:</strong></p>
                <p id="modal-descripcion"></p>

                <button id="btn-inscribir-modal" class="small-button">
                    Inscribirme
                </button>
            </div>
        </div>
    `;

    const lista = document.getElementById("oferta-lista");
    const modal = document.getElementById("modal-curso");
    const cerrarModal = document.getElementById("cerrar-modal");

    cerrarModal.onclick = () => (modal.style.display = "none");
    window.onclick = e => {
        if (e.target === modal) modal.style.display = "none";
    };

    fetch(`../processes/cargarHome.php?id_rol_usuario=${idRolUsuario}`)
        .then(r => r.json())
        .then(data => {

            if (!data.success) {
                lista.innerHTML = "<p>No fue posible cargar los cursos disponibles.</p>";
                return;
            }

            const disponibles = data.cursos_disponibles;

            if (!disponibles.length) {
                lista.innerHTML = "<p>No hay cursos disponibles para inscribirte.</p>";
                return;
            }

            disponibles.forEach(curso => {

                const card = document.createElement("div");
                card.classList.add("curso-rectangulo");

                card.innerHTML = `
                    <h3>${curso.nombre_curso}</h3>
                    <p>Modalidad: ${curso.modalidad ?? "Sin dato"}</p>

                    <button class="small-button btn-info">Más información</button>
                    <button class="small-button btn-inscribir">Inscribirse</button>
                `;

                // Botón información
                card.querySelector(".btn-info").onclick = () => {
                    document.getElementById("modal-titulo").textContent = curso.nombre_curso;
                    document.getElementById("modal-docente").textContent = curso.docente ?? "No asignado";
                    document.getElementById("modal-modalidad").textContent = curso.modalidad ?? "Sin dato";
                    document.getElementById("modal-descripcion").textContent = curso.descripcion ?? "Sin descripción.";

                    // Guardar ID temporal para inscribir dentro del modal
                    document.getElementById("btn-inscribir-modal").onclick = () => {
                        inscribirse(curso.id_curso);
                    };

                    modal.style.display = "flex";
                };

                // Botón inscribir directo
                card.querySelector(".btn-inscribir").onclick = () => inscribirse(curso.id_curso);

                lista.appendChild(card);
            });

        });

    function inscribirse(idCurso) {
        const fd = new FormData();
        fd.append("id_curso", idCurso);
        fd.append("id_rol_usuario", idRolUsuario);

        fetch("../processes/inscribirseCurso.php", {
            method: "POST",
            body: fd
        })
            .then(r => r.json())
            .then(data => {
                alert(data.success ? "Inscripción exitosa" : data.error);
                mostrarContenido({ idRolUsuario, nombreUsuario });
            });
    }
}
