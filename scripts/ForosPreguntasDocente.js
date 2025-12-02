export function cargarPreguntasForo({ idRol, idForo }) {
    console.log("ForosPreguntasDocentes.js cargado correctamente.");
    console.log("ID RolUsuario:", idRol, "ID Foro:", idForo);

    const contenedor = document.getElementById("contenido-central");

    contenedor.innerHTML = `
        <div style="width: 90%; margin: 20px auto;">
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:10px;">
                <button id="btnVolver" style="
                    padding: 10px 20px;
                    border-radius: 20px;
                    border:none;
                    background: #90caf9;
                    color:white;
                    cursor:pointer;
                ">← Volver</button>

                <img src="../img/usuario.jpeg" alt="Usuario" style="width:50px; height:50px; border-radius:50%; object-fit:cover;">

                <input type="text" id="inputNuevaPregunta" placeholder="Escribe tu pregunta..." style="flex:1; padding:8px; border-radius:5px; border:1px solid #ccc;">

                <button id="btnPublicarPregunta" style="
                    padding: 8px 15px;
                    border-radius: 8px;
                    border:none;
                    background:#42a5f5;
                    color:white;
                    cursor:pointer;
                ">Publicar</button>
            </div>

            <div id="divPreguntas" style="
                background: white;
                color: black;
                padding: 15px;
                border-radius: 12px;
                max-height: 500px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 15px;
            ">
                <div id="contenedorListadoPreguntas">
                    <p>Cargando preguntas...</p>
                </div>
            </div>
        </div>
    `;

    // --- BOTÓN VOLVER ---
    document.getElementById("btnVolver").onclick = () => {
        import("./ForosDocentes.js").then(mod => {
            mod.mostrarContenidoForo({ idRol, nombreUsuario: "Docente" });
        });
    };


    const contenedorListado = document.getElementById("contenedorListadoPreguntas");

    // --- FUNCIONES PARA CARGAR PREGUNTAS Y RESPUESTAS ---
    function cargarPreguntas() {
        fetch("../processes/ForosPreguntasCargar.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id_foro=${idForo}`
        })
            .then(res => res.json())
            .then(data => {
                contenedorListado.innerHTML = "";
                if (!data.length) {
                    contenedorListado.innerHTML = `<p>No hay preguntas todavía.</p>`;
                    return;
                }

                data.forEach(p => {
                    const preguntaDiv = document.createElement("div");
                    preguntaDiv.style = "border-bottom:1px solid #ccc; padding:8px;";
                    preguntaDiv.innerHTML = `
                    <strong>${p.descripcion}</strong> <small style="color:gray;">(${p.fecha})</small>
                    <div id="respuestas_${p.id_pregunta_foro}" style="margin-left:15px; margin-top:5px;">
                        <p>Cargando respuestas...</p>
                    </div>
                    <div style="display:flex; gap:5px; margin-top:5px;">
                        <input type="text" placeholder="Escribe tu respuesta..." style="flex:1; padding:5px; border-radius:5px; border:1px solid #ccc;" id="inputRespuesta_${p.id_pregunta_foro}">
                        <button data-id="${p.id_pregunta_foro}" class="btnResponder" style="padding:5px 10px; border-radius:5px; border:none; background:#42a5f5; color:white; cursor:pointer;">Responder</button>
                    </div>
                `;
                    contenedorListado.appendChild(preguntaDiv);

                    cargarRespuestas(p.id_pregunta_foro);
                });

                document.querySelectorAll(".btnResponder").forEach(btn => {
                    btn.onclick = () => {
                        const idPregunta = btn.dataset.id;
                        const input = document.getElementById(`inputRespuesta_${idPregunta}`);
                        const texto = input.value.trim();
                        if (!texto) return;
                        fetch("../processes/ForosRespuestaCrear.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: `id_pregunta_foro=${idPregunta}&descripcion=${encodeURIComponent(texto)}&id_rol_usuario=${idRol}`
                        })
                            .then(res => res.json())
                            .then(resp => {
                                if (resp.success) {
                                    input.value = "";
                                    cargarRespuestas(idPregunta);
                                } else {
                                    alert("Error al publicar respuesta.");
                                }
                            });
                    };
                });
            });
    }

    function cargarRespuestas(idPregunta) {
        fetch("../processes/ForosRespuestasCargar.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id_pregunta_foro=${idPregunta}`
        })
            .then(res => res.json())
            .then(data => {
                const contRespuestas = document.getElementById(`respuestas_${idPregunta}`);
                contRespuestas.innerHTML = "";
                if (!data.length) {
                    contRespuestas.innerHTML = `<p style="color:gray;">Sin respuestas</p>`;
                    return;
                }
                data.forEach(r => {
                    const rDiv = document.createElement("div");
                    rDiv.style = "margin-top:3px; padding-left:5px;";
                    rDiv.innerHTML = `<span>${r.descripcion}</span> <small style="color:gray;">(${r.fecha})</small>`;
                    contRespuestas.appendChild(rDiv);
                });
            });
    }

    // --- PUBLICAR NUEVA PREGUNTA ---
    document.getElementById("btnPublicarPregunta").onclick = () => {
        const texto = document.getElementById("inputNuevaPregunta").value.trim();
        if (!texto) return;
        fetch("../processes/ForosPreguntaCrear.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `descripcion=${encodeURIComponent(texto)}&id_rol_usuario=${idRol}&id_foro=${idForo}`
        })
            .then(res => res.json())
            .then(resp => {
                if (resp.success) {
                    document.getElementById("inputNuevaPregunta").value = "";
                    cargarPreguntas();
                } else {
                    alert("Error al publicar la pregunta.");
                }
            });
    };

    // --- CARGAR PREGUNTAS INICIALES ---
    cargarPreguntas();
}