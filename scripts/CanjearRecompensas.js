console.log("CanjearRecompensas.js cargado correctamente.");

export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <!-- CONTENEDOR 2 (panel principal) -->
    <div id="contenedor2"
      style="
        width: 92%;
        height: 440px;
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
      "
    >

      <!-- CONTENEDOR 1 (recompensas – scroll horizontal) -->
      <div id="contenedor1"
        style="
          width: 100%;
          height: calc(50% - 10px);
          background: #e5ffe5;
          border-radius: 10px;
          border: 1px solid #c7e8c7;
          box-shadow: inset 0 0 4px rgba(0,0,0,0.1);

          margin-bottom: 10px;
          box-sizing: border-box;

          display: flex;
          align-items: center;
          gap: 12px;

          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;

          padding: 10px;
        "
      >
        <p style="padding-left: 10px; color: #555;">Cargando recompensas...</p>
      </div>

      <!-- Contenedor inferior -->
      <div id="contenedorInferior"
        style="
          width: 100%;
          height: calc(50% - 10px);
          padding: 15px;
          box-sizing: border-box;
          border-radius: 10px;
        "
      >
        <h3 style="color:#444; margin-top:0;">Zona inferior (V2)</h3>
      </div>

    </div>
  `;

  // ───────────────────────────────────────
  // 1. Cargar recompensas desde PHP
  // ───────────────────────────────────────

  fetch(`../processes/CanjearRecompensas.php?id_rol_usuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(recompensas => {
      const cont1 = document.getElementById("contenedor1");
      cont1.innerHTML = "";  // limpiar

      if (!recompensas.length) {
        cont1.innerHTML = `<p style="margin-left:10px; color:#444;">No hay recompensas disponibles.</p>`;
        return;
      }

      // ───────────────────────────────────────
      // 2. Crear visualización de cada recompensa
      // ───────────────────────────────────────
      recompensas.forEach(r => {
        const item = document.createElement("div");
        item.style = `
          min-width: 180px;
          height: 120px;
          background: white;
          border-radius: 10px;
          border: 1px solid #b7e5b7;
          box-shadow: 0 0 4px rgba(0,0,0,0.1);
          padding: 10px;

          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;

          white-space: normal;
        `;

        item.innerHTML = `
          <strong style="font-size:14px; color:#333;">${r.nombre}</strong>
          <div style="margin-top:6px; font-size:12px; color:#555;">
            Precio: <strong>${r.precio_puntos}</strong> pts <br>
            Desc: <strong>${r.descuento}%</strong>
          </div>
        `;

        cont1.appendChild(item);
      });

    })
    .catch(err => {
      console.error("Error cargando recompensas:", err);
      document.getElementById("contenedor1").innerHTML =
        `<p style="margin-left:10px; color:red;">Error cargando recompensas.</p>`;
    });
}