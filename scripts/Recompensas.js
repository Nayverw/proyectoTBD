// scripts/Recompensas.js
export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");
  contenedor.innerHTML = `
    <div style="width:100%; padding:20px;">
      <h2 style="color:#0a0a5c; margin-bottom:10px;">Recompensas Canjeadas</h2>
      <div id="canjeadas-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:16px;"></div>
      <div id="canjeadas-msg" style="margin-top:16px; color:#333;"></div>
    </div>
  `;
  const idRol = sessionStorage.getItem("id_rol_usuario");

  if (!idRol) {
    document.getElementById("canjeadas-msg").textContent = "No se encontró usuario. Inicia sesión.";
    return;
  }
  cargarCanjeadas(idRol);

  async function cargarCanjeadas(idRolUsr) {
    try {
      const res = await fetch(`../processes/cargarRecompensasCanjeadas.php?idRolUsuario=${encodeURIComponent(idRolUsr)}`);
      const data = await res.json();
      const list = document.getElementById("canjeadas-list");
      const msg = document.getElementById("canjeadas-msg");
      list.innerHTML = "";
      msg.textContent = "";
      if (!data.success) {
        msg.textContent = data.error || "Error al cargar recompensas canjeadas.";
        return;
      }
      const rows = data.recompensas ?? [];
      if (!rows.length) {
        msg.textContent = "Aún no has canjeado recompensas.";
        return;
      }
      rows.forEach(r => {
        const card = document.createElement("div");
        card.style.background = "#fff";
        card.style.padding = "14px";
        card.style.borderRadius = "10px";
        card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
        card.innerHTML = `
          <h3 style="margin:0 0 8px 0; color:#0a0a5c;">${escapeHtml(r.nombre)}</h3>
          <p style="margin:0 0 6px 0; color:#333;">Precio: <strong>${r.precio_puntos} pts</strong></p>
          ${r.descuento ? `<p style="margin:0 0 6px 0; color:#d9534f;">Descuento: ${escapeHtml(r.descuento)}</p>` : ""}
          <p style="margin:0; color:#666; font-size:13px;">Canjeado: ${escapeHtml(r.fecha_usado)}</p>
        `;
        list.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      document.getElementById("canjeadas-msg").textContent = "Error de conexión.";
    }
  }

  function escapeHtml(text) {
    if (text === null || text === undefined) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
