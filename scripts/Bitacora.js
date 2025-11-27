export async function iniciar({ idRolUsuario }) {
    const mainBox = document.getElementById("main-box");
    mainBox.innerHTML = `
        <h2>Registro de Bitácora</h2>
        <p>Acciones realizadas dentro del sistema</p>
        <div id="tabla-bitacora" class="tabla-container">
            <p>Cargando datos...</p>
        </div>
    `;

    try {
        const resp = await fetch(`../processes/cargarBitacora.php`);
        const data = await resp.json();

        if (!data.success) {
            mainBox.innerHTML = `<p>Error: ${data.error}</p>`;
            return;
        }

        const contenedor = document.getElementById("tabla-bitacora");
        contenedor.innerHTML = `
            <table class="tabla">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Acción</th>
                        <th>Descripción</th>
                        <th>Tabla Afectada</th>
                        <th>ID Usuario</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.registros.map(reg => `
                        <tr>
                            <td>${reg.id_bitacora}</td>
                            <td>${reg.accion}</td>
                            <td>${reg.descripcion}</td>
                            <td>${reg.tabla_afectada}</td>
                            <td>${reg.id_rol_usuario}</td>
                            <td>${reg.fecha}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error("Error cargando la bitácora:", error);
        document.getElementById("tabla-bitacora").innerHTML = `<p>Error al cargar bitácora.</p>`;
    }
}
