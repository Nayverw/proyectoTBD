// scripts/AdministrarDocentes.js
export async function mostrarContenido() {
    const contenedor = document.getElementById("contenido-dinamico");
    if (!contenedor) return;

    contenedor.innerHTML = `
        <h2>Administrar Docentes</h2>

        <div style="max-height:500px; overflow-y:auto; padding-right:10px;">
            <form id="form-docente">
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
                <tbody id="tabla-docentes"></tbody>
            </table>
        </div>
    `;

    cargarDocentes();

    document.getElementById("form-docente").addEventListener("submit", guardarDocente);
    document.getElementById("cancelar").addEventListener("click", limpiarFormulario);
}

async function cargarDocentes() {
    try {
        const res = await fetch("../processes/listarDocentes.php");
        const docentes = await res.json();

        const tabla = document.getElementById("tabla-docentes");
        tabla.innerHTML = "";

        docentes.forEach(docente => {
            tabla.innerHTML += `
                <tr>
                    <td>${docente.id_usuario}</td>
                    <td>${docente.nombres}</td>
                    <td>${docente.apellidos}</td>
                    <td>${docente.ci}</td>
                    <td>${docente.telefono}</td>
                    <td>${docente.correo}</td>
                    <td>${docente.estado}</td>
                    <td>${docente.correo_institucional || ''}</td>
                    <td>${docente.contrasenia || ''}</td>
                    <td>
                        <button onclick='editarDocente(${JSON.stringify(docente)})'>Editar</button>
                        <button onclick='eliminarDocente(${docente.id_usuario})'>Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar docentes:", error);
    }
}

window.editarDocente = (docente) => {
    document.getElementById("id_usuario").value = docente.id_usuario;
    document.getElementById("nombres").value = docente.nombres;
    document.getElementById("apellidos").value = docente.apellidos;
    document.getElementById("fecha_nacimiento").value = docente.fecha_nacimiento;
    document.getElementById("ci").value = docente.ci;
    document.getElementById("telefono").value = docente.telefono;
    document.getElementById("correo").value = docente.correo;
    document.getElementById("estado").value = docente.estado;
    document.getElementById("correo_institucional").value = docente.correo_institucional || '';
    document.getElementById("contrasenia").value = docente.contrasenia || '';
};

window.eliminarDocente = async (id_usuario) => {
    if (!confirm("¿Eliminar docente y login?")) return;

    await fetch("../processes/eliminarDocente.php", {
        method: "POST",
        body: new URLSearchParams({ id_usuario })
    });

    cargarDocentes();
};

async function guardarDocente(e) {
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

    const url = id ? "../processes/editarDocente.php" : "../processes/crearDocente.php";

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
    cargarDocentes();
}

function limpiarFormulario() {
    document.getElementById("id_usuario").value = "";
    document.getElementById("form-docente").reset();
}
