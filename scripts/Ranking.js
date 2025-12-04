// C:\xampp\htdocs\proyectoTBD\scripts\Ranking.js

// Función para obtener el rol real de un usuario desde la base de datos
async function obtenerRolReal(idRolUsuario) {
  try {
    const res = await fetch(`../processes/obtenerRolReal.php?id_rol_usuario=${idRolUsuario}`);
    const data = await res.json();
    if (data.success) return data.id_rol;
    console.warn("No se pudo obtener el rol real, usando idRolUsuario del sessionStorage");
    return idRolUsuario;
  } catch (e) {
    console.error("Error al obtener rol real:", e);
    return idRolUsuario;
  }
}

export async function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");

  // Obtener rol real y definir título
  const idRolReal = await obtenerRolReal(idRolUsuario);
  let tituloRanking = "Ranking de Usuarios (por puntos acumulados)";
  if (idRolReal === 1) tituloRanking = "Ranking de Estudiantes (por puntos acumulados)";
  if (idRolReal === 2) tituloRanking = "Ranking de Docentes (por puntos acumulados)";

  contenedor.innerHTML = `
    <div id="ranking-wrapper" style="width:100%; max-width:950px; margin:0 auto; padding:20px; background:#ffffff; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
      <h2 style="text-align:center; color:black; margin-bottom:20px; font-size:26px; font-weight:bold;">
        ${tituloRanking}
      </h2>

      <div id="tabla-scroll" style="width:100%; max-height:420px; overflow-y:auto; border-radius:8px; overflow-x:hidden;">
        <table id="tablaRankingPDF" style="width:100%; min-width:600px; border:2px solid black; border-spacing:0; border-radius:8px; background:white;">
          <thead>
            <tr style="background-color:#2478F0; color:white;">
              <th style="padding:10px; border:1px solid black;">#</th>
              <th style="padding:10px; border:1px solid black;">Nombre</th>
              <th style="padding:10px; border:1px solid black;">Puntos acumulados</th>
            </tr>
          </thead>
          <tbody id="ranking-body"></tbody>
        </table>
      </div>

      <div style="text-align:center; margin-top:20px;">
        <button id="btn-reporte" class="menu-btn" style="color:white">📄 Generar Reporte</button>
      </div>
    </div>
  `;

  const rankingBody = document.getElementById("ranking-body");
  let lista = [];

  try {
    const respuesta = await fetch(`../processes/getRanking.php?rol=${idRolReal}`);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} - ${respuesta.statusText}`);

    let datos = await respuesta.json();
    if (!Array.isArray(datos)) datos = JSON.parse(datos);

    lista = datos;

    // Ordenar por más puntos
    lista.sort((a, b) => (b.total_puntos_acumulados || 0) - (a.total_puntos_acumulados || 0));

    if (lista.length > 0) {
      lista.forEach((usuario, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td style="padding:8px; border:1px solid black;">${index + 1}</td>
          <td style="padding:8px; border:1px solid black; word-break:break-word;">${usuario.nombre_completo}</td>
          <td style="padding:8px; border:1px solid black; font-weight:bold;">${usuario.total_puntos_acumulados}</td>
        `;
        rankingBody.appendChild(fila);
      });
    } else {
      rankingBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding:20px; border:1px solid black;">No hay usuarios registrados.</td>
        </tr>
      `;
    }
  } catch (error) {
    rankingBody.innerHTML = `
      <tr>
        <td colspan="3" style="color:red; text-align:center; padding:20px; border:1px solid black;">
          Error al cargar el ranking: ${error.message}
        </td>
      </tr>
    `;
    console.error(error);
  }

  // -----------------------------
  // GENERAR REPORTE PDF
  // -----------------------------
  document.getElementById("btn-reporte").onclick = () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.setFontSize(18);
    pdf.text(tituloRanking, 105, 20, { align: 'center' });

    const fechaActual = new Date().toLocaleString();
    pdf.setFontSize(12);
    pdf.text(`Fecha y hora: ${fechaActual}`, 20, 30);

    // Construcción tabla PDF
    const cuerpoTabla = lista.map((item, index) => [
      index + 1,
      item.nombre_completo,
      item.total_puntos_acumulados
    ]);

    pdf.autoTable({
      head: [['#', 'Nombre', 'Puntos acumulados']],
      body: cuerpoTabla,
      startY: 40,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [36, 120, 240] }
    });

    const finalY = pdf.lastAutoTable.finalY || 40;

    const totalPersonas = lista.length;
    const totalPuntos = lista.reduce((sum, u) => sum + (u.total_puntos_acumulados || 0), 0);

    const etiquetaCantidad = idRolReal === 1 ? "Cantidad de estudiantes:" : "Cantidad de docentes:";

    pdf.text(`${etiquetaCantidad} ${totalPersonas}`, 20, finalY + 15);
    pdf.text(`Cantidad de puntos totales: ${totalPuntos}`, 20, finalY + 25);

    pdf.save(`Reporte_Ranking_${idRolReal === 1 ? 'Estudiantes' : 'Docentes'}.pdf`);
  };
}