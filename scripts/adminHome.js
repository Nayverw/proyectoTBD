document.addEventListener("DOMContentLoaded", () => {
    const idRolUsuario = sessionStorage.getItem("id_rol_usuario");
    const nombreUsuario = sessionStorage.getItem("nombre_usuario") || "Administrador";

    // Saludo dinámico
    const textoSuperior = document.querySelector(".texto-superior p");
    if (textoSuperior) textoSuperior.textContent = `Bienvenido Administrador: ${nombreUsuario}`;

    // Cerrar sesión
    const btnCerrar = document.getElementById("btn-cerrar");
    if (btnCerrar) btnCerrar.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "../index.html";
    });

    // Menú hamburguesa
    const menuLeft = document.getElementById("menu-left");
    const menuRight = document.getElementById("menu-right");
    const hamburgerLeft = document.getElementById("hamburger-left");
    const hamburgerRight = document.getElementById("hamburger-right");

    hamburgerLeft.addEventListener("click", () => {
        menuLeft.style.left = menuLeft.style.left === "0px" ? "-300px" : "0px";
    });
    hamburgerRight.addEventListener("click", () => {
        menuRight.style.right = menuRight.style.right === "0px" ? "-300px" : "0px";
    });

    // Botones del menú
    const botones = {
        "btn-administrarCursos": "adm_cursos",
        "btn-administrarRecompensas": "AdministrarRecompensas",
        "btn-administrarAlumnos": "AdministrarAlumnos",
        "btn-administrarDocentes": "AdministrarDocentes",
        "btn-bitacoras": "Bitacoras",
        "btn-reportes": "Reportes"
    };

    Object.entries(botones).forEach(([idBoton, nombreModulo]) => {
        const boton = document.getElementById(idBoton);
        if (!boton) return;

        boton.addEventListener("click", async () => {
            try {
                const modulo = await import(`./${nombreModulo}.js`);
                if (typeof modulo.mostrarContenido === "function") {
                    modulo.mostrarContenido({ idRolUsuario, nombreUsuario });
                }
            } catch (error) {
                console.error(`Error al cargar el módulo ${nombreModulo}.js:`, error);
            }
        });
    });

    // =========================
    // ADMIN: Aulas y Horarios
    // =========================
    const contenidoCentral = document.getElementById("contenido-central");

    // Crear Aula
    async function crearAula() {
        abrirModal("Crear Aula", `
            <form id="form-crear-aula" style="display:flex; flex-direction:column; gap:10px;">
                <label>Nombre:</label><input type="text" name="nombre" required>
                <label>Ubicación:</label><input type="text" name="ubicacion" required>
                <label>Descripción:</label><input type="text" name="descripcion">
                <label>Disponible:</label>
                <select name="disponible">
                    <option value="1" selected>Sí</option>
                    <option value="0">No</option>
                </select>
                <button type="submit" class="small-button">Crear Aula</button>
            </form>
        `);

        document.getElementById("form-crear-aula").onsubmit = async e => {
            e.preventDefault();
            try {
                const fd = new FormData(e.target);
                const res = await fetch("../processes/crearAula.php", { method: "POST", body: fd });
                const data = await res.json();
                alert(data.success ? "Aula creada correctamente" : data.error);
                if (data.success) cerrarModal();
            } catch (err) {
                console.error(err);
                alert("Error del servidor al crear aula");
            }
        };
    }

    // Crear Horario
    async function crearHorario() {
        // Obtener aulas disponibles
        let aulasData;
        try {
            const r = await fetch("../processes/obtenerAulas.php");
            aulasData = await r.json();
            if (!aulasData.success) throw new Error(aulasData.error);
        } catch (err) {
            alert("Error al cargar aulas: " + err.message);
            return;
        }

        const opcionesAulas = aulasData.aulas.map(a => `<option value="${a.id_aula}">${a.nombre} - ${a.ubicacion}</option>`).join("");

        abrirModal("Crear Horario", `
            <form id="form-crear-horario" style="display:flex; flex-direction:column; gap:10px;">
                <label>Día:</label><input type="text" name="dia" required>
                <label>Hora:</label><input type="text" name="hora" required>
                <label>Valor Puntos:</label><input type="number" name="valor_puntos" value="0" required>
                <label>Aula:</label>
                <select name="id_aula" required>
                    <option value="">Selecciona un aula</option>
                    ${opcionesAulas}
                </select>
                <button type="submit" class="small-button">Crear Horario</button>
            </form>
        `);

        document.getElementById("form-crear-horario").onsubmit = async e => {
            e.preventDefault();
            try {
                const fd = new FormData(e.target);
                const res = await fetch("../processes/crearHorario.php", { method: "POST", body: fd });
                const data = await res.json();
                alert(data.success ? "Horario creado correctamente" : data.error);
                if (data.success) cerrarModal();
            } catch (err) {
                console.error(err);
                alert("Error del servidor al crear horario");
            }
        };
    }

    // Botones dentro del menú para probar
    const btnCrearAula = document.createElement("button");
    btnCrearAula.textContent = "Crear Aula";
    btnCrearAula.className = "small-button";
    btnCrearAula.onclick = crearAula;

    const btnCrearHorario = document.createElement("button");
    btnCrearHorario.textContent = "Crear Horario";
    btnCrearHorario.className = "small-button";
    btnCrearHorario.onclick = crearHorario;

    contenidoCentral.append(btnCrearAula, btnCrearHorario);

    // Modal genérico
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
                <div id="modal-content" style="background:white;padding:20px;border-radius:8px;max-width:500px;width:90%;position:relative;max-height:90%;overflow-y:auto;">
                    <span id="modal-close" style="position:absolute;top:10px;right:15px;cursor:pointer;font-weight:bold;">&times;</span>
                    <div id="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById("modal-close").onclick = cerrarModal;
            window.onclick = e => { if (e.target === modal) cerrarModal(); };
        }
        document.getElementById("modal-body").innerHTML = contenidoHTML;
        modal.style.display = "flex";
    }

    function cerrarModal() {
        const modal = document.getElementById("modal");
        if (modal) modal.style.display = "none";
    }
});
