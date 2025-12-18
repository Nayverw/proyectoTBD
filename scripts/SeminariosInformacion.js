console.log("SeminariosInformacion.js cargado correctamente.");

export function mostrarInformacionSeminario(idRolUsuario, idSeminario) {
  const contenedor = document.getElementById("contenido-central");

  // Limpia toda la pantalla
  contenedor.innerHTML = `
    <div id="infoSeminario" style="
      width: 78%;
      min-height: 360px;
      background: #5C62E6;
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

  // --- Consultar datos ---
  fetch(`../processes/SeminariosInformacion.php?id_rol_usuario=${idRolUsuario}&id_seminario=${idSeminario}`)
    .then(res => res.json())
    .then(data => {
      
      if (data.error) {
        document.getElementById("infoSeminario").innerHTML = `
          <h2 style="font-weight:bold;">Error</h2>
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

          <!-- BOTÓN VOLVER -->
          <button id="btnVolverSeminarios" 
            class="menu-btn" style="color:white">
            Volver
          </button>

          <!-- BOTÓN CANJEAR SOLO SI NO ESTÁ CANJEADO -->
          ${data.codigo === "No canjeado" ? `
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
          ` : ``}

        </div>
      `;

      // EVENTO BOTÓN VOLVER
      document.getElementById("btnVolverSeminarios").onclick = () => {
        import('./Seminarios.js')
          .then(module => module.mostrarContenido({ idRolUsuario }))
          .catch(console.error);
      };

      // EVENTO BOTÓN CANJEAR (vacío por ahora)
      const btnCanjear = document.getElementById("btnCanjearSeminario");
      if (btnCanjear) {
        btnCanjear.onclick = () => {
          console.log("Botón 'Canjear' presionado (sin función aún).");
        };
      }

    })
    .catch(err => {
      console.error("Error consultando seminario:", err);
    });
}