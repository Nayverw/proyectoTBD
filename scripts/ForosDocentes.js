// C:\xampp\htdocs\proyectoTBD\scripts\ForosDocentes.js

export function mostrarContenidoForo({ idRol, nombreUsuario }) {
    console.log("ForosDocentes.js cargado correctamente.");

    const contenedor = document.getElementById("contenido-central");

    contenedor.innerHTML = `
        <div id="contenedorDocente" style="
            width: 92%;
            min-height: 480px;
            background-color: #5C62E6;
            margin: 25px auto;
            padding: 15px;
            border-radius: 14px;
            border: 2px solid #ddd;
            box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            gap: 15px;
        ">
            <!-- BOTONES SUPERIORES -->
            <div style="display:flex; justify-content: flex-start; gap: 15px;">
                <button id="btnAñadirForo" style="
                    background: linear-gradient(135deg, #90caf9 0%, #42a5f5 100%);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 20px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.3s;
                ">Añadir foro</button>

                <button id="btnMisForos" style="
                    background: linear-gradient(135deg, #90caf9 0%, #42a5f5 100%);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 20px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.3s;
                ">Mis foros</button>
            </div>

            <!-- FORMULARIO DE CREACIÓN DE FORO -->
            <div id="formCrearForo" style="
                background-color: #8083FF;
                border-radius: 10px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                color: white;
            ">
                <h3 style="text-align:center; margin-bottom: 12px;">Crea un Foro</h3>

                <div style="display:flex; align-items:center; gap:10px;">
                    <label style="width:120px;">Título:</label>
                    <input type="text" id="inputTitulo" style="flex:1; padding:5px; border-radius:5px; border:none;">
                </div>

                <div style="display:flex; align-items:center; gap:10px;">
                    <label style="width:120px;">Descripción:</label>
                    <input type="text" id="inputDescripcion" style="flex:1; padding:5px; border-radius:5px; border:none;">
                </div>

                <div style="display:flex; align-items:center; gap:10px;">
                    <label style="width:120px;">Valor puntos:</label>
                    <input type="number" id="inputValorPuntos" style="flex:1; padding:5px; border-radius:5px; border:none;">
                </div>

                <div style="display:flex; align-items:center; gap:10px;">
                    <label style="width:120px;">Curso:</label>
                    <select id="comboCursos" style="flex:1; padding:5px; border-radius:5px; border:none;">
                        <option>Cargando cursos...</option>
                    </select>
                </div>

                <div style="display:flex; justify-content:center; margin-top:8px;">
                    <button id="btnCrearForo" style="
                        background: linear-gradient(135deg, #90caf9 0%, #42a5f5 100%);
                        color: white;
                        border: none;
                        border-radius: 20px;
                        padding: 8px 25px;
                        font-size: 15px;
                        cursor: pointer;
                        transition: transform 0.2s, background 0.3s;
                    ">Crear foro</button>
                </div>
            </div>
        </div>

        <!-- OVERLAY DE ÉXITO -->
        <div id="overlayExito" style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #00c853;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 17px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: none;
            z-index: 9999;
        ">
            Foro creado correctamente
            <span id="cerrarOverlay" style="
                margin-left: 15px;
                cursor: pointer;
                font-weight: bold;
                color: #004d25;
                padding: 4px 8px;
                background: white;
                border-radius: 5px;
            ">X</span>
        </div>
    `;

    // Hover para los botones
    ["btnAñadirForo", "btnMisForos", "btnCrearForo"].forEach(id => {
        const btn = document.getElementById(id);
        btn.onmouseenter = () => {
            btn.style.background = "linear-gradient(135deg, #64b5f6 0%, #1e88e5 100%)";
            btn.style.transform = "scale(1.05)";
        };
        btn.onmouseleave = () => {
            btn.style.background = "linear-gradient(135deg, #90caf9 0%, #42a5f5 100%)";
            btn.style.transform = "scale(1)";
        };
    });

    // Cargar cursos disponibles
    fetch("../processes/ForosCombo.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_rol_usuario=${idRol}`
    })
    .then(res => res.json())
    .then(cursos => {
        const combo = document.getElementById("comboCursos");
        combo.innerHTML = "";
        if (!cursos.length) {
            combo.innerHTML = `<option>No hay cursos disponibles</option>`;
            return;
        }
        cursos.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id_curso;
            option.textContent = c.nombre_curso;
            combo.appendChild(option);
        });
    })
    .catch(err => {
        console.error("Error cargando cursos:", err);
        const combo = document.getElementById("comboCursos");
        combo.innerHTML = `<option>Error al cargar cursos</option>`;
    });

    // Acción del botón Crear foro
    document.getElementById("btnCrearForo").onclick = () => {
        const titulo = document.getElementById("inputTitulo").value.trim();
        const descripcion = document.getElementById("inputDescripcion").value.trim();
        const valorPuntos = document.getElementById("inputValorPuntos").value;
        const idCurso = document.getElementById("comboCursos").value;

        if (!titulo || !descripcion || !valorPuntos || !idCurso) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        fetch("../processes/ForosCrear.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `titulo=${encodeURIComponent(titulo)}&descripcion=${encodeURIComponent(descripcion)}&valor_puntos=${valorPuntos}&id_curso=${idCurso}`
        })
        .then(res => res.json())
        .then(resp => {
            if (resp.success) {

                // --- Mostrar overlay de éxito ---
                const overlay = document.getElementById("overlayExito");
                overlay.style.display = "block";

                let timer = setTimeout(() => {
                    overlay.style.display = "none";
                }, 5000);

                document.getElementById("cerrarOverlay").onclick = () => {
                    overlay.style.display = "none";
                    clearTimeout(timer);
                };

                // Recargar vista
                mostrarContenidoForo({ idRol, nombreUsuario });
            } else {
                alert("Error al crear foro: " + resp.error);
            }
        })
        .catch(err => {
            console.error("Error en ForosCrear.php:", err);
            alert("Error al crear foro.");
        });
    };
}