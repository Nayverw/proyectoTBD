// C:\xampp\htdocs\proyectoTBD\scripts\Reportes.js

export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
    const contenedor = document.getElementById("contenido-central");

    contenedor.innerHTML = `
        <!-- ====== ESTILOS LOCALES UNIFICADOS ====== -->
        <style>
            /* ====== ESTILO UNICO PARA TODOS LOS BOTONES ====== */
            .boton-azul {
                padding: 15px;
                background: #0984e3;
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1em;
                cursor: pointer;
                box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
                transition: 0.2s;
                text-align: center;
                width: 100%;
            }

            .boton-azul:hover {
                background: #0652c5;
                transform: translateY(-3px);
            }

            /* ====== GRID PRINCIPAL ====== */
            .report-menu-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 20px;
                margin: 0 auto;
                width: 100%;
                max-width: 900px;
            }

            /* ====== GRID DE SUBMENÚ ====== */
            .submenu-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-top: 25px;
            }

            /* ====== PANEL CONTENIDO ====== */
            #reporte-contenido {
                margin-top: 40px;
                text-align: center;
                color: #333;
                padding: 10px;
            }
        </style>

        <h2 style="text-align:center; color:#333; margin-bottom:30px;">
            Seleccione un tipo de reporte
        </h2>

        <!-- ====== MENÚ PRINCIPAL ====== -->
        <div class="report-menu-grid">
            <button class="boton-azul" data-reporte="progreso">Reporte de Progreso</button>
            <button class="boton-azul" data-reporte="puntos">Reporte de Puntos</button>
            <button class="boton-azul" data-reporte="recompensas">Reporte de Recompensas</button>
            <button class="boton-azul" data-reporte="cursos">Reporte de Cursos</button>
            <button class="boton-azul" data-reporte="certificaciones">Reporte de Certificaciones</button>
            <button class="boton-azul" data-reporte="pagos">Reporte de Pagos</button>
            <button class="boton-azul" data-reporte="docentes">Reporte de Docentes</button>
            <button class="boton-azul" data-reporte="gamificacion">Reporte de Gamificación</button>
            <button class="boton-azul" data-reporte="administrativo">Reporte Administrativo</button>
        </div>

        <!-- ====== PANEL DE CONTENIDO ====== -->
        <div id="reporte-contenido">
            <p>Seleccione una opción para ver su reporte.</p>
        </div>
    `;

    // ====== REFERENCIAS ======
    const botones = contenedor.querySelectorAll(".boton-azul");
    const panel = contenedor.querySelector("#reporte-contenido");

    // ====== SUBMENÚS DEFINIDOS ======
    const submenus = {
        progreso: [
            "Reporte de estudiante",
            "Reporte de notas",
            "Reporte de asistencia",
            "Reporte de promedios",
            "Reporte de popularidad"
        ],
        puntos: [
            "Reporte de saldos",
            "Reporte de ranking"
        ]
    };

    // ====== EVENTOS DE BOTONES PRINCIPALES ======
    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            const tipo = btn.getAttribute("data-reporte");

            // Si tiene submenú
            if (submenus[tipo]) {
                panel.innerHTML = `
                    <h3 style="color:#333;">${btn.textContent}</h3>
                    <div class="submenu-grid">
                        ${submenus[tipo].map(sub => `
                            <button class="boton-azul">${sub}</button>
                        `).join("")}
                    </div>
                `;
                return;
            }

            // Si NO tiene submenú
            panel.innerHTML = `
                <h3 style="color:#333;">${btn.textContent}</h3>
                <p style="margin-top:15px; font-size:1.1em;">
                    Lógica aún no implementada.
                </p>
            `;
        });
    });
}