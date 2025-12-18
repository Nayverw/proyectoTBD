export function mostrarContenido({ idRolUsuario, nombreUsuario }) {

    const contenedor = document.getElementById("contenido-central");
    let charts = [];
    let dataGlobal = null;

    const fechaActual = new Date().toLocaleString();

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
                overflow: hidden;
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

            .reporte-fecha {
                text-align: center;
                font-size: 0.95em;
                color: #555;
            }

            .tabla-scroll {
                max-height: 500px;
                overflow-y: auto;
                overflow-x: hidden;
                border-radius: 8px;
            }

            table {
                width: 100%;
                border: 2px solid black;
                border-spacing: 0;
                border-radius: 8px;
                background: white;
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

            <div class="reporte-titulo">Reporte de recompensas más canjeadas</div>
            <div class="reporte-fecha">Fecha y hora: ${fechaActual}</div>

            <div class="tabla-scroll">
                <table id="tablaReportePDF">
                    <thead id="tabla-head">
                        <tr>
                            <th>#</th>
                            <th>Nombre de la recompensa</th>
                            <th>Cantidad de canjes</th>
                            <th>Precio individual</th>
                            <th>Total de puntos usados</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-cuerpo"></tbody>
                </table>

                <div class="totales" id="totales"></div>

                <div id="graficos-contenedor" style="display:none;">
                    <div class="grafico">
                        <h3 style="text-align:center;">Total de puntos usados por recompensa</h3>
                        <canvas id="grafRecompensas"></canvas>
                    </div>
                </div>
            </div>

        </div>
    `;

    const cuerpo = document.getElementById("tabla-cuerpo");
    const totalesDiv = document.getElementById("totales");
    const graficosCont = document.getElementById("graficos-contenedor");
    const tablaHead = document.getElementById("tabla-head");

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
        const rolesReales = [];
        if (chkEst.checked) rolesReales.push("Estudiante");
        if (chkDoc.checked) rolesReales.push("Docente");

        if (rolesReales.length === 0) {
            cuerpo.innerHTML = `<tr><td colspan="5" style="text-align:center;">Seleccione rol o roles</td></tr>`;
            totalesDiv.innerHTML = "";
            tablaHead.style.display = "none";
            limpiarGraficos();
            dataGlobal = null;
            return;
        }

        tablaHead.style.display = "";

        fetch(`../processes/ReporteRecompensaCanjeada.php?roles=${rolesReales.join(",")}`)
            .then(r => r.json())
            .then(data => {
                dataGlobal = data.recompensas;
                renderTabla(data.recompensas);

                if (chkEstad.checked) {
                    generarGrafico(data.recompensas);
                } else {
                    limpiarGraficos();
                }
            });
    }

    function renderTabla(datos) {
        let totalCanjes = 0;
        let totalPuntos = 0;

        cuerpo.innerHTML = datos.map((r, i) => {
            totalCanjes += Number(r.cantidad);
            totalPuntos += Number(r.total_puntos);
            return `
                <tr>
                    <td>${i + 1}</td>
                    <td>${r.nombre}</td>
                    <td>${r.cantidad}</td>
                    <td>${r.precio}</td>
                    <td>${r.total_puntos}</td>
                </tr>
            `;
        }).join("");

        totalesDiv.innerHTML = `
            Cantidad total de canjes: ${totalCanjes}<br>
            Total de puntos gastados: ${totalPuntos}
        `;
    }

    function generarGrafico(datos) {
        limpiarGraficos();
        graficosCont.style.display = "block";

        charts.push(new Chart(document.getElementById("grafRecompensas"), {
            type: "bar",
            data: {
                labels: datos.map(d => d.nombre),
                datasets: [{
                    label: "Total de puntos usados",
                    data: datos.map(d => d.total_puntos),
                    backgroundColor: "#2478F0"
                }]
            },
            options: { responsive: true }
        }));
    }

    function limpiarGraficos() {
        graficosCont.style.display = "none";
        charts.forEach(c => c.destroy());
        charts = [];
    }

    // 🔹 Botón Generar PDF adaptado
    document.getElementById("btnGenerarReporte").onclick = () => {
        const rolesReales = [];
        if (chkEst.checked) rolesReales.push("Estudiante");
        if (chkDoc.checked) rolesReales.push("Docente");

        // Si no hay roles, no hacer nada
        if (!rolesReales.length || !dataGlobal) return;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        pdf.setFontSize(18);
        pdf.text("Reporte de recompensas más canjeadas", 105, 20, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text(`Fecha y hora: ${fechaActual}`, 105, 28, { align: 'center' });

        const cuerpoTabla = dataGlobal.map((r, i) => [
            i + 1, r.nombre, r.cantidad, r.precio, r.total_puntos
        ]);

        pdf.autoTable({
            head: [['#', 'Nombre de la recompensa', 'Cantidad de canjes', 'Precio individual', 'Total de puntos usados']],
            body: cuerpoTabla,
            startY: 35,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [36, 120, 240] }
        });

        const finalY = pdf.lastAutoTable.finalY || 35;

        const totalCanjes = dataGlobal.reduce((sum, r) => sum + Number(r.cantidad), 0);
        const totalPuntos = dataGlobal.reduce((sum, r) => sum + Number(r.total_puntos), 0);

        pdf.text(`Cantidad total de canjes: ${totalCanjes}`, 14, finalY + 10);
        pdf.text(`Total de puntos gastados: ${totalPuntos}`, 14, finalY + 18);

        // Agregar gráfico si está seleccionado
        if (chkEstad.checked && charts.length) {
            charts.forEach(c => {
                pdf.addPage('l', 'a4');
                const canvas = c.canvas;
                const imgData = canvas.toDataURL("image/png");

                const margin = 10;
                const pageWidth = pdf.internal.pageSize.getWidth();
                const imgWidth = pageWidth - 2 * margin;
                const imgHeight = imgWidth * canvas.height / canvas.width;

                pdf.setFontSize(16);
                pdf.text(c.config.data.datasets[0].label, pageWidth / 2, 10, { align: 'center' });
                pdf.addImage(imgData, 'PNG', margin, 15, imgWidth, imgHeight);
            });
        }

        pdf.save("Reporte_Recompensas.pdf");
    };
}