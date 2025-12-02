// C:\xampp\htdocs\proyectoTBD\scripts\Foros.js

export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");
  console.log("id_rol_usuario recibido en Foros.js:", idRolUsuario);
  contenedor.innerHTML = `
    <div style="text-align:center; font-size:1.3em; color:#555; padding:40px;">
      Verificando rol del usuario...
    </div>
  `;

  // enviar id_rol_usuario a PHP
  fetch("../processes/ForosDetectar.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id_rol_usuario=${idRolUsuario}`
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        contenedor.innerHTML = `<div style="color:red; padding:40px;">${data.error}</div>`;
        return;
      }

      // según rol cargar archivo correspondiente
      if (data.rol === "Estudiante") {
        import("./ForosEstudiantes.js").then(mod => {
          mod.mostrarContenidoForo({
            idRol: data.idRolUsuario,
            nombreUsuario
          });
        });
      }
      else if (data.rol === "Docente") {
        import("./ForosDocentes.js").then(mod => {
          mod.mostrarContenidoForo({
            idRol: data.idRolUsuario,
            nombreUsuario
          });

        });
      }
      else {
        contenedor.innerHTML = `<div style="color:red; padding:40px;">Rol no reconocido.</div>`;
      }
    });
}