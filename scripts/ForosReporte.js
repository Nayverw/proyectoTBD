// C:\xampp\htdocs\proyectoTBD\scripts\ForosReporte.js

export function mostrarReporteForo({ idRol, idForo, tituloForo }) {
    console.log("ForosReporte.js cargado correctamente");

    const contenedor = document.getElementById("contenido-central");

    contenedor.innerHTML = `
        <div id="reporteForoWrapper" style="
            width: 95%;
            margin: 20px auto;
            max-height: 85vh;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            border-radius: 15px;
            background: #f5f5f5;
        ">
            <div style="margin-bottom: 20px; text-align:left;">
                <button id="btnVolverReporte" style="
                    padding: 10px 20px;
                    border-radius: 20px;
                    border:none;
                    background: #90caf9;
                    color:white;
                    cursor:pointer;
                ">← Volver</button>

                <button id="btnExportPDF" style="
                    padding: 10px 20px;
                    border-radius: 20px;
                    border:none;
                    background: #4caf50;
                    color:white;
                    cursor:pointer;
                    margin-left: 10px;
                ">Exportar PDF</button>
            </div>

            <div id="contenidoReporte">
                <div id="titulosReporte" style="margin-bottom: 25px; text-align:center;">
                    <h2>Foro: ${tituloForo}</h2>
                    <h3>Estudiantes con mayor participación</h3>
                </div>

                <div style="margin-bottom: 15px; text-align:left;">
                    <p id="nombreDocente" style="font-size: 17px; margin-top: 5px;"></p>
                    <p style="font-size: 17px;">Fecha: ${new Date().toLocaleDateString()}</p>
                </div>

                <table id="tablaReporteForo" border="1" cellspacing="0" cellpadding="8" 
                    style="width:100%; border-collapse:collapse; background:white;">
                    <thead style="background:#bbdefb;">
                        <tr>
                            <th>Nro</th>
                            <th>Estudiante</th>
                            <th>Cantidad de Preguntas</th>
                            <th>Cantidad de Respuestas</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>

                <div id="totalesWrapper" style="margin-top:20px; text-align:left;">
                    <p id="totalPreguntas" style="font-size:17px;"></p>
                    <p id="totalRespuestas" style="font-size:17px;"></p>
                    <p id="totalParticipacion" style="font-size:17px;"></p>
                </div>
            </div>
        </div>
    `;

    // Botón volver
    document.getElementById("btnVolverReporte").onclick = () => {
        import("./ForosPreguntasDocente.js").then(mod => {
            mod.cargarPreguntasForo({ idRol, idForo, tituloForo });
        });
    };

    // Cargar nombre docente
    let nombreDocente = "";
    fetch(`../processes/ForosDocenteNombre.php?idRol=${idRol}`)
        .then(res => res.json())
        .then(data => {
            nombreDocente = data.nombre;
            document.getElementById("nombreDocente").textContent =
                `Nombre del docente: ${nombreDocente}`;
        });

    // Cargar tabla + totales
    let lista = [];
    let totalPreg = 0;
    let totalResp = 0;

    fetch(`../processes/ForosDocenteReporte.php?idForo=${idForo}`)
        .then(res => res.json())
        .then(data => {
            lista = data;
            const tbody = document.querySelector("#tablaReporteForo tbody");
            tbody.innerHTML = "";

            lista.forEach((item, index) => {
                const total = item.preguntas + item.respuestas;
                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.nombre}</td>
                        <td>${item.preguntas}</td>
                        <td>${item.respuestas}</td>
                        <td>${total}</td>
                    </tr>
                `;
                totalPreg += item.preguntas;
                totalResp += item.respuestas;
            });

            const totalParticipacion = totalPreg + totalResp;

            document.getElementById("totalPreguntas").textContent =
                `Total de preguntas realizadas: ${totalPreg}`;
            document.getElementById("totalRespuestas").textContent =
                `Total de respuestas realizadas: ${totalResp}`;
            document.getElementById("totalParticipacion").textContent =
                `Total de participación: ${totalParticipacion}`;
        });

    // Botón exportar PDF con jsPDF + AutoTable
    document.getElementById("btnExportPDF").onclick = () => {
        // Usando la referencia global del UMD de jsPDF
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.setFontSize(18);
        pdf.text(`Foro: ${tituloForo}`, 105, 20, { align: 'center' });
        pdf.setFontSize(14);
        pdf.text('Estudiantes con mayor participación', 105, 30, { align: 'center' });

        pdf.setFontSize(12);
        pdf.text(`Nombre del docente: ${nombreDocente}`, 20, 45);
        pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 55);

        const tableBody = lista.map((item, i) => [
            i + 1, item.nombre, item.preguntas, item.respuestas, item.preguntas + item.respuestas
        ]);

        pdf.autoTable({
            head: [['Nro', 'Estudiante', 'Preguntas', 'Respuestas', 'Total']],
            body: tableBody,
            startY: 65,
            styles: { fontSize: 11 },
            headStyles: { fillColor: [187, 222, 251] }
        });

        const finalY = pdf.lastAutoTable.finalY || 65;
        pdf.text(`Total de preguntas: ${totalPreg}`, 20, finalY + 10);
        pdf.text(`Total de respuestas: ${totalResp}`, 20, finalY + 20);
        pdf.text(`Total de participación: ${totalPreg + totalResp}`, 20, finalY + 30);

        pdf.save(`Reporte_Foro_${tituloForo}.pdf`);
    };
};