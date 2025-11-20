// C:\xampp\htdocs\proyectoTBD\scripts\Ranking.js

export async function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");

  // Limpiar contenido y poner encabezado
  contenedor.innerHTML = `
    <h2 style="text-align:center; color:#004444; margin-bottom:20px;">
      Ranking de Usuarios (por puntos acumulados)
    </h2>

    <div id="ranking-container" 
      style="
        width: 100%;
        max-height: calc(100% - 60px); 
        overflow-y: auto;
        padding: 10px;
      ">
      <table id="ranking-table" style="width:100%; border-collapse: collapse; text-align: left; background:white;">
        <thead>
          <tr style="background-color:#06B897; color:white;">
            <th style="padding:10px;">#</th>
            <th style="padding:10px;">Nombre</th>
            <th style="padding:10px;">Puntos acumulados</th>
          </tr>
        </thead>
        <tbody id="ranking-body"></tbody>
      </table>
    </div>
  `;

  const rankingBody = document.getElementById("ranking-body");

  try {
    // Traer datos del backend
    const respuesta = await fetch(`../processes/getRanking.php?rol=${idRolUsuario}`);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} - ${respuesta.statusText}`);

    let datos = await respuesta.json();

    // Asegurarse de que datos sea un array
    if (!Array.isArray(datos)) {
      try {
        datos = JSON.parse(datos);
      } catch (e) {
        throw new Error("No se pudo parsear el JSON recibido del backend.");
      }
    }

    console.log("Datos recibidos del ranking:", datos);

    // Si hay usuarios
    if (datos.length > 0) {
      // Ordenar por total_puntos_acumulados DESC
      datos.sort((a, b) => (b.total_puntos_acumulados || 0) - (a.total_puntos_acumulados || 0));

      // Crear filas de la tabla
      datos.forEach((usuario, index) => {
        const fila = document.createElement("tr");
        fila.style = "border-bottom:1px solid #ddd; color:#004444;";
        fila.innerHTML = `
          <td style="padding:10px; color:#004444;">${index + 1}</td>
          <td style="padding:10px; color:#004444;">${usuario.nombre_completo}</td>
          <td style="padding:10px; color:#008800; font-weight:bold;">${usuario.total_puntos_acumulados}</td>
        `;
        rankingBody.appendChild(fila);
      });

    } else {
      // Si no hay usuarios
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td colspan="3" style="text-align:center; padding:20px; color:#004444;">
          No hay usuarios registrados.
        </td>
      `;
      rankingBody.appendChild(fila);
    }

  } catch (error) {
    rankingBody.innerHTML = `
      <tr>
        <td colspan="3" style="color:red; text-align:center; padding:20px;">
          Error al cargar el ranking: ${error.message}
        </td>
      </tr>
    `;
    console.error(error);
  }
}
