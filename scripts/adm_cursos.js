// scripts/adm_cursos.js
export async function mostrarContenido() {

    const contenedor = document.getElementById("contenido-dinamico"); // 👈 revisa este ID

    if (!contenedor) {
        console.error("No se encontró el contenedor principal");
        return;
    }

    contenedor.innerHTML = `
        <h2>Administrar Cursos</h2>

        <form id="form-curso">
            <input type="hidden" id="id_tipo_curso">

            <label>Nombre del curso</label>
            <input type="text" id="nombre_curso" required>

            <label>¿Curso extra?</label>
            <select id="curso_extra">
                <option value="0">No</option>
                <option value="1">Sí</option>
            </select>

            <button type="submit">Guardar</button>
            <button type="button" id="cancelar">Cancelar</button>
        </form>

        <hr>

        <table width="100%" border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Curso</th>
                    <th>Extra</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-cursos"></tbody>
        </table>
    `;

    cargarCursos();

    document.getElementById("form-curso").addEventListener("submit", guardarCurso);
    document.getElementById("cancelar").addEventListener("click", limpiarFormulario);
}

async function cargarCursos() {
    const res = await fetch("../processes/listarCursos.php");
    const cursos = await res.json();

    const tabla = document.getElementById("tabla-cursos");
    tabla.innerHTML = "";

    cursos.forEach(curso => {
        tabla.innerHTML += `
            <tr>
                <td>${curso.id_tipo_curso}</td>
                <td>${curso.nombre_curso}</td>
                <td>${curso.curso_extra == 1 ? "Sí" : "No"}</td>
                <td>
                    <button onclick='editarCurso(${JSON.stringify(curso)})'>Editar</button>
                    <button onclick='eliminarCurso(${curso.id_tipo_curso})'>Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.editarCurso = (curso) => {
    document.getElementById("id_tipo_curso").value = curso.id_tipo_curso;
    document.getElementById("nombre_curso").value = curso.nombre_curso;
    document.getElementById("curso_extra").value = curso.curso_extra;
};

window.eliminarCurso = async (id) => {
    if (!confirm("¿Eliminar curso?")) return;

    await fetch("../processes/eliminarCurso.php", {
        method: "POST",
        body: new URLSearchParams({ id_tipo_curso: id })
    });

    cargarCursos();
};

async function guardarCurso(e) {
    e.preventDefault();

    const id = document.getElementById("id_tipo_curso").value;
    const nombre = document.getElementById("nombre_curso").value;
    const extra = document.getElementById("curso_extra").value;

    const url = id
        ? "../processes/editarCurso.php"
        : "../processes/crearCurso.php";

    await fetch(url, {
        method: "POST",
        body: new URLSearchParams({
            id_tipo_curso: id,
            nombre_curso: nombre,
            curso_extra: extra
        })
    });

    limpiarFormulario();
    cargarCursos();
}

function limpiarFormulario() {
    document.getElementById("id_tipo_curso").value = "";
    document.getElementById("form-curso").reset();
}
