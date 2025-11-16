console.log("Insignias-explorar.js cargado correctamente.");

export function mostrarExplorar({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");
  contenedor.innerHTML = `<p style="padding:20px;">Cargando insignias disponibles...</p>`;

  fetch(`../processes/cargarInsigniasExplorar.php?idRolUsuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(data => {

      // 🟢 Si NO existen insignias
      if (!Array.isArray(data) || data.length === 0) {
        contenedor.innerHTML = `
          <div style="padding:20px; text-align:center;">
            <p style="color:black; font-size:18px;">No existen insignias.</p>
            <button class="menu-btn" id="btn-volver">Volver</button>
          </div>
        `;

        document.getElementById("btn-volver").addEventListener("click", () => {
          import("./Insignias.js").then(mod =>
            mod.mostrarContenido({ idRolUsuario, nombreUsuario })
          );
        });

        return;
      }

      // 🟢 Si sí existen → tabla con mismo estilo que Insignias.js
      let html = `
        <div style="padding:10px;">
          <h2 style="text-align:center; color:black; margin-bottom:15px;">
            Insignias disponibles para obtener
          </h2>
          <div style="overflow-x:auto;">
            <table style="width:100%; min-width:600px; border:2px solid black; border-spacing:0; border-radius:8px;">
              <thead>
                <tr style="background-color:#06B897; color:white;">
                  <th style="padding:10px; border:1px solid black;">Nro</th>
                  <th style="padding:10px; border:1px solid black;">Rareza</th>
                  <th style="padding:10px; border:1px solid black;">Nombre</th>
                  <th style="padding:10px; border:1px solid black;">Descripción</th>
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

          <div style="margin-top:20px; text-align:center;">
            <button class="menu-btn" id="btn-volver">Volver</button>
          </div>
        </div>
      `;

      contenedor.innerHTML = html;

      document.getElementById("btn-volver").addEventListener("click", () => {
        import("./Insignias.js").then(mod =>
          mod.mostrarContenido({ idRolUsuario, nombreUsuario })
        );
      });

    })
    .catch(err => {
      contenedor.innerHTML = `<p style="padding:20px; color:red;">Error: ${err}</p>`;
    });
}
