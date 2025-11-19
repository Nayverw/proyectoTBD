
// scripts/CanjearRecompensas.js
console.log("ESTE ES EL CÓDIGO NUEVO DE CANJEAR RECOMPENSAS");
export async function mostrarContenido({ idRolUsuario, nombreUsuario }) {
    const contenedor = document.getElementById("contenido-central");

    // Obtener id_rol_usuario guardado en sessionStorage
    const idRolUsuarioSession = sessionStorage.getItem("id_rol_usuario");

    // =============================
    // 1) OBTENER EL ROL REAL (1 o 2)
    // =============================
    let idRolReal = 1; // por defecto: estudiante

    async function obtenerRolReal() {
        try {
            const res = await fetch(
                "../processes/obtenerRolReal.php?id_rol_usuario=" + idRolUsuarioSession
            );
            const data = await res.json();

            if (data.success) {
                idRolReal = parseInt(data.id_rol);
            }
        } catch (err) {
            console.error("Error obteniendo rol real:", err);
        }
    }

    await obtenerRolReal();

    // =============================
    // 2) PINTAR LA ESTRUCTURA BASE
    // =============================
    contenedor.innerHTML = `
        <div style="width:100%; padding:20px;">
            <h2 style="color:#0a0a5c; margin-bottom:20px;">Canjear Recompensas</h2>

            <div id="rewards-list" 
                 style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:16px;">
            </div>

            <!-- ZONA DONDE IRÁ EL BOTÓN DE DOCENTE -->
            <div id="zona-docente" style="margin-top:30px;"></div>

            <div id="rewards-msg" style="margin-top:16px; color:#333;"></div>
        </div>
    `;

    cargarRecompensas(idRolUsuario);

    // =============================
    // 3) CARGAR RECOMPENSAS
    // =============================
    async function cargarRecompensas(idRolUsr) {
        const url = `../processes/cargarRecompensas.php?idRolUsuario=${encodeURIComponent(idRolUsr)}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            const list = document.getElementById("rewards-list");
            const zonaDocente = document.getElementById("zona-docente");
            const msg = document.getElementById("rewards-msg");

            list.innerHTML = "";
            msg.textContent = "";

            if (!data.success) {
                msg.textContent = data.error || "Error al cargar recompensas.";
                return;
            }

            const puntosActuales = parseInt(data.puntos_actuales ?? 0, 10);
            const recompensas = data.recompensas ?? [];

            // =============================
            // MOSTRAR RECOMPENSAS
            // =============================
            recompensas.forEach(r => {
                const card = document.createElement("div");
                card.style.background = "#fff";
                card.style.padding = "14px";
                card.style.borderRadius = "10px";
                card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
                card.style.display = "flex";
                card.style.flexDirection = "column";

                card.innerHTML = `
                    <h3 style="color:#0a0a5c; margin:0 0 10px 0;">${r.nombre}</h3>
                    <p style="margin:0;">Precio: <strong>${r.precio_puntos} pts</strong></p>
                    ${r.descuento ? `<p style="color:#d9534f; margin:5px 0;">Descuento: ${r.descuento}</p>` : ""}
                `;

                const btn = document.createElement("button");
                btn.textContent = "Canjear";
                btn.style.marginTop = "12px";
                btn.style.padding = "8px 12px";
                btn.style.border = "none";
                btn.style.borderRadius = "8px";
                btn.style.cursor = "pointer";
                btn.style.fontWeight = "600";

                if (puntosActuales < r.precio_puntos) {
                    btn.disabled = true;
                    btn.style.background = "#ccc";
                    btn.style.color = "#555";
                } else {
                    btn.style.background = "#06B897";
                    btn.style.color = "white";
                    btn.onclick = () => confirmarCanje(r.id_recompensa);
                }

                card.appendChild(btn);
                list.appendChild(card);
            });

            // =============================
            // 4) Mostrar botón SOLO a DOCENTE (id_rol = 2)
            // =============================
            if (idRolReal === 2) {
                zonaDocente.innerHTML = `
                    <button id="btn-agregar-recompensa"
                            style="background:#06B897; color:white; padding:12px 16px;
                                   border:none; border-radius:8px; cursor:pointer; font-weight:600;">
                        ➕ Agregar nueva recompensa
                    </button>

                    <div id="form-agregar" 
                         style="display:none; margin-top:20px; background:white; padding:20px; 
                                border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                        <h3 style="margin-top:0;">Registrar nueva recompensa</h3>

                        <label>Nombre:</label>
                        <input id="nuevo-nombre" type="text" 
                               style="width:100%; padding:8px; margin-bottom:10px;">

                        <label>Precio en puntos:</label>
                        <input id="nuevo-precio" type="number" 
                               style="width:100%; padding:8px; margin-bottom:10px;">

                        <label>Descuento (opcional):</label>
                        <input id="nuevo-descuento" type="text" 
                               style="width:100%; padding:8px; margin-bottom:10px;">

                        <button id="guardar-recompensa" 
                                style="background:#0a0a5c; color:white; padding:10px 16px;
                                       border:none; border-radius:8px; margin-top:10px; cursor:pointer;">
                          Guardar Recompensa
                        </button>
                    </div>
                `;

                // Mostrar/ocultar el formulario
                document.getElementById("btn-agregar-recompensa").onclick = () => {
                    const form = document.getElementById("form-agregar");
                    form.style.display = form.style.display === "none" ? "block" : "none";
                };

                // Guardar nueva recompensa
                document.getElementById("guardar-recompensa").onclick = guardarNuevaRecompensa;
            }

        } catch (err) {
            console.error(err);
            document.getElementById("rewards-msg").textContent = "Error de conexión.";
        }
    }

    // =============================
    // 5) GUARDAR NUEVA RECOMPENSA
    // =============================
    async function guardarNuevaRecompensa() {
        const nombre = document.getElementById("nuevo-nombre").value.trim();
        const precio = document.getElementById("nuevo-precio").value;
        const descuento = document.getElementById("nuevo-descuento").value.trim();

        if (!nombre || !precio) {
            alert("Nombre y precio son obligatorios.");
            return;
        }

        const form = new FormData();
        form.append("nombre", nombre);
        form.append("precio_puntos", precio);
        form.append("descuento", descuento);
        form.append("rol", "TODOS");
        form.append("id_tipo_recompensa", 1);

        const res = await fetch("../processes/agregarRecompensa.php", {
            method: "POST",
            body: form
        });

        const data = await res.json();

        if (data.success) {
            alert("Recompensa agregada correctamente");
            mostrarContenido({ idRolUsuario, nombreUsuario }); 
        } else {
            alert("Error: " + data.error);
        }
    }

    // =============================
    // 6) CANJEAR RECOMPENSA
    // =============================
    function confirmarCanje(idRecompensa) {
        if (!confirm("¿Deseas canjear esta recompensa?")) return;
        realizarCanje(idRecompensa);
    }

    async function realizarCanje(idRecompensa) {
        const form = new FormData();
        form.append("id_recompensa", idRecompensa);
        form.append("id_rol_usuario", idRolUsuario);

        const res = await fetch("../processes/canjearRecompensa.php", {
            method: "POST",
            body: form
        });

        const data = await res.json();

        if (data.success) {
            alert(data.mensaje);
            mostrarContenido({ idRolUsuario, nombreUsuario });
        } else {
            alert("Error: " + data.error);
        }
    }
}
