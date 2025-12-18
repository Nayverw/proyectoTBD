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
                flex-wrap: wrap;
                gap: 10px;
            }

            .filtros {
                display: flex;
                gap: 12px;
                align-items: center;
                font-weight: bold;
                flex-wrap: wrap;
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

            input[type="date"] {
                padding: 4px;
                border-radius: 6px;
            }
        </style>

        <div class="reporte-saldo-container">

            <div class="reporte-saldo-superior">
                <div>
                    <button id="btnVolver">← Volver</button>
                    <button id="btnGenerarReporte">📄 Generar Reporte</button>
                </div>

                <div class="filtros">
                    <label>
                        Inicial:
                        <input type="date" id="fechaInicial">
                    </label>

                    <label>
                        Final:
                        <input type="date" id="fechaFinal">
                    </label>

                    <label><input type="checkbox" id="chkEstudiante" checked> Estudiantes</label>
                    <label><input type="checkbox" id="chkDocente"> Docentes</label>
                    <label><input type="checkbox" id="chkEstadistica"> Estadística</label>
                </div>
            </div>

            <div class="reporte-titulo">
                Reporte de recompensas obtenidas por usuario
            </div>

            <div class="reporte-fecha">
                Fecha y hora: ${fechaActual}
            </div>

            <div class="tabla-scroll">
                <table id="tablaReportePDF">
                    <thead id="tabla-head">
                        <tr>
                            <th>Nro</th>
                            <th>Nombre y Apellido</th>
                            <th>Tipo</th>
                            <th>Cantidad de recompensas obtenidas</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-cuerpo"></tbody>
                </table>

                <div class="totales" id="totales"></div>

                <div id="graficos-contenedor" style="display:none;">
                    <div class="grafico">
                        <h3 style="text-align:center;">
                            Cantidad de recompensas obtenidas
                        </h3>
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
        import("./Reportes.js")
            .then(m => m.mostrarContenido({ idRolUsuario, nombreUsuario }));

    const chkEst = document.getElementById("chkEstudiante");
    const chkDoc = document.getElementById("chkDocente");
    const chkEstad = document.getElementById("chkEstadistica");
    const fechaInicial = document.getElementById("fechaInicial");
    const fechaFinal = document.getElementById("fechaFinal");

    chkEst.onchange = cargarReporte;
    chkDoc.onchange = cargarReporte;
    chkEstad.onchange = cargarReporte;
    fechaInicial.onchange = cargarReporte;
    fechaFinal.onchange = cargarReporte;

    cargarReporte();

    function cargarReporte() {
        const roles = [];

        if (chkEst.checked) roles.push("Estudiante");
        if (chkDoc.checked) roles.push("Docente");

        if (roles.length === 0) {
            cuerpo.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        Seleccione rol o roles
                    </td>
                </tr>
            `;
            totalesDiv.innerHTML = "";
            tablaHead.style.display = "none";
            limpiarGraficos();
            dataGlobal = null;
            return;
        }

        tablaHead.style.display = "";

        const params = new URLSearchParams();
        params.append("roles", roles.join(","));

        if (fechaInicial.value) params.append("fechaInicial", fechaInicial.value);
        if (fechaFinal.value) params.append("fechaFinal", fechaFinal.value);

        fetch(`../processes/ReporteRecompensaObtenida.php?${params.toString()}`)
            .then(r => r.json())
            .then(data => {
                dataGlobal = data.usuarios;
                renderTabla(data.usuarios);

                if (chkEstad.checked) generarGrafico(data.usuarios);
                else limpiarGraficos();
            });
    }

    function renderTabla(datos) {
        cuerpo.innerHTML = datos.map((u, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${u.nombres} ${u.apellidos}</td>
                <td>${u.tipo}</td>
                <td>${u.cantidad}</td>
            </tr>
        `).join("");

        const total = datos.reduce((s, u) => s + Number(u.cantidad), 0);
        totalesDiv.innerHTML = `Cantidad total de recompensas obtenidas: ${total}`;
    }

    function generarGrafico(datos) {
        limpiarGraficos();
        graficosCont.style.display = "block";

        charts.push(
            new Chart(document.getElementById("grafRecompensas"), {
                type: "bar",
                data: {
                    labels: datos.map(d => `${d.nombres} ${d.apellidos}`),
                    datasets: [{
                        label: "Cantidad de recompensas obtenidas",
                        data: datos.map(d => d.cantidad),
                        backgroundColor: "#2478F0"
                    }]
                },
                options: { responsive: true }
            })
        );
    }

    function limpiarGraficos() {
        graficosCont.style.display = "none";
        charts.forEach(c => c.destroy());
        charts = [];
    }

    document.getElementById("btnGenerarReporte").onclick = () => {
        if (!dataGlobal || dataGlobal.length === 0) return;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text(
            "Reporte de recompensas obtenidas por usuario",
            105,
            20,
            { align: "center" }
        );

        pdf.setFontSize(12);
        pdf.text(
            `Fecha y hora: ${fechaActual}`,
            105,
            28,
            { align: "center" }
        );

        let startY = 35;

        pdf.autoTable({
            head: [['Nro', 'Nombre y Apellido', 'Tipo', 'Cantidad']],
            body: dataGlobal.map((u, i) => [
                i + 1,
                `${u.nombres} ${u.apellidos}`,
                u.tipo,
                u.cantidad
            ]),
            startY
        });

        // 📊 SI ESTÁ MARCADO ESTADÍSTICA → AÑADIR GRÁFICA
        if (chkEstad.checked && charts.length > 0) {

            const canvas = document.getElementById("grafRecompensas");
            const imgData = canvas.toDataURL("image/png", 1.0);

            const finalY = pdf.lastAutoTable.finalY + 10;

            pdf.setFontSize(14);
            pdf.text("Gráfica estadística", 105, finalY, { align: "center" });

            pdf.addImage(
                imgData,
                "PNG",
                30,              // X
                finalY + 5,      // Y
                150,             // ancho
                80               // alto
            );
        }

        pdf.save("Reporte_Recompensas_Obtenidas.pdf");
    };

}