export function mostrarContenido({ idRolUsuario, nombreUsuario }) {

    const contenedor = document.getElementById("contenido-central");
    let dataGlobal = null;
    let charts = [];

    contenedor.innerHTML = `
        <style>
            .grafico { margin: 25px 0; }
            .reporte-saldo-container {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                width: 100%;
                height: 100%;
                overflow-y: auto;
            }

            .reporte-saldo-superior {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .filtros {
                display: flex;
                gap: 15px;
                align-items: center;
                font-weight: bold;
            }

            .reporte-titulo {
                text-align: center;
                font-size: 1.6em;
                font-weight: bold;
            }

            .tabla-scroll {
                max-height: 500px;
                overflow-y: auto;
                border-radius: 8px;
            }

            table {
                width: 100%;
                min-width: 900px;
                border: 2px solid black;
                border-spacing: 0;
                border-radius: 8px;
                background:white;
            }

            th {
                background-color: #2478F0;
                color: white;
                padding: 10px;
                border: 1px solid black;
            }

            td {
                padding: 8px;
                border: 1px solid black;
                text-align: center;
            }

            .totales {
                margin-top: 15px;
                font-weight: bold;
                text-align: left;
            }

            button {
                padding: 10px 20px;
                border-radius: 20px;
                border: none;
                cursor: pointer;
                background: #64b5f6;
                color: white;
            }
        </style>

        <div class="reporte-saldo-container">

            <div class="reporte-saldo-superior">
                <div>
                    <button id="btnVolver">← Volver</button>
                    <button id="btnGenerarReporte">📄 Generar Reporte</button>
                </div>

                <div class="filtros">
                    <label><input type="checkbox" id="chkEstudiante" checked> Estudiantes</label>
                    <label><input type="checkbox" id="chkDocente"> Docentes</label>
                    <label><input type="checkbox" id="chkEstadistica"> Estadística</label>
                </div>
            </div>

            <div class="reporte-titulo">Reporte de puntos acumulados y canjeados</div>

            <div class="tabla-scroll">
                <table id="tablaReportePDF">
                    <thead id="tabla-head">
                        <tr>
                            <th>#</th>
                            <th>Nombre y Apellido</th>
                            <th>Correo electrónico</th>
                            <th>Puntos acumulados</th>
                            <th>Puntos gastados</th>
                            <th>Puntos actuales</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-cuerpo"></tbody>
                </table>

                <div class="totales" id="totales"></div>

                <div id="graficos-contenedor" style="display:none;">
                    <div class="grafico">
                        <h3 style="text-align:center;">Puntos acumulados</h3>
                        <canvas id="grafAcumulados"></canvas>
                    </div>
                    <div class="grafico">
                        <h3 style="text-align:center;">Puntos gastados</h3>
                        <canvas id="grafGastados"></canvas>
                    </div>
                    <div class="grafico">
                        <h3 style="text-align:center;">Puntos actuales</h3>
                        <canvas id="grafActuales"></canvas>
                    </div>
                </div>
            </div>

        </div>
    `;

    const tablaHead = document.getElementById("tabla-head");
    const cuerpo = document.getElementById("tabla-cuerpo");
    const totalesDiv = document.getElementById("totales");
    const graficosCont = document.getElementById("graficos-contenedor");

    document.getElementById("btnVolver").onclick = () =>
        import("./Reportes.js").then(m => m.mostrarContenido({ idRolUsuario, nombreUsuario }));

    const chkEst = document.getElementById("chkEstudiante");
    const chkDoc = document.getElementById("chkDocente");
    const chkEstad = document.getElementById("chkEstadistica");

    chkEst.onchange = cargarReporte;
    chkDoc.onchange = cargarReporte;
    chkEstad.onchange = cargarReporte;

    cargarReporte();

    function cargarReporte() {
        const roles = [];
        if (chkEst.checked) roles.push("Estudiante");
        if (chkDoc.checked) roles.push("Docente");

        if (roles.length === 0) {
            cuerpo.innerHTML = `<tr><td colspan="6" style="text-align:center;">Seleccione un rol o roles para el reporte</td></tr>`;
            totalesDiv.innerHTML = "";
            tablaHead.style.display = "none";
            graficosCont.style.display = "none";
            charts.forEach(c => c.destroy());
            charts = [];
            dataGlobal = null;
            return;
        }

        tablaHead.style.display = "";
        fetch(`../processes/ReportePuntoSaldo.php?roles=${roles.join(",")}`)
            .then(r => r.json())
            .then(data => {
                dataGlobal = data;
                renderTabla(data);
                if (chkEstad.checked) {
                    graficosCont.style.display = "block";
                    generarGraficos(data.usuarios);
                } else {
                    graficosCont.style.display = "none";
                    charts.forEach(c => c.destroy());
                    charts = [];
                }
            });
    }

    function renderTabla(data) {
        cuerpo.innerHTML = data.usuarios.map((u, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${u.nombres} ${u.apellidos}</td>
                <td>${u.correo}</td>
                <td>${u.total_puntos_acumulados}</td>
                <td>${u.total_puntos_gastados}</td>
                <td>${u.total_puntos_actuales}</td>
            </tr>
        `).join("");

        totalesDiv.innerHTML = `
            Total puntos acumulados: ${data.totales.acumulados}<br>
            Total puntos gastados: ${data.totales.gastados}<br>
            Total puntos actuales: ${data.totales.actuales}
        `;
    }

    function generarGraficos(usuarios) {
        charts.forEach(c => c.destroy());
        charts = [];

        const nombres = usuarios.map(u => `${u.nombres} ${u.apellidos}`);

        const crear = (id, label, datos) => {
            charts.push(new Chart(document.getElementById(id), {
                type: 'bar',
                data: { labels: nombres, datasets: [{ label, data: datos, backgroundColor: '#2478F0' }] },
                options: { indexAxis: 'y', responsive: true }
            }));
        };

        crear("grafAcumulados", "Grafico de barras de puntos acumulados", usuarios.map(u => u.total_puntos_acumulados));
        crear("grafGastados", "Grafico de barras de puntos gastados", usuarios.map(u => u.total_puntos_gastados));
        crear("grafActuales", "Grafico de barras de puntos actuales", usuarios.map(u => u.total_puntos_actuales));
    }

    document.getElementById("btnGenerarReporte").onclick = () => {
        const roles = [];
        if (chkEst.checked) roles.push("Estudiante");
        if (chkDoc.checked) roles.push("Docente");
        if (roles.length === 0) return;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const fechaActual = new Date().toLocaleString();

        // TABLA Y RESUMEN VERTICAL
        pdf.setFontSize(18);
        pdf.text("Reporte de puntos acumulados y canjeados", 105, 20, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text(`Fecha y hora: ${fechaActual}`, 105, 28, { align: 'center' });

        const cuerpoTabla = dataGlobal.usuarios.map((u, i) => [
            i + 1, `${u.nombres} ${u.apellidos}`, u.correo,
            u.total_puntos_acumulados, u.total_puntos_gastados, u.total_puntos_actuales
        ]);

        pdf.autoTable({
            head: [['#', 'Nombre y Apellido', 'Correo', 'Acumulados', 'Gastados', 'Actuales']],
            body: cuerpoTabla,
            startY: 35,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [36, 120, 240] }
        });

        const finalY = pdf.lastAutoTable.finalY || 35;

        pdf.text(`Total puntos acumulados: ${dataGlobal.totales.acumulados}`, 14, finalY + 10);
        pdf.text(`Total puntos gastados: ${dataGlobal.totales.gastados}`, 14, finalY + 18);
        pdf.text(`Total puntos actuales: ${dataGlobal.totales.actuales}`, 14, finalY + 26);

        // GRÁFICOS EN HOJAS HORIZONTALES, escalando correctamente
        if (chkEstad.checked) {
            charts.forEach(c => {
                pdf.addPage('l', 'a4'); // horizontal
                const canvas = c.canvas;
                const imgData = canvas.toDataURL("image/png");

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                const margin = 10;
                const imgWidth = pageWidth - 2 * margin;
                const imgHeight = imgWidth * canvas.height / canvas.width; // mantiene proporción

                pdf.setFontSize(16);
                pdf.text(c.config.data.datasets[0].label, pageWidth / 2, 10, { align: 'center' });
                pdf.addImage(imgData, 'PNG', margin, 15, imgWidth, imgHeight);
            });
        }

        pdf.save("Reporte_Puntos.pdf");
    };
}