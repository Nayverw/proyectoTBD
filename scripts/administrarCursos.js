export const administrarCursos = {
    iniciar: async () => {

        // Contenedor principal donde se carga todo
        const content = document.getElementById("main-box");

        if (!content) {
            console.error("No se encontr� el div #main-box");
            return;
        }

        content.innerHTML = "<h2>Cargando cursos...</h2>";

        try {
            // --- Obtener lista de cursos ---
            const respuesta = await fetch("../processes/admin_cursos_listar.php");
            const cursos = await respuesta.json();

            // --- Generar tabla de cursos ---
            let html = `
                <h2>Administrar Cursos</h2>
                <table border="1" cellspacing="0" cellpadding="8">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Curso Extra</th>
                        <th>Acci�n</th>
                    </tr>
            `;

            cursos.forEach(curso => {
                html += `
                    <tr>
                        <td>${curso.id_tipo_curso}</td>
                        <td>${curso.nombre_curso}</td>
                        <td>${curso.curso_extra}</td>
                        <td><button class="btn-eliminar" data-id="${curso.id_tipo_curso}">Eliminar</button></td>
                    </tr>
                `;
            });

            html += `
                </table>
                <br>
                <button id="btn-agregar-curso">Agregar Curso</button>
            `;

            content.innerHTML = html;

            // --- ELIMINAR CURSO ---
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const id = btn.dataset.id;
                    if (!confirm("�Seguro que deseas eliminar este curso?")) return;

                    const formData = new FormData();
                    formData.append("id_tipo_curso", id);

                    try {
                        const r = await fetch("../processes/admin_cursos_eliminar.php", {
                            method: "POST",
                            body: formData
                        });

                        const texto = await r.text();
                        alert(texto);

                        // Recargar lista de cursos
                        administrarCursos.iniciar();
                    } catch (err) {
                        console.error("Error al eliminar curso:", err);
                        alert("Error al eliminar curso.");
                    }
                });
            });

            // --- AGREGAR CURSO ---
            content.addEventListener("click", async (e) => {
                if (e.target && e.target.id === "btn-agregar-curso") {
                    try {
                        // Formulario simple sin docentes
                        const formulario = `
                            <h3>Agregar Curso</h3>
                            <form id="form-agregar-curso">
                                <label>Nombre del Curso:</label><br>
                                <input type="text" id="nombre_curso" required><br><br>

                                <label>�Tiene curso extra?</label><br>
                                <select id="curso_extra">
                                    <option value="si">S�</option>
                                    <option value="no">No</option>
                                </select><br><br>

                                <button type="submit">Guardar Curso</button>
                                <button type="button" id="btn-cancelar-curso">Cancelar</button>
                            </form>
                        `;

                        content.innerHTML = formulario;

                        // --- Guardar nuevo curso ---
                        document.getElementById("form-agregar-curso").addEventListener("submit", async (ev) => {
                            ev.preventDefault();

                            const formData = new FormData();
                            formData.append("nombre_curso", document.getElementById("nombre_curso").value);
                            formData.append("curso_extra", document.getElementById("curso_extra").value);

                            try {
                                const response = await fetch("../processes/admin_cursos_agregar.php", {
                                    method: "POST",
                                    body: formData
                                });

                                const result = await response.text();
                                alert(result);

                                // Volver a la lista de cursos
                                administrarCursos.iniciar();
                            } catch (err) {
                                console.error("Error al guardar el curso:", err);
                                alert("Error al guardar el curso.");
                            }
                        });

                        // --- Bot�n cancelar ---
                        document.getElementById("btn-cancelar-curso").addEventListener("click", () => {
                            administrarCursos.iniciar();
                        });

                    } catch (err) {
                        console.error("Error al cargar formulario de agregar curso:", err);
                        content.innerHTML = "<p>Error al cargar formulario.</p>";
                    }
                }
            });

        } catch (err) {
            content.innerHTML = "<h3>Error cargando cursos.</h3>";
            console.error(err);
        }
    }
};
