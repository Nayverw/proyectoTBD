// C:\xampp\htdocs\proyectoTBD\scripts\Seminarios.js

export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  console.log("Seminarios.js cargado correctamente.", { idRolUsuario, nombreUsuario });

  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <div id="contenedorSeminarios" style="
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

      <h2 style="text-align:center; color:white; margin-bottom:15px;">
        Tus seminarios inscritos
      </h2>

      <!-- CONTENEDOR SUPERIOR -->
      <div id="contenedorSuperior" style="
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
        <p style="color:white;">Cargando seminarios inscritos...</p>
      </div>

      <h2 style="text-align:center; color:white; margin-bottom:15px;">
        Seminarios de tus cursos
      </h2>

      <!-- CONTENEDOR INFERIOR -->
      <div id="contenedorInferiorSeminarios" style="
        width: 100%;
        height: 50%;
        background: #13F2C8;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        white-space: nowrap;
      ">
        <p style="color:white;">Cargando seminarios disponibles...</p>
      </div>

    </div>
  `;

  // --- CARGA DEL CONTENEDOR SUPERIOR ---
  fetch(`../processes/SeminariosInscritos.php?id_rol_usuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(seminarios => {
      const contSup = document.getElementById("contenedorSuperior");
      contSup.innerHTML = "";

      if (!seminarios.length) {
        contSup.innerHTML = `<p style="color:white;">No tienes seminarios inscritos.</p>`;
        return;
      }

      seminarios.forEach(s => {
        const item = document.createElement("div");
        item.dataset.idSeminario = s.id_seminario;

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
        `;

        item.innerHTML = `
          <strong style="font-size:14px; color:black;">${s.nombre}</strong>
          <img src="../img/seminario.jpg" alt="${s.nombre}"
            style="width:70px; height:70px; object-fit:cover; border-radius:5px;">
        `;

        contSup.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Error cargando seminarios:", err);
      document.getElementById("contenedorSuperior").innerHTML =
        `<p style="color:red;">Error cargando seminarios.</p>`;
    });

  // --- CARGA DEL CONTENEDOR INFERIOR (NUEVO) ---
  fetch(`../processes/SeminariosNoInscritos.php?id_rol_usuario=${idRolUsuario}`)
    .then(res => res.json())
    .then(lista => {
      const contInf = document.getElementById("contenedorInferiorSeminarios");
      contInf.innerHTML = "";

      if (!lista.length) {
        contInf.innerHTML = `<p style="color:white;">No hay seminarios disponibles.</p>`;
        return;
      }

      lista.forEach(s => {
        const item = document.createElement("div");
        item.dataset.idSeminario = s.id_seminario;

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
        `;

        item.innerHTML = `
          <strong style="font-size:14px; color:black;">${s.nombre}</strong>
          <img src="../img/seminario.jpg" alt="${s.nombre}"
            style="width:70px; height:70px; object-fit:cover; border-radius:5px;">
        `;

        contInf.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Error lista seminarios:", err);
      document.getElementById("contenedorInferiorSeminarios").innerHTML =
        `<p style="color:red;">Error cargando seminarios.</p>`;
    });

  document.addEventListener("click", function (e) {
    // Contenedor superior
    const itemSup = e.target.closest("#contenedorSuperior div");
    // Contenedor inferior
    const itemInf = e.target.closest("#contenedorInferiorSeminarios div");
    
    //Click en seminario inscrito
    if (itemSup && itemSup.dataset.idSeminario) {
      const idSeminario = itemSup.dataset.idSeminario;
      import("./SeminariosInformacion.js")
        .then(module => module.mostrarInformacionSeminario(idRolUsuario, idSeminario))
        .catch(console.error);
    }
    //Click en seminario no inscrito
    if (itemInf && itemInf.dataset.idSeminario) {
      const idSeminario = itemInf.dataset.idSeminario;
      import("./SeminariosCanjear.js")
        .then(module => module.mostrarInformacionSeminarioCanjear(idRolUsuario, idSeminario))
        .catch(console.error);
    }
  });

}