console.log("CanjearRecompensas.js cargado correctamente.");

export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <div id="contenedor2" style="
      width: 92%;
      min-height: 440px;
      max-height: 440px;
      background: white;
      margin: 25px auto;
      padding: 12px;
      border-radius: 14px;
      border: 2px solid #ddd;
      box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
      background-color: #247580;
    ">
      <div id="contenedor1" style="
        width: 100%;
        height: calc(50% - 10px);
        background: #13F2C8;
        border-radius: 10px;
        border: 1px solid #c7e8c7;
        margin-bottom: 10px;
        padding: 10px;
        box-shadow: inset 0 0 4px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        max-width: 100%;
        max-height: 100%;
        flex: 0 0 auto;
      ">
        <p style="color:#555;">Cargando recompensas...</p>
      </div>

      <div id="contenedorInferior" style="
        width: 100%;
        height: calc(50% - 10px);
        padding: 15px;
        box-sizing: border-box;
        border-radius: 10px;
        overflow: auto;
        background-color: #13F2C8;
      ">
        <h3 style="color:white; margin-top:0;">No selecciono ninguna Recompensa</h3>
      </div>
    </div>
  `;

  fetch(`../processes/CanjearRecompensas.php?id_rol_usuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(recompensas => {
      const cont1 = document.getElementById("contenedor1");
      cont1.innerHTML = "";

      if (!recompensas.length) {
        cont1.innerHTML = `<p style="color:#444;">No hay recompensas disponibles.</p>`;
        return;
      }

      recompensas.forEach(r => {
        const item = document.createElement("div");
        item.dataset.idRecompensa = r.id_recompensa;

        item.style = `
          min-width: 120px;
          height: 120px;
          background: #B3FFFC;
          border-radius: 10px;
          border: 1px solid #b7e5b7;
          box-shadow: 0 0 4px rgba(0,0,0,0.1);
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          flex-shrink: 0;
          cursor: pointer;
        `;

        let imagenSrc = "";
        switch (parseInt(r.id_tipo_recompensa)) {
          case 1: imagenSrc = "../img/descuento.jpg"; break;
          case 2: imagenSrc = "../img/certificado.jpg"; break;
          case 3: imagenSrc = "../img/seminario.jpg"; break;
          case 4: imagenSrc = "../img/regalo.jpg"; break;
          default: imagenSrc = "../img/regalo.jpg";
        }

        item.innerHTML = `
          <strong style="font-size:14px; color:#333;">${r.nombre}</strong>
          <img src="${imagenSrc}" alt="${r.nombre}" style="width:70px; height:70px; margin-top:6px; object-fit:cover; border-radius:5px;">
        `;

        cont1.appendChild(item);
      });

      // Selección de recompensa
      cont1.addEventListener("click", async (e) => {
        const item = e.target.closest("div[data-id-recompensa]");
        if (!item) return;

        const idRecompensa = item.dataset.idRecompensa;
        const contInferior = document.getElementById("contenedorInferior");
        contInferior.innerHTML = "";

        try {
          const res = await fetch(`../processes/obtenerRecompensa.php?id_recompensa=${idRecompensa}`);
          const r = await res.json();
          if (!r.id_recompensa) {
            contInferior.innerHTML = `<p style="color:red;">Recompensa no encontrada.</p>`;
            return;
          }

          let imagenSrc = "";
          switch (parseInt(r.id_tipo_recompensa)) {
            case 1: imagenSrc = "../img/descuento.jpg"; break;
            case 2: imagenSrc = "../img/certificado.jpg"; break;
            case 3: imagenSrc = "../img/seminario.jpg"; break;
            case 4: imagenSrc = "../img/regalo.jpg"; break;
            default: imagenSrc = "../img/regalo.jpg";
          }

          contInferior.innerHTML = `
            <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap: wrap;">
              <div style="flex-shrink:0; text-align:center;">
                <p style="font-weight:bold; font-size:16px;">Recompensa</p>
                <img src="${imagenSrc}" alt="${r.nombre}" style="width:70px; height:70px; object-fit:cover; border-radius:5px;">
              </div>
              <div style="flex-grow:1;">
                <p><strong style="font-size:16px; color:black;">Nombre:</strong> ${r.nombre}</p>
                <p><strong style="font-size:16px; color:black;">Precio:</strong> ${r.precio_puntos}</p>
                <p><strong style="font-size:16px; color:black;">Descuento:</strong> ${r.descuento}%</p>
                <button id="btnCanjear" style="
                  background-color: #06B897;
                  color: white;
                  border: none;
                  border-radius: 20px;
                  padding: 10px 0;
                  font-size: 15px;
                  cursor: pointer;
                  transition: background-color 0.3s, transform 0.2s;
                  width: 100%;
                " onmouseover="this.style.backgroundColor='#04a283'; this.style.transform='scale(1.05)';" 
                  onmouseout="this.style.backgroundColor='#06B897'; this.style.transform='scale(1)';"
                >Canjear</button>
              </div>
            </div>
          `;

          // Lógica del botón Canjear
          document.getElementById("btnCanjear").addEventListener("click", () => {
            // Crear modal
            const modal = document.createElement("div");
            modal.id = "modalConfirmacion";
            modal.style = `
              position: fixed;
              top: 0; left: 0;
              width: 100%; height: 100%;
              background-color: rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            `;
            modal.innerHTML = `
              <div style="
                background-color: #13F2C8;
                padding: 20px;
                border-radius: 12px;
                width: 350px;
                color: white;
                position: relative;
                text-align: center;
              ">
                <span id="cerrarModal" style="
                  position: absolute;
                  top: 10px;
                  right: 12px;
                  cursor: pointer;
                  font-weight: bold;
                  font-size: 18px;
                ">X</span>
                <p style="margin-bottom: 20px; font-size: 16px;">
                  Estas seguro que deseas canjear <strong>${r.nombre}</strong> por <strong>${r.precio_puntos}</strong> puntos?
                </p>
                <div style="display:flex; gap: 15px; justify-content: center;">
                  <button id="modalSi" style="
                    background-color: green;
                    color: white;
                    font-weight: bold;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s;
                  ">Si</button>
                  <button id="modalNo" style="
                    background-color: red;
                    color: white;
                    font-weight: bold;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s;
                  ">No</button>
                </div>
              </div>
            `;
            document.body.appendChild(modal);

            // Cerrar modal
            document.getElementById("cerrarModal").addEventListener("click", () => modal.remove());
            document.getElementById("modalNo").addEventListener("click", () => modal.remove());

            // Hover efecto botones
            document.getElementById("modalSi").addEventListener("mouseover", e => e.target.style.transform = "scale(1.05)");
            document.getElementById("modalSi").addEventListener("mouseout", e => e.target.style.transform = "scale(1)");
            document.getElementById("modalNo").addEventListener("mouseover", e => e.target.style.transform = "scale(1.05)");
            document.getElementById("modalNo").addEventListener("mouseout", e => e.target.style.transform = "scale(1)");

            // Aquí se implementará la lógica del botón "Si"
            document.getElementById("modalSi").addEventListener("click", () => {
              console.log("Aún no implementado: canjear recompensa");
              // modal.remove(); // opcional: cerrar modal tras acción
            });
          });

        } catch(err) {
          contInferior.innerHTML = `<p style="color:red;">Error cargando recompensa.</p>`;
          console.error(err);
        }
      });

    })
    .catch(err => {
      document.getElementById("contenedor1").innerHTML =
        `<p style="color:red;">Error cargando recompensas.</p>`;
      console.error(err);
    });
}
