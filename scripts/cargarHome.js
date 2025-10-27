// Obtener el id_rol_usuario de la URL
const params = new URLSearchParams(window.location.search);
const idRolUsuario = params.get('id_rol_usuario');

if (!idRolUsuario) {
  alert("No se ha recibido id_rol_usuario");
} else {
  fetch(`../processes/cargarHome.php?id_rol_usuario=${idRolUsuario}`)
    .then(response => response.json())
    .then(data => {
      const mainBox = document.querySelector('.main-box');
      mainBox.innerHTML = ''; // Limpiar contenido previo

      if (data.success) {
        const cursos = data.cursos;
        const cursosPorFila = 3;

        // Dividir cursos en filas
        for (let i = 0; i < cursos.length; i += cursosPorFila) {
          const fila = document.createElement('div');
          fila.classList.add('fila-cursos');
          fila.style.display = 'flex';
          fila.style.justifyContent = 'center';
          fila.style.gap = '15px';
          fila.style.marginBottom = '15px';
          fila.style.width = '100%';

          const cursosFila = cursos.slice(i, i + cursosPorFila);

          cursosFila.forEach(curso => {
            const cursoDiv = document.createElement('div');
            cursoDiv.classList.add('curso-rectangulo');
            cursoDiv.style.flex = '0 1 28%';  // Evita que se estire
            cursoDiv.style.maxWidth = '250px';
            cursoDiv.style.minWidth = '180px';
            cursoDiv.style.height = '120px'; // Altura uniforme

            // Contenido del curso
            cursoDiv.innerHTML = `
              <h3>${curso.nombre_curso}</h3>
              ${curso.progreso !== undefined ? `<p>Progreso: ${curso.progreso}%</p>` : ''}
            `;
            fila.appendChild(cursoDiv);
          });

          mainBox.appendChild(fila);
        }
      } else {
        mainBox.innerHTML = `<p>${data.mensaje}</p>`;
      }
    })
    .catch(err => console.error(err));
}
