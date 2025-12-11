// scripts/AdministrarRecompensas.js
export async function mostrarContenido({ idRolUsuario, nombreUsuario }) {
    const contenedor = document.getElementById("contenido-dinamico");
    contenedor.innerHTML = `
        <h2>Administrar Recompensas</h2>
        <button id="btn-agregar-recompensa">Agregar Nueva Recompensa</button>
        <table id="tabla-recompensas" border="1" style="width:100%; margin-top:10px;">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio Puntos</th>
                    <th>Descuento</th>
                    <th>Rol</th>
                    <th>Tipo Recompensa</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <div id="formulario-recompensa" style="display:none; margin-top:10px;">
            <h3 id="titulo-form">Agregar Recompensa</h3>
            <input type="hidden" id="id_recompensa_form">
            <input type="text" id="nombre_recompensa" placeholder="Nombre">
            <input type="number" id="precio_puntos" placeholder="Precio Puntos">
            <input type="text" id="descuento" placeholder="Descuento">
            <input type="text" id="rol" placeholder="Rol (Estudiante/Docente/TODOS)">
            <input type="number" id="id_tipo_recompensa" placeholder="ID Tipo Recompensa">
            <button id="btn-guardar-recompensa">Guardar</button>
            <button id="btn-cancelar-recompensa">Cancelar</button>
        </div>
    `;

    const tablaBody = contenedor.querySelector("#tabla-recompensas tbody");
    const formDiv = contenedor.querySelector("#formulario-recompensa");

    // ===== Cargar recompensas =====
    async function cargarRecompensas() {
        try {
            const response = await fetch("../processes/cargarRecompensasAdmin.php");
            const data = await response.json();
            if (!data.success) throw new Error(data.error || "Error al cargar recompensas");
            tablaBody.innerHTML = "";
            data.recompensas.forEach(r => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${r.id_recompensa}</td>
                    <td>${r.nombre}</td>
                    <td>${r.precio_puntos}</td>
                    <td>${r.descuento !== null ? r.descuento : ""}</td>
                    <td>${r.rol || ""}</td>
                    <td>${r.id_tipo_recompensa}</td>
                    <td>
                        <button class="editar" data-id="${r.id_recompensa}">Editar</button>
                        <button class="eliminar" data-id="${r.id_recompensa}">Eliminar</button>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
        }
    }

    await cargarRecompensas();

    // ===== Agregar nueva recompensa =====
    const btnAgregar = contenedor.querySelector("#btn-agregar-recompensa");
    btnAgregar.addEventListener("click", () => {
        formDiv.style.display = "block";
        contenedor.querySelector("#titulo-form").textContent = "Agregar Recompensa";
        formDiv.querySelector("#id_recompensa_form").value = "";
        formDiv.querySelector("#nombre_recompensa").value = "";
        formDiv.querySelector("#precio_puntos").value = "";
        formDiv.querySelector("#descuento").value = "";
        formDiv.querySelector("#rol").value = "";
        formDiv.querySelector("#id_tipo_recompensa").value = "";
    });

    // ===== Cancelar =====
    const btnCancelar = contenedor.querySelector("#btn-cancelar-recompensa");
    btnCancelar.addEventListener("click", () => formDiv.style.display = "none");

    // ===== Guardar (Agregar o Editar) =====
    const btnGuardar = contenedor.querySelector("#btn-guardar-recompensa");
btnGuardar.addEventListener("click", async () => {
    const id = formDiv.querySelector("#id_recompensa_form").value;
    const nombre = formDiv.querySelector("#nombre_recompensa").value.trim();
    const precio = parseInt(formDiv.querySelector("#precio_puntos").value);
    const descuento = formDiv.querySelector("#descuento").value.trim() || null;
    const rol = formDiv.querySelector("#rol").value.trim() || null;
    const id_tipo = parseInt(formDiv.querySelector("#id_tipo_recompensa").value);

    if (!nombre || isNaN(precio) || isNaN(id_tipo)) {
        alert("Completa los campos obligatorios (nombre, precio, id_tipo)");
        return;
    }

    const formData = new FormData();
    if (id) formData.append("id_recompensa", id);
    formData.append("nombre", nombre);
    formData.append("precio_puntos", precio);
    formData.append("descuento", descuento);
    formData.append("rol", rol);
    formData.append("id_tipo_recompensa", id_tipo);

    const url = id ? "../processes/editarRecompensa.php" : "../processes/crearRecompensa.php";
    const resp = await fetch(url, { method: "POST", body: formData });
    const resJson = await resp.json();
    if (resJson.success) {
        alert(resJson.mensaje || "Guardado correctamente");
        formDiv.style.display = "none";
        cargarRecompensas();
    } else {
        alert(resJson.error || "Error al guardar recompensa");
    }
});

   // ===== Editar y eliminar botones dinámicos =====
tablaBody.addEventListener("click", async (e) => {
    const target = e.target;

    // ===== Editar =====
    if (target.classList.contains("editar")) {
        const id = target.dataset.id;
        const row = target.closest("tr");
        formDiv.style.display = "block";
        contenedor.querySelector("#titulo-form").textContent = "Editar Recompensa";
        formDiv.querySelector("#id_recompensa_form").value = id;
        formDiv.querySelector("#nombre_recompensa").value = row.children[1].textContent;
        formDiv.querySelector("#precio_puntos").value = row.children[2].textContent;
        formDiv.querySelector("#descuento").value = row.children[3].textContent;
        formDiv.querySelector("#rol").value = row.children[4].textContent;
        formDiv.querySelector("#id_tipo_recompensa").value = row.children[5].textContent;

    // ===== Eliminar =====
    } else if (target.classList.contains("eliminar")) {
        const id = target.dataset.id;
        if (!confirm("¿Seguro que deseas eliminar esta recompensa?")) return;

        try {
            const formData = new FormData();
            formData.append("id_recompensa", id);

            const resp = await fetch("../processes/eliminarRecompensa.php", {
                method: "POST",
                body: formData
            });

            const resJson = await resp.json();
            if (resJson.success) {
                alert(resJson.mensaje || "Recompensa eliminada correctamente");
                cargarRecompensas(); // recarga la tabla
            } else {
                alert(resJson.error || "Error al eliminar recompensa");
            }

        } catch (err) {
            console.error("Error al eliminar recompensa:", err);
        }
    }
});

}
