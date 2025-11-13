export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");
  contenedor.innerHTML = `<p style="padding:20px;">Cargando insignias...</p>`;

  fetch(`../processes/cargarInsigniasObtenidas.php?idRolUsuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        contenedor.innerHTML = `<p style="padding:20px;">No se han obtenido insignias aún.</p>`;
        return;
      }

      let html = `
        <div style="padding:10px;">
          <!-- Título -->
          <h2 style="text-align:center; color:black; margin-bottom:15px;">Todas tus insignias obtenidas</h2>

          <!-- Tabla de insignias -->
          <div style="overflow-x:auto;">
            <table style="width:100%; min-width:600px; border:2px solid black; border-spacing:0; border-radius:8px;">
              <thead>
                <tr style="background-color:#06B897; color:white;">
                  <th style="padding:10px; border:1px solid black;">Nro</th>
                  <th style="padding:10px; border:1px solid black;">Rareza</th>
                  <th style="padding:10px; border:1px solid black;">Nombre</th>
                  <th style="padding:10px; border:1px solid black;">Descripcion</th>
                </tr>
              </thead>
              <tbody>
      `;

      data.forEach((ins, index) => {
        html += `
          <tr>
            <td style="padding:8px; border:1px solid black; color:black;">${index + 1}</td>
            <td style="padding:8px; border:1px solid black; color:black;">${ins.rareza}</td>
            <td style="padding:8px; border:1px solid black; color:black;">${ins.nombre_insignia}</td>
            <td style="padding:8px; border:1px solid black; color:black; white-space: normal; word-break: break-word;">
              ${ins.descripcion}
            </td>
          </tr>
        `;
      });

      html += `
              </tbody>
            </table>
          </div>

          <!-- Botón explorar insignias -->
          <div style="margin-top:20px;">
            <button class="menu-btn" id="btn-explorar">Explorar insignias</button>
          </div>
        </div>
      `;

      contenedor.innerHTML = html;

      // Evento del botón para pasar al modo "explorar"
      document.getElementById("btn-explorar").addEventListener("click", () => {
        import("./Insignias-explorar.js").then(module => {
          module.mostrarExplorar({ idRolUsuario, nombreUsuario });
        });
      });

    })
    .catch(err => {
      contenedor.innerHTML = `<p style="padding:20px; color:red;">Error al cargar las insignias: ${err}</p>`;
    });
}
