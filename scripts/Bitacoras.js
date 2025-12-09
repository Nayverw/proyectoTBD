// ======================================
// Bitacoras.js
// ======================================

export function mostrarContenido() {

    const contenedor = document.getElementById("contenido-dinamico");

    contenedor.innerHTML = `
        <h2 style="text-align:center; margin-bottom: 25px;">Panel de Bitácoras</h2>

        <div id="contenedor-bitacoras" class="bit-grid">

            ${crearBloque("Bitácora de Acceso", "1")}
            ${crearBloque("Bitácora de Inscripción", "2")}
            ${crearBloque("Bitácora de Progreso", "3")}
            ${crearBloque("Bitácora de Puntos", "4")}
            ${crearBloque("Bitácora de Modificación", "5")}
            ${crearBloque("Bitácora Financiera", "6")}

        </div>
    `;
}

// Componente individual
function crearBloque(titulo, tipo) {
    return `
        <div class="bit-card">
            <h3>${titulo}</h3>
            <button class="bit-btn" onclick="abrirBitacora('${tipo}')">Ver bitácora</button>
        </div>
    `;
}

// =============================
// MÉTODO PRINCIPAL
// Cargar tabla según tipo
// =============================
window.abrirBitacora = async function(tipo) {

    const contenedor = document.getElementById("contenido-dinamico");

    // Mostrar carga temporal
    contenedor.innerHTML = `
        <h2 style="text-align:center;">Cargando Bitácora...</h2>
    `;

    try {
        const response = await fetch(`../processes/bitacoras_ajax.php?tipo=${tipo}`);

        if (!response.ok) {
            throw new Error("Error al obtener datos del servidor");
        }

        const datos = await response.json();

        contenedor.innerHTML = `
            <h2 style="text-align:center; margin-bottom: 20px;">
                Bitácora: ${obtenerTitulo(tipo)}
            </h2>

            <button onclick="window.volverPanelBitacoras()" class="bit-btn" 
                style="display:block; margin:0 auto 20px auto;">
                ⬅ Volver
            </button>

            <table class="tabla-bitacora">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Acción</th>
                        <th>Descripción</th>
                        <th>Tabla</th>
                        <th>ID Rol Usuario</th>
                        <th>Fecha</th>
                    </tr>
                </thead>

                <tbody>
                    ${
                        datos.length > 0
                        ? datos.map(reg => `
                            <tr>
                                <td>${reg.id_bitacora}</td>
                                <td>${reg.accion}</td>
                                <td>${reg.descripcion}</td>
                                <td>${reg.tabla_afectada}</td>
                                <td>${reg.id_rol_usuario}</td>
                                <td>${reg.fecha}</td>
                            </tr>
                        `).join('')
                        : `<tr><td colspan="6" style="text-align:center;">No hay registros.</td></tr>`
                    }
                </tbody>
            </table>
        `;

        // guardar el tipo actual por si haces filtros después
        window.tipoActualBitacora = tipo;

    } catch (error) {
        contenedor.innerHTML = `
            <h2>Error al cargar bitácora</h2>
            <p>${error.message}</p>
        `;
    }
};

// =============================
// TÍTULOS SEGÚN ID
// =============================
function obtenerTitulo(tipo) {
    const titulos = {
        "1": "Acceso",
        "2": "Inscripción",
        "3": "Progreso",
        "4": "Puntos",
        "5": "Modificación",
        "6": "Financiera"
    };
    return titulos[tipo] || "Bitácora";
}

// =============================
// VOLVER AL PANEL PRINCIPAL
// =============================
window.volverPanelBitacoras = function() {
    mostrarContenido();
};

