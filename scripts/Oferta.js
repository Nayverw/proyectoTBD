export function mostrarContenido({ idRolUsuario, nombreUsuario, rolUsuario }) {
    const cont = document.getElementById("contenido-central");

    cont.innerHTML = `
        <div style="width:100%; display:flex; justify-content:center;">
         <div class="main-box" style="width:90%; height:100%; display:flex; flex-direction:column;">
         <!-- Contenedor título fijo -->
          <div class="oferta-header">
            <h3 class="oferta-titulo">Cursos Disponibles</h3>
        </div>

        <!-- Contenedor scroll independiente para tarjetas -->
        <div id="oferta-scroll" class="cursos-scroll"></div>
         </div>
        </div>

        <!-- Modales -->
        <div id="modal-curso" class="modal">
            <div class="modal-content">
                <span id="cerrar-modal" class="close-modal">&times;</span>
                <h2 id="modal-titulo"></h2>
                <p><strong>Docente:</strong> <span id="modal-docente"></span></p>
                <p id="modal-descripcion"></p>
                <button id="btn-inscribir-modal" class="small-button">Inscribirme</button>
            </div>
        </div>

        <div id="modal-pago" class="modal">
            <div class="modal-content">
                <span id="cerrar-modal-pago" class="close-modal">&times;</span>
                <h2>Registro de Pago</h2>
                <form id="form-pago">
                    <input type="hidden" id="pago-id-curso">
                    <label>Monto a Pagar:</label>
                    <input type="number" id="pago-monto" class="input" min="1" required>
                    <label>Tipo de Pago:</label>
                    <select id="pago-tipo" class="input" required>
                        <option value="">Seleccione</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Tigo Money">Tigo Money</option>
                        <option value="QR">QR</option>
                    </select>
                    <button type="submit" class="small-button">Confirmar Pago</button>
                </form>
            </div>
        </div>

        <div id="modal-voucher" class="modal">
            <div class="modal-content">
                <span id="cerrar-modal-voucher" class="close-modal">&times;</span>
                <h2>Comprobante de Pago</h2>
                <div id="voucher-detalle"></div>
                <button id="btn-cerrar-voucher" class="small-button">Cerrar</button>
            </div>
        </div>
    `;

    const lista = document.getElementById("oferta-scroll");
    const modalInfo = document.getElementById("modal-curso");
    const modalPago = document.getElementById("modal-pago");
    const modalVoucher = document.getElementById("modal-voucher");

    // ---- Cerrar modales ----
    document.getElementById("cerrar-modal").onclick = () => modalInfo.style.display = "none";
    document.getElementById("cerrar-modal-pago").onclick = () => modalPago.style.display = "none";
    document.getElementById("cerrar-modal-voucher").onclick = () => modalVoucher.style.display = "none";
    document.getElementById("btn-cerrar-voucher").onclick = () => {
        modalVoucher.style.display = "none";
        mostrarContenido({ idRolUsuario, nombreUsuario, rolUsuario });
    };

    window.onclick = e => {
        if (e.target === modalInfo) modalInfo.style.display = "none";
        if (e.target === modalPago) modalPago.style.display = "none";
        if (e.target === modalVoucher) modalVoucher.style.display = "none";
    };

    // ---- Rol docente no accede a oferta ----
    if ((rolUsuario || "").toUpperCase() === "DOCENTE") {
        lista.innerHTML = "<p>No tiene acceso a la oferta de cursos.</p>";
        return;
    }

    // ---- Cargar cursos ----
    fetch(`../processes/cargarCursosDisponibles.php?id_rol_usuario=${idRolUsuario}`)
        .then(r => r.json())
        .then(data => {
            if(!data.success){ lista.innerHTML="<p>Error al cargar cursos.</p>"; return; }
            const disponibles = data.cursos_disponibles;
            if(!disponibles.length){ lista.innerHTML="<p>No hay cursos disponibles.</p>"; return; }

            disponibles.forEach(curso => {
                const inscritos = curso.inscritos || 0;
                const cupoDisponible = curso.cupo - inscritos;

                const card = document.createElement("div");
                card.classList.add("curso-rectangulo");
                card.innerHTML = `
                    <h3>${curso.nombre_curso}</h3>
                    <p><strong>Cupo:</strong> ${cupoDisponible>0?cupoDisponible:"Sin cupos"}</p>
                    <p><strong>Precio:</strong> ${curso.precio}</p>
                    <button class="small-button btn-info">Más información</button>
                    ${cupoDisponible>0
                        ? `<button class="small-button btn-inscribir">Inscribirse</button>`
                        : `<button class="small-button btn-inscribir" disabled style="background:#ccc; cursor:not-allowed;">Sin cupos</button>`
                    }
                `;

                // Modal info
                card.querySelector(".btn-info").onclick = () => {
                    document.getElementById("modal-titulo").textContent = curso.nombre_curso;
                    document.getElementById("modal-docente").textContent = curso.docente || "No asignado";
                    document.getElementById("modal-descripcion").innerHTML = `
                        <p>${curso.descripcion_aula || "Sin descripción"}</p>
                        <p><strong>Precio:</strong> ${curso.precio}</p>
                        <p><strong>Cupo:</strong> ${cupoDisponible>0?cupoDisponible:"Sin cupos"}</p>
                    `;
                    const btnModal = document.getElementById("btn-inscribir-modal");
                    if(cupoDisponible <= 0){
                        btnModal.disabled = true;
                        btnModal.textContent = "Sin cupos";
                    } else {
                        btnModal.disabled = false;
                        btnModal.textContent = "Inscribirme";
                        btnModal.onclick = () => abrirModalPago(curso.id_curso, curso.precio);
                    }
                    modalInfo.style.display = "flex";
                };

                // Botón inscribirse directo
                const btnCard = card.querySelector(".btn-inscribir");
                if(cupoDisponible>0) btnCard.onclick = () => abrirModalPago(curso.id_curso, curso.precio);

                lista.appendChild(card);
            });
        })
        .catch(err => { lista.innerHTML="<p>Error al cargar cursos.</p>"; console.error(err); });

    function abrirModalPago(idCurso, precio){
        modalInfo.style.display="none";
        document.getElementById("pago-id-curso").value = idCurso;
        document.getElementById("pago-monto").value = precio;
        document.getElementById("pago-tipo").value = "";
        modalPago.style.display = "flex";
    }

    document.getElementById("form-pago").onsubmit = function(e){
        e.preventDefault();
        const idCurso = document.getElementById("pago-id-curso").value;
        const monto = document.getElementById("pago-monto").value;
        const tipo = document.getElementById("pago-tipo").value;

        if(!tipo || monto<=0){ alert("Complete todos los campos de pago"); return; }

        const fd = new FormData();
        fd.append("id_curso", idCurso);
        fd.append("id_rol_usuario", idRolUsuario);
        fd.append("monto_pagado", monto);
        fd.append("tipo_pago", tipo);

        fetch("../processes/pagarCurso.php",{method:"POST",body:fd})
        .then(r=>r.text())
        .then(text=>{
            let data;
            try{data=JSON.parse(text);}catch(e){alert("Error en el pago");return;}
            if(!data.success){ alert(data.mensaje); return; }

            const v=data.voucher;
            document.getElementById("voucher-detalle").innerHTML = `
                <p><strong>Curso:</strong> ${v.curso}</p>
                <p><strong>Docente:</strong> ${v.docente}</p>
                <p><strong>Monto pagado:</strong> ${v.monto_pagado}</p>
                <p><strong>Tipo de pago:</strong> ${v.tipo_pago}</p>
                <p><strong>Fecha:</strong> ${v.fecha_pago}</p>
            `;
            modalPago.style.display="none";
            modalVoucher.style.display="flex";
        })
        .catch(err=>{ console.error(err); alert("Error al procesar pago"); });
    };
}
