console.log("CanjearRecompensas.js cargado correctamente.");

export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <div id="contenedor2"
      style="
        width: 92%;
        min-height: 440px;
        max-height: 440px;   /* 🔥 evita deformación */
        background: white;
        margin: 25px auto;
        padding: 12px;
        border-radius: 14px;
        border: 2px solid #ddd;
        box-shadow: 0px 0px 6px rgba(0,0,0,0.1);

        display: flex;
        flex-direction: column;
        overflow: hidden;     /* 🔥 bloquea expansión */
        box-sizing: border-box;
      "
    >

      <div id="contenedor1"
        style="
          width: 100%;
          height: calc(50% - 10px);
          background: #e5ffe5;
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
          max-height: 100%;      /* 🔥 no crece vertical */
          flex: 0 0 auto;
        "
      >
        <p style="color:#555;">Cargando recompensas...</p>
      </div>

      <div id="contenedorInferior"
        style="
          width: 100%;
          height: calc(50% - 10px);
          padding: 15px;
          box-sizing: border-box;
          border-radius: 10px;
          overflow: auto;       /* 🔥 evita que crezca */
        "
      >
        <h3 style="color:#444; margin-top:0;">Zona inferior (V2)</h3>
      </div>

    </div>
  `;

  fetch(`../processes/CanjearRecompensas.php?id_rol_usuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(recompensas => {
      const cont1 = document.getElementById("contenedor1");
      cont1.innerHTML = "";

      if (!recompensas.length) {
        cont1.innerHTML =
          `<p style="color:#444;">No hay recompensas disponibles.</p>`;
        return;
      }

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

          flex-shrink: 0;   /* 🔥 evita crecimiento horizontal */
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
      document.getElementById("contenedor1").innerHTML =
        `<p style="color:red;">Error cargando recompensas.</p>`;
    });
}