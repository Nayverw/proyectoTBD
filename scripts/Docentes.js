// C:\xampp\htdocs\proyectoTBD\scripts\Docentes.js

export async function mostrarContenido() {

  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <h2 style="text-align:center; color:#004444; margin-bottom:20px;">
      Docentes y Cursos Impartidos
    </h2>

    <div id="docentes-container" 
      style="
        width:100%;
        max-height:calc(100% - 60px);
        overflow-y:auto;
        padding:10px;
      ">
      <table style="width:100%; border-collapse:collapse; background:white;">
        <thead>
          <tr style="background:#06B897; color:white;">
            <th style="padding:10px;">Docente</th>
            <th style="padding:10px;">Curso</th>
            <th style="padding:10px;">Precio (puntos)</th>
          </tr>
        </thead>
        <tbody id="body-docentes"></tbody>
      </table>
    </div>
  `;

  const tbody = document.getElementById("body-docentes");

  try {

    const respuesta = await fetch("../processes/getDocentes.php");
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    let datos = await respuesta.json();
    console.log("DOCENTES RECIBIDOS:", datos);

    if (!Array.isArray(datos) || datos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding:20px;">No hay docentes registrados.</td>
        </tr>
      `;
      return;
    }

    datos.forEach(doc => {
      const fila = document.createElement("tr");
      fila.style = "border-bottom:1px solid #ccc;";

      fila.innerHTML = `
        <td style="padding:10px; color:#004444;">${doc.nombre_docente}</td>
        <td style="padding:10px; color:#444;">${doc.tipo_curso || "Sin cursos"}</td>
        <td style="padding:10px; color:#008800; font-weight:bold;">
          ${doc.preciopuntos !== null ? doc.preciopuntos : "-"}
        </td>
      `;

      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="color:red; text-align:center; padding:20px;">
          Error cargando docentes: ${error.message}
        </td>
      </tr>
    `;
  }
}
