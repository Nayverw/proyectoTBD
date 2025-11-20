// scripts/GestionPuntos.js
export function mostrarContenido() {
    const contenedor = document.getElementById("contenido-central");

    contenedor.innerHTML = `
  <div style="width:100%; padding:20px;">
    <h2 style="color:#0a0a5c; margin-bottom:20px;">Gestión de Puntos</h2>
    
    <div id="puntos-container"
     style="
        display:flex; 
        gap:20px; 
        flex-wrap:wrap; 
        justify-content:center;
        max-height:50vh;          /* 👈 altura máxima visible */
        overflow-y:auto;          /* 👈 scroll vertical */
        padding-right:10px;       /* evita que el scroll tape contenido */
     ">


      <!-- PUNTOS GASTADOS -->
      <div id="card-gastados" 
           style="background:white; border-radius:12px; padding:20px;
           width:260px; text-align:center; 
           box-shadow:0 4px 10px rgba(0,0,0,0.15);">

        <h3 style="margin:0; color:#d9534f; font-size:20px;">Puntos Gastados</h3>
        <p id="puntos-gastados"
           style="font-size:40px; font-weight:800; color:#FF0000!important; margin-top:10px;">
          --
        </p>
      </div>

      <!-- PUNTOS ACTUALES -->
      <div id="card-actuales"
           style="background:white; border-radius:12px; padding:20px;
           width:260px; text-align:center; 
           box-shadow:0 4px 10px rgba(0,0,0,0.15);">

        <h3 style="margin:0; color:#06B897; font-size:20px;">Puntos Actuales</h3>
        <p id="puntos-actuales"
           style="font-size:40px; font-weight:800; color:#06B897; margin-top:10px;">
           --
        </p>
      </div>

      <!-- ⭐ PUNTOS ACUMULADOS ⭐ -->
      <div id="card-acumulados"
           style="background:white; border-radius:12px; padding:20px;
           width:260px; text-align:center; 
           box-shadow:0 4px 10px rgba(0,0,0,0.15);">

        <h3 style="margin:0; color:#0044aa; font-size:20px;">Puntos Acumulados</h3>
        <p id="puntos-acumulados"
           style="font-size:40px; font-weight:800; color:#0044aa; margin-top:10px;">
          --
        </p>
      </div>

    </div>

    <!-- MENSAJE -->
    <p id="puntos-msg" style="text-align:center; margin-top:20px; color:#555;"></p>

  </div>
`;



    const idRol = sessionStorage.getItem("id_rol_usuario");

    if (!idRol) {
        document.getElementById("puntos-msg").textContent =
            "No se encontró usuario. Inicia sesión nuevamente.";
        return;
    }

    cargarPuntos(idRol);
}

async function cargarPuntos(idRolUsuario) {
    const msg = document.getElementById("puntos-msg");
    msg.textContent = "Cargando datos...";

    try {
        const res = await fetch(
            `../processes/cargarGestionPuntos.php?idRolUsuario=${encodeURIComponent(idRolUsuario)}`
        );

        const data = await res.json();

        if (!data.success) {
            msg.textContent = data.error || "No se pudieron cargar los puntos.";
            return;
        }

        document.getElementById("puntos-gastados").textContent =
            data.total_puntos_gastados;

        document.getElementById("puntos-actuales").textContent =
            data.total_puntos_actuales;

        document.getElementById("puntos-acumulados").textContent =
    data.total_puntos_acumulados;


        msg.textContent = "";
    } catch (err) {
        console.error(err);
        msg.textContent = "Error de conexión.";
    }
}
