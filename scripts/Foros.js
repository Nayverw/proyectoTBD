// C:\xampp\htdocs\proyectoTBD\scripts\Foros.js
export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");
  contenedor.innerHTML = `
    <div style="text-align:center; font-size:1.5em; color:#333; padding:40px;">
      Lógica del botón <strong>Foros</strong> no implementada.<br>
      (Usuario: <em>${nombreUsuario}</em>)
    </div>
  `;
}
