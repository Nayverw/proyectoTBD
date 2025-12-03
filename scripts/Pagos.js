// Pagos.js

// Función principal llamada por cargarHome.js
export function iniciar({ idRolUsuario, nombreUsuario }) {
    mostrarPagos({ idRolUsuario, nombreUsuario });
}

// Función para mostrar el historial de pagos
export function mostrarPagos({ idRolUsuario, nombreUsuario }) {
    const cont = document.getElementById("contenido-central");

    cont.innerHTML = `
        <div style="width:100%; display:flex; justify-content:center;">
            <div class="main-box" style="width:90%; height:100%; overflow:auto;">
                <h3 class="cursos-titulo">Historial de Pagos</h3>
                <div id="pagos-lista"></div>
            </div>
        </div>

        <!-- Modal Voucher -->
        <div id="modal-voucher" class="modal">
            <div class="modal-content">
                <span id="cerrar-modal-voucher" class="close-modal">&times;</span>
                <h2>Comprobante de Pago</h2>
                <div id="voucher-detalle"></div>
                <button id="btn-cerrar-voucher" class="small-button">Cerrar</button>
            </div>
        </div>
    `;

    const lista = document.getElementById("pagos-lista");
    const modalVoucher = document.getElementById("modal-voucher");

    // Cerrar modal
    document.getElementById("cerrar-modal-voucher").onclick = () => modalVoucher.style.display = "none";
    document.getElementById("btn-cerrar-voucher").onclick = () => modalVoucher.style.display = "none";
    window.onclick = e => { if (e.target === modalVoucher) modalVoucher.style.display = "none"; };

    // Cargar pagos desde PHP
    fetch(`../processes/cargarPagos.php?id_rol_usuario=${idRolUsuario}`)
        .then(r => r.json())
        .then(data => {
            if(!data.success){ 
                lista.innerHTML="<p>No se pudo cargar los pagos.</p>"; 
                return; 
            }

            const pagos = data.pagos;
            if(!pagos.length){ 
                lista.innerHTML="<p>No hay pagos registrados.</p>"; 
                return; 
            }

            pagos.forEach(pago => {
                const card = document.createElement("div");
                card.classList.add("curso-rectangulo");
                card.innerHTML = `
                    <p><strong>Curso:</strong> ${pago.curso}</p>
                    <p><strong>Monto:</strong> ${pago.monto_pagado}</p>
                    <p><strong>Tipo de pago:</strong> ${pago.tipo_pago}</p>
                    <p><strong>Fecha:</strong> ${pago.fecha_pago}</p>
                    <button class="small-button btn-ver-voucher">Ver Voucher</button>
                `;

                // Mostrar modal voucher
                card.querySelector(".btn-ver-voucher").onclick = () => {
                    const voucherDetalle = document.getElementById("voucher-detalle");
                    voucherDetalle.innerHTML = `
                        <p><strong>ID Pago:</strong> ${pago.id_pago}</p>
                        <p><strong>Curso:</strong> ${pago.curso}</p>
                        <p><strong>Docente:</strong> ${pago.docente}</p>
                        <p><strong>Monto pagado:</strong> ${pago.monto_pagado}</p>
                        <p><strong>Tipo de pago:</strong> ${pago.tipo_pago}</p>
                        <p><strong>Fecha:</strong> ${pago.fecha_pago}</p>
                    `;
                    modalVoucher.style.display = "flex";
                };

                lista.appendChild(card);
            });
        })
        .catch(err => { 
            lista.innerHTML="<p>Error al cargar pagos.</p>"; 
            console.error(err); 
        });
}
