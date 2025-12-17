// scripts/AdministrarAlumnos.js
export async function mostrarContenido() {
    const contenedor = document.getElementById("contenido-dinamico");
    if (!contenedor) return;

    contenedor.innerHTML = `
    <h2>Administrar Alumnos</h2>

    <div style="max-height: 500px; overflow-y: auto; padding-right: 10px;">
        <form id="form-alumno">
            <input type="hidden" id="id_usuario">

            <label>Nombres</label>
            <input type="text" id="nombres" required>

            <label>Apellidos</label>
            <input type="text" id="apellidos" required>

            <label>Fecha de nacimiento</label>
            <input type="date" id="fecha_nacimiento">

            <label>CI</label>
            <input type="text" id="ci">

            <label>Teléfono</label>
            <input type="text" id="telefono">

            <label>Correo</label>
            <input type="email" id="correo">

            <label>Estado</label>
            <select id="estado">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
            </select>

            <label>Correo institucional</label>
            <input type="email" id="correo_institucional">

            <label>Contraseña</label>
            <input type="text" id="contrasenia">

            <button type="submit">Guardar</button>
            <button type="button" id="cancelar">Cancelar</button>
        </form>

        <hr>

        <table width="100%" border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>CI</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Correo Login</th>
                    <th>Contraseña Login</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-alumnos"></tbody>
        </table>
    </div>
`;


    cargarAlumnos();

    document.getElementById("form-alumno").addEventListener("submit", guardarAlumno);
    document.getElementById("cancelar").addEventListener("click", limpiarFormulario);
}

async function cargarAlumnos() {
    try {
        const res = await fetch("../processes/listarAlumnos.php");
        const alumnos = await res.json();

        const tabla = document.getElementById("tabla-alumnos");
        tabla.innerHTML = "";

        alumnos.forEach(alumno => {
            tabla.innerHTML += `
                <tr>
                    <td>${alumno.id_usuario}</td>
                    <td>${alumno.nombres}</td>
                    <td>${alumno.apellidos}</td>
                    <td>${alumno.ci}</td>
                    <td>${alumno.telefono}</td>
                    <td>${alumno.correo}</td>
                    <td>${alumno.estado}</td>
                    <td>${alumno.correo_institucional || ''}</td>
                    <td>${alumno.contrasenia || ''}</td>
                    <td>
                        <button onclick='editarAlumno(${JSON.stringify(alumno)})'>Editar</button>
                        <button onclick='eliminarAlumno(${alumno.id_usuario})'>Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar alumnos:", error);
    }
}

window.editarAlumno = (alumno) => {
    document.getElementById("id_usuario").value = alumno.id_usuario;
    document.getElementById("nombres").value = alumno.nombres;
    document.getElementById("apellidos").value = alumno.apellidos;
    document.getElementById("fecha_nacimiento").value = alumno.fecha_nacimiento;
    document.getElementById("ci").value = alumno.ci;
    document.getElementById("telefono").value = alumno.telefono;
    document.getElementById("correo").value = alumno.correo;
    document.getElementById("estado").value = alumno.estado;
    document.getElementById("correo_institucional").value = alumno.correo_institucional || '';
    document.getElementById("contrasenia").value = alumno.contrasenia || '';
};

window.eliminarAlumno = async (id) => {
    if (!confirm("¿Eliminar alumno?")) return;

    await fetch("../processes/eliminarAlumno.php", {
        method: "POST",
        body: new URLSearchParams({ id_usuario: id })
    });

    cargarAlumnos();
};

async function guardarAlumno(e) {
    e.preventDefault();

    const id = document.getElementById("id_usuario").value;
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const ci = document.getElementById("ci").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const estado = document.getElementById("estado").value;
    const correo_institucional = document.getElementById("correo_institucional").value;
    const contrasenia = document.getElementById("contrasenia").value;

    const url = id
        ? "../processes/editarAlumno.php"
        : "../processes/crearAlumno.php";

    await fetch(url, {
        method: "POST",
        body: new URLSearchParams({
            id_usuario: id,
            nombres,
            apellidos,
            fecha_nacimiento,
            ci,
            telefono,
            correo,
            estado,
            correo_institucional,
            contrasenia
        })
    });

    limpiarFormulario();
    cargarAlumnos();
}

function limpiarFormulario() {
    document.getElementById("id_usuario").value = "";
    document.getElementById("form-alumno").reset();
}
