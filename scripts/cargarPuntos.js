// scripts/cargarPuntos.js
document.addEventListener("DOMContentLoaded", () => {
    const cuadradoPuntos = document.querySelector(".large-square");
    if (!cuadradoPuntos) return;

    // Tomar rol del usuario desde sessionStorage
    const rolUsuario = sessionStorage.getItem("rol_usuario"); // ESTUDIANTE / DOCENTE / ADMINISTRADOR

    if (rolUsuario === "ADMINISTRADOR") {
        // Ocultar el cuadrado para administradores
        cuadradoPuntos.style.display = "none";
        return; // no cargar puntos
    }

    // Si no es administrador, cargar los puntos
    const idRolUsuario = sessionStorage.getItem("id_rol_usuario");

    fetch(`../processes/obtenerPuntos.php?id=${idRolUsuario}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                cuadradoPuntos.textContent = "Error";
            } else {
                cuadradoPuntos.innerHTML = `
                    <h3 style="color:#004444; margin:0; font-size:32px; font-weight:bold; text-align:center;">
                        ${data.puntos_actuales}
                    </h3>
                    <p style="color:#004444; margin:0; font-size:14px; text-align:center;">Puntos</p>
                `;
            }
        })
        .catch(err => {
            console.error(err);
            cuadradoPuntos.textContent = "Error";
        });
});