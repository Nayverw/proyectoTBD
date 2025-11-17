console.log("CanjearRecompensas.js cargado correctamente.");

export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  console.log("mostrarContenido ejecutado con:", { idRolUsuario, nombreUsuario });
  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <div id="contenedor2" style="
      width: 92%;
      min-height: 480px;
      background: white;
      margin: 25px auto;
      padding: 12px;
      border-radius: 14px;
      border: 2px solid #ddd;
      box-shadow: 0px 0px 6px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #247580;
    ">
      <div id="contenedor1" style="
        width: 100%;
        height: 50%;
        background: #13F2C8;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        white-space: nowrap;
      ">
        <p style="color:#555;">Cargando recompensas...</p>
      </div>

      <div id="contenedorInferior" style="
        width: 100%;
        height: calc(50% - 5px);
        padding: 18px;
        box-sizing: border-box;
        border-radius: 10px;
        background-color: #13F2C8;
        overflow-y: auto;
      ">
        <h3 style="color:white; margin:0;">No seleccionó ninguna Recompensa</h3>
      </div>
    </div>
  `;
  console.log("Fetch recompensas iniciado...");
  fetch(`../processes/CanjearRecompensas.php?id_rol_usuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(recompensas => {
      console.log("Recompensas recibidas:", recompensas);
      const cont1 = document.getElementById("contenedor1");
      cont1.innerHTML = "";

      if (!recompensas.length) {
        console.log("No hay recompensas disponibles.");
        cont1.innerHTML = `<p style="color:#444;">No hay recompensas disponibles.</p>`;
        return;
      }

      // Crear tarjetas superiores
      recompensas.forEach(r => {
        console.log("Procesando recompensa:", r);
        const item = document.createElement("div");
        item.dataset.idRecompensa = r.id_recompensa;

        item.style = `
          min-width: 120px;
          height: 120px;
          background: #B3FFFC;
          border-radius: 10px;
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
          <strong style="font-size:14px; color:black;">${r.nombre}</strong>
          <img src="${imagenSrc}" alt="${r.nombre}" 
            style="width:70px; height:70px; object-fit:cover; border-radius:5px;">
        `;

        cont1.appendChild(item);
      });

      // Selección de recompensa superior
      cont1.addEventListener("click", async (e) => {
        const item = e.target.closest("div[data-id-recompensa]");
        if (!item) return;

        const idRecompensa = item.dataset.idRecompensa;
        console.log("Recompensa seleccionada:", idRecompensa);
        const contInferior = document.getElementById("contenedorInferior");
        contInferior.innerHTML = "";

        try {
          console.log("Fetch obtenerRecompensa.php iniciado...");
          const res = await fetch(`../processes/obtenerRecompensa.php?id_recompensa=${idRecompensa}`);
          const r = await res.json();
          console.log("Detalle recompensa recibido:", r);
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
            <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
              
              <div style="flex-shrink:0; text-align:center;">
                <p style="font-weight:bold; font-size:16px; color:white;">Recompensa</p>
                <img src="${imagenSrc}" alt="${r.nombre}" 
                  style="width:90px; height:90px; object-fit:cover; border-radius:5px;">
              </div>

              <div style="flex-grow:1; color:white;">
                <p><strong>Nombre:</strong> ${r.nombre}</p>
                <p><strong>Precio:</strong> ${r.precio_puntos}</p>
                <p><strong>Descuento:</strong> ${r.descuento}%</p>

                <button id="btnCanjear" style="
                  background-color: #06B897;
                  color: white;
                  border: none;
                  border-radius: 20px;
                  padding: 10px 0;
                  font-size: 15px;
                  cursor: pointer;
                  transition: .2s;
                  width: 100%;
                " 
                onmouseover="this.style.backgroundColor='#04a283'; this.style.transform='scale(1.05)'"
                onmouseout="this.style.backgroundColor='#06B897'; this.style.transform='scale(1)'">
                  Canjear
                </button>
              </div>

            </div>
          `;

          // BOTÓN CANJEAR
          document.getElementById("btnCanjear").addEventListener("click", () => {
            console.log("Botón Canjear presionado");
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
                text-align: center;
                position: relative;
              ">
                <span id="cerrarModal" style="
                  position: absolute;
                  top: 10px;
                  right: 12px;
                  cursor: pointer;
                  font-size: 18px;
                  font-weight:bold;
                ">X</span>

                <p style="font-size:16px; margin-bottom:20px;">
                  ¿Estás seguro que deseas canjear <strong>${r.nombre}</strong> por 
                  <strong>${r.precio_puntos}</strong> puntos?
                </p>

                <div style="display:flex; gap:15px; justify-content:center;">

                  <button id="modalSi" style="
                    background-color: green;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight:bold;
                    cursor:pointer;
                  ">Si</button>

                  <button id="modalNo" style="
                    background-color: red;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight:bold;
                    cursor:pointer;
                  ">No</button>

                </div>
              </div>
            `;
            document.body.appendChild(modal);

            document.getElementById("cerrarModal").onclick = () => modal.remove();
            document.getElementById("modalNo").onclick = () => modal.remove();

            document.getElementById("modalSi").addEventListener("mouseover", e => e.target.style.transform = "scale(1.05)");
            document.getElementById("modalSi").addEventListener("mouseout", e => e.target.style.transform = "scale(1)");
            document.getElementById("modalNo").addEventListener("mouseover", e => e.target.style.transform = "scale(1.05)");
            document.getElementById("modalNo").addEventListener("mouseout", e => e.target.style.transform = "scale(1)");

            // SI CONFIRMA
            document.getElementById("modalSi").addEventListener("click", async () => {
              
              const formData = new FormData();
              formData.append("id_recompensa", r.id_recompensa);
              formData.append("id_rol_usuario", idRolUsuario);
              console.log("Botón Siiii precionado", r.id_recompensa, idRolUsuario);
              const resp = await fetch("../processes/recompensaOptenida.php", {
                method: "POST",
                body: formData
              });

              const data = await resp.json();
              console.log("Respuesta de recompensaOptenida.php:", data);
              if (data.estado === "ok") {
                modal.innerHTML = `
                  <div style="
                    background-color:#13F2C8;
                    padding:20px;
                    border-radius:12px;
                    width:350px;
                    color:white;
                    text-align:center;
                    position:relative;
                  ">
                    <span id="cerrarOk" style="
                      position:absolute;
                      top:10px;
                      right:12px;
                      cursor:pointer;
                      font-weight:bold;
                      font-size:18px;
                    ">X</span>

                    <p style="font-size:18px;">Canjeo de ${r.nombre} realizado con éxito</p>

                    <button id="btnCerrarOk" style="
                      background-color:#065f46;
                      color:white;
                      padding:10px 20px;
                      border:none;
                      border-radius:8px;
                      cursor:pointer;
                    ">Cerrar</button>
                  </div>
                `;
                document.getElementById("cerrarOk").onclick = () => modal.remove();
                document.getElementById("btnCerrarOk").onclick = () => modal.remove();
              }

              else if (data.estado === "insuficientes") {
                modal.innerHTML = `
                  <div style="
                    background-color:#13F2C8;
                    padding:20px;
                    border-radius:12px;
                    width:350px;
                    color:white;
                    text-align:center;
                    position:relative;
                  ">
                    <span id="cerrarIns" style="
                      position:absolute;
                      top:10px;
                      right:12px;
                      cursor:pointer;
                      font-weight:bold;
                      font-size:18px;
                    ">X</span>

                    <p style="font-size:18px;">❌ Puntos insuficientes</p>

                    <button id="btnCerrarIns" style="
                      background-color:red;
                      color:white;
                      padding:10px 20px;
                      border:none;
                      border-radius:8px;
                      cursor:pointer;
                    ">Cerrar</button>
                  </div>
                `;
                document.getElementById("cerrarIns").onclick = () => modal.remove();
                document.getElementById("btnCerrarIns").onclick = () => modal.remove();
              }

            });

          });

        } catch (err) {
          contInferior.innerHTML = `<p style="color:red;">Error cargando recompensa.</p>`;
          console.error(err);
          console.error("Error cargando recompensa:", err);
        }
      });

    })
    .catch(err => {
      document.getElementById("contenedor1").innerHTML =
        `<p style="color:red;">Error cargando recompensas.</p>`;
      console.error(err);
      console.error("Error cargando recompensas:", err);
    });
}