console.log("SeminariosCanjear.js cargado correctamente.");

export function mostrarInformacionSeminarioCanjear(idRolUsuario, idSeminario) {
  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <div id="infoSeminario" style="
      width: 78%;
      min-height: 360px;
      background: #247580;
      margin: 25px auto;
      padding: 20px;
      border-radius: 14px;
      overflow: hidden;
      color: white;
      text-align: center;
    ">
      <h2 style="font-weight:bold; margin-bottom:15px;">Seminario</h2>
      <p style="font-size:18px;">Cargando información...</p>
    </div>
  `;

  fetch(`../processes/SeminariosInformacion.php?id_rol_usuario=${idRolUsuario}&id_seminario=${idSeminario}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        document.getElementById("infoSeminario").innerHTML = `
          <h2>Error</h2>
          <p>${data.error}</p>
        `;
        return;
      }

      const sem = data.seminario;

      document.getElementById("infoSeminario").innerHTML = `
        <h2 style="font-weight:bold; margin-bottom:10px;">Seminario</h2>

        <h3 style="font-size:22px; margin-bottom:15px;">${sem.nombre}</h3>

        <img src="../img/seminario.jpg" 
             style="width:150px; height:150px; border-radius:10px; object-fit:cover; margin-bottom:15px;">

        <p style="font-size:16px; margin-bottom:20px;">${sem.descripccion}</p>

        <p style="font-size:17px;">
          <span style="font-weight:bold;">Fecha:</span> ${sem.fecha}
        </p>

        <p style="font-size:17px; margin-top:10px;">
          <span style="font-weight:bold;">Código:</span> ${data.codigo}
        </p>

        <div style="margin-top: 25px; display:flex; justify-content:center; gap:15px;">
          <button id="btnVolverSeminarios" 
            style="
              background-color: #06B897;
              color: white;
              border: none;
              border-radius: 20px;
              padding: 10px 25px;
              font-size: 15px;
              cursor: pointer;
              transition: .2s;
            "
            onmouseover="this.style.backgroundColor='#04a283'; this.style.transform='scale(1.05)'"
            onmouseout="this.style.backgroundColor='#06B897'; this.style.transform='scale(1)'"
          >
            Volver
          </button>

          <!-- BOTÓN CANJEAR SIEMPRE VISIBLE -->
          <button id="btnCanjearSeminario"
            style="
              background-color: #06B897;
              color: white;
              border: none;
              border-radius: 20px;
              padding: 10px 25px;
              font-size: 15px;
              cursor: pointer;
              transition: .2s;
            "
            onmouseover="this.style.backgroundColor='#04a283'; this.style.transform='scale(1.05)'"
            onmouseout="this.style.backgroundColor='#06B897'; this.style.transform='scale(1)'"
          >
            Canjear
          </button>
        </div>
      `;

      // Botón volver
      document.getElementById("btnVolverSeminarios").onclick = () => {
        import('./Seminarios.js')
          .then(module => module.mostrarContenido({ idRolUsuario }))
          .catch(console.error);
      };

      // Botón canjear con modal de confirmación
      const btnCanjear = document.getElementById("btnCanjearSeminario");
      if (btnCanjear) {
        btnCanjear.onclick = () => {
          console.log("Botón 'Canjear' presionado, mostrando modal de confirmación");

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
                ¿Estás seguro que deseas canjear <strong>${sem.nombre}</strong> por 
                <strong>${data.codigo}</strong> puntos?
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

          // Cerrar modal
          document.getElementById("cerrarModal").onclick = () => modal.remove();
          document.getElementById("modalNo").onclick = () => modal.remove();

          // Animaciones hover
          document.getElementById("modalSi").addEventListener("mouseover", e => e.target.style.transform = "scale(1.05)");
          document.getElementById("modalSi").addEventListener("mouseout", e => e.target.style.transform = "scale(1)");
          document.getElementById("modalNo").addEventListener("mouseover", e => e.target.style.transform = "scale(1.05)");
          document.getElementById("modalNo").addEventListener("mouseout", e => e.target.style.transform = "scale(1)");

          // Confirmar canje
          document.getElementById("modalSi").addEventListener("click", async () => {
            const formData = new FormData();
            formData.append("id_rol_usuario", idRolUsuario);
            formData.append("id_seminario", idSeminario);
            console.log("llegamos hasta aqui si presionamos Si");
            const resp = await fetch("../processes/SeminariosCanjear.php", {
              method: "POST",
              body: formData
            });

            const respData = await resp.json();
            console.log("Respuesta del canje:", respData);

            if (respData.estado === "ok") {
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
                  <p style="font-size:18px;">Canje de ${sem.nombre} realizado con éxito</p>
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
              setTimeout(() => {
                import('./Seminarios.js')
                  .then(module => module.mostrarContenido({ idRolUsuario }))
                  .catch(console.error);
              }, 1500);

            } else if (respData.estado === "insuficientes") {
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
        };
      }

    })
    .catch(err => {
      console.error("Error consultando seminario:", err);
    });
}