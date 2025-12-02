// C:\xampp\htdocs\proyectoTBD\scripts\ForosEstudiantes.js

export function mostrarContenidoForo({ idRol, nombreUsuario }) {
    console.log("ForosEstudiantes.js cargado correctamente.");

    let foroSeleccionado = null;

    const contenedor = document.getElementById("contenido-central");

    contenedor.innerHTML = `
        <div id="contenedorForos" style="
            width: 92%;
            min-height: 520px;
            background: white;
            margin: 25px auto;
            padding: 12px;
            border-radius: 14px;
            border: 2px solid #ddd;
            box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background-color: #5C62E6;
        ">

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
            ">
            </div>
        </div>
    `;

    // === PETICIÓN DE FOROS ===
    fetch("../processes/ForosCursos.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_rol_usuario=${idRol}`
    })
        .then(res => res.json())
        .then(lista => {
            const contSup = document.getElementById("contenedorForosSuperior");
            contSup.innerHTML = "";

            if (!lista.length) {
                contSup.innerHTML = `<p style="color:white;">No hay foros disponibles.</p>`;
                return;
            }

            lista.forEach(f => {
                const item = document.createElement("div");
                item.dataset.idForo = f.id_foro;

                item.style = `
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

                item.innerHTML = `
                    <strong style="font-size:16px; color:white;">${f.titulo}</strong>
                    <img src="../img/foro.jpeg" alt="${f.titulo}"
                        style="width:150px; height:150px; object-fit:cover; border-radius:5px;">
                    <p style="font-size:13px; color:white; margin-top:5px;">${f.descripcion}</p>
                `;

                contSup.appendChild(item);
            });
        })
        .catch(err => {
            console.error("Error cargando foros:", err);
            document.getElementById("contenedorForosSuperior").innerHTML =
                `<p style="color:red;">Error cargando foros.</p>`;
        });


    // === LISTENER SOLO DENTRO DEL CONTENEDOR DE FOROS ===
    // === LISTENER SOLO DENTRO DEL CONTENEDOR DE FOROS ===
    const contenedorForosSuperior = document.getElementById("contenedorForosSuperior");

    contenedorForosSuperior.addEventListener("click", function (e) {

        const foroItem = e.target.closest("div[data-id-foro]");

        if (!foroItem) return;

        foroSeleccionado = foroItem.dataset.idForo;
        console.log("Foro seleccionado:", foroSeleccionado);

        // Quitar resaltado
        contenedorForosSuperior.querySelectorAll("div[data-id-foro]")
            .forEach(d => d.style.border = "2px solid transparent");

        // Resaltar seleccionado
        foroItem.style.border = "2px solid blue";

        // Agregar botón debajo
        const contBoton = document.getElementById("contenedorBotonIngresar");

        contBoton.innerHTML = `
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

        // Hover dinámico (porque inline no permite :hover)
        const btn = document.getElementById("btnIngresarForo");

        btn.onmouseenter = () => {
            btn.style.background = "linear-gradient(135deg, #64b5f6 0%, #1e88e5 100%)";
            btn.style.transform = "scale(1.05)";
        };

        btn.onmouseleave = () => {
            btn.style.background = "linear-gradient(135deg, #90caf9 0%, #42a5f5 100%)";
            btn.style.transform = "scale(1)";
        };

        // Acción cuando se hace click
        btn.onclick = () => {
            console.log("Ingresar al foro:", foroSeleccionado);

            import("./ForosPreguntas.js").then(mod => {
                mod.cargarPreguntasForo({
                    idRol,
                    idForo: foroSeleccionado
                });
            });
        };

    });

}