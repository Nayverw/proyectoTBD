// C:\xampp\htdocs\proyectoTBD\scripts\ForosCargar.js

export function cargarMisForos({ idRol }) {
    console.log("ForosCargar.js cargado correctamente");

    let foroSeleccionado = null;

    // Usar la zona dinámica existente del docente
    const zona = document.getElementById("zonaDinamica");

    zona.innerHTML = `
        <h2 style="text-align:center; color:white; margin-bottom:15px;">
            Foros de tus cursos
        </h2>

        <div id="contenedorForosSuperior" style="
            width: 100%;
            height: 100%;
            background: #8083FF;
            border-radius: 10px;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            overflow-x: auto;
            white-space: nowrap;
        ">
            <p style="color:white;">Cargando foros...</p>
        </div>

        <div id="contenedorBotonIngresar" style="
            width: 100%;
            margin-top: 20px;
            display: flex;
            justify-content: center;
        "></div>
    `;

    // === PETICIÓN REAL DE FOROS DEL DOCENTE ===
    fetch("../processes/ForosDocente.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_rol_usuario=${idRol}`
    })
        .then(res => res.json())
        .then(data => {
            const contenedorForos = document.getElementById("contenedorForosSuperior");
            contenedorForos.innerHTML = "";

            if (!data.length) {
                contenedorForos.innerHTML = `<p style="color:white;">No tienes foros creados.</p>`;
                return;
            }

            // Crear tarjetas
            data.forEach(foro => {
                const card = document.createElement("div");
                card.dataset.idForo = foro.id_foro;

                card.style = `
                    min-width: 180px;
                    height: 220px;
                    background: #84C3F5;
                    border-radius: 10px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    flex-shrink: 0;
                    cursor: pointer;
                    border: 2px solid transparent;
                `;

                card.innerHTML = `
                    <strong style="font-size:16px; color:white;">${foro.titulo}</strong>
                    <img src="../img/foro.jpeg" alt="${foro.titulo}"
                        style="width:150px; height:150px; object-fit:cover; border-radius:5px;">
                    <p style="font-size:13px; color:white; margin-top:5px;">${foro.descripcion}</p>
                `;

                contenedorForos.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error cargando foros:", err);
            document.getElementById("contenedorForosSuperior").innerHTML =
                `<p style="color:white;">Error al cargar los foros.</p>`;
        });


    // === LISTENER PARA SELECCIONAR TARJETAS ===
    const contenedorForosSuperior = document.getElementById("contenedorForosSuperior");

    contenedorForosSuperior.addEventListener("click", function (e) {
        const item = e.target.closest("div[data-id-foro]");
        if (!item) return;

        // Guardar selección
        foroSeleccionado = item.dataset.idForo;
        console.log("Foro seleccionado:", foroSeleccionado);

        // Quitar resaltado previo
        contenedorForosSuperior
            .querySelectorAll("div[data-id-foro]")
            .forEach(d => d.style.border = "2px solid transparent");

        // Resaltar seleccionado
        item.style.border = "2px solid blue";

        // Mostrar botón debajo
        const contenedorBoton = document.getElementById("contenedorBotonIngresar");

        contenedorBoton.innerHTML = `
            <button id="btnIngresarForo" style="
                background: linear-gradient(135deg, #90caf9 0%, #42a5f5 100%);
                color: white;
                border: none;
                border-radius: 20px;
                padding: 10px 0;
                font-size: 15px;
                cursor: pointer;
                transition: transform 0.2s, background 0.3s;
                width: 50%;
            ">
                Ingresar
            </button>
        `;

        // ==== HOVER DINÁMICO ====
        const btn = document.getElementById("btnIngresarForo");

        btn.onmouseenter = () => {
            btn.style.background = "linear-gradient(135deg, #64b5f6 0%, #1e88e5 100%)";
            btn.style.transform = "scale(1.05)";
        };

        btn.onmouseleave = () => {
            btn.style.background = "linear-gradient(135deg, #90caf9 0%, #42a5f5 100%)";
            btn.style.transform = "scale(1)";
        };

        // ==== SIN FUNCIONALIDAD (TEMPORAL) ====
        btn.onclick = () => {
            console.log(`Ingresar al foro (DOCENTE):`, foroSeleccionado);
        };
    });
}