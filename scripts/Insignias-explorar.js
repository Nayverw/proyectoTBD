export function mostrarExplorar({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");

  // 🔹 Limpiar contenido actual
  contenedor.innerHTML = "";
  contenedor.style.position = "relative";
  contenedor.style.display = "flex";
  contenedor.style.flexDirection = "column";
  contenedor.style.alignItems = "center";
  contenedor.style.justifyContent = "flex-start";
  contenedor.style.padding = "20px";

  // 🔹 Contenedor superior (botón y título)
  const headerDiv = document.createElement("div");
  headerDiv.style.display = "flex";
  headerDiv.style.alignItems = "center";
  headerDiv.style.justifyContent = "space-between";
  headerDiv.style.width = "100%";
  headerDiv.style.maxWidth = "800px";
  headerDiv.style.marginBottom = "15px";
  contenedor.appendChild(headerDiv);

  // 🔹 Botón Volver (esquina superior izquierda)
  const btnVolver = document.createElement("button");
  btnVolver.innerHTML = "← Volver";
  btnVolver.style.cssText = `
    background-color: #06B897;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  `;
  btnVolver.onmouseover = () => {
    btnVolver.style.backgroundColor = "#04a283";
    btnVolver.style.transform = "scale(1.05)";
  };
  btnVolver.onmouseout = () => {
    btnVolver.style.backgroundColor = "#06B897";
    btnVolver.style.transform = "scale(1)";
  };
  btnVolver.addEventListener("click", () => {
    import("./Insignias.js").then((module) => {
      module.mostrarContenido({ idRolUsuario, nombreUsuario });
    });
  });

  headerDiv.appendChild(btnVolver);

  // 🔹 Título centralizado
  const titulo = document.createElement("h2");
  titulo.textContent = "Insignias no obtenidas";
  titulo.style.flex = "1";
  titulo.style.textAlign = "center";
  titulo.style.color = "black";
  titulo.style.margin = "0";
  headerDiv.appendChild(titulo);

  // 🔹 Contenedor de tabla
  const tablaDiv = document.createElement("div");
  tablaDiv.style.width = "100%";
  tablaDiv.style.maxWidth = "800px";
  tablaDiv.style.overflowX = "auto";
  tablaDiv.style.padding = "10px";
  contenedor.appendChild(tablaDiv);

  // Mostrar "Cargando..."
  tablaDiv.innerHTML = `<p style="padding:20px; text-align:center;">Cargando insignias...</p>`;

  // 🔹 Obtener insignias no obtenidas
  fetch(`../processes/cargarInsigniasExplorar.php?idRolUsuario=${idRolUsuario}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        tablaDiv.innerHTML = `<p style="padding:20px; text-align:center;">No hay insignias disponibles para explorar.</p>`;
        return;
      }

      // 🔹 Contenedor externo con borde negro (para cubrir los bordes exteriores)
      let html = `
        <div style="border:2px solid black; border-radius:8px; overflow:hidden;">
          <table style="width:100%; border-collapse:collapse;">
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
      `;

      tablaDiv.innerHTML = html;
    })
    .catch((err) => {
      tablaDiv.innerHTML = `<p style="padding:20px; color:red; text-align:center;">Error al cargar las insignias: ${err}</p>`;
    });
}
