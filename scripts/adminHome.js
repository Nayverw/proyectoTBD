// C:\xampp\htdocs\proyectoTBD\scripts\adminHome.js
document.addEventListener("DOMContentLoaded", () => {
    const idRolUsuario = sessionStorage.getItem("id_rol_usuario");
    const nombreUsuario = sessionStorage.getItem("nombre_usuario") || "Administrador";

    // ====== Mostrar saludo dinámico sobre el cuadrado blanco ======
    const textoSuperior = document.querySelector(".texto-superior p");
    if (textoSuperior) {
        textoSuperior.textContent = `Bienvenido Administrador: ${nombreUsuario}`;
    }

    // ====== BOTÓN CERRAR SESIÓN ======
    const btnCerrar = document.getElementById("btn-cerrar");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.href = "../index.html";
        });
    }

    // ====== HAMBURGUESAS ======
    const menuLeft = document.getElementById("menu-left");
    const menuRight = document.getElementById("menu-right");
    const hamburgerLeft = document.getElementById("hamburger-left");
    const hamburgerRight = document.getElementById("hamburger-right");

    hamburgerLeft.addEventListener("click", () => {
        menuLeft.style.left = menuLeft.style.left === "0px" ? "-300px" : "0px";
    });

    hamburgerRight.addEventListener("click", () => {
        menuRight.style.right = menuRight.style.right === "0px" ? "-300px" : "0px";
    });

    // ====== BOTONES DEL MENÚ ======
    const botones = {
        "btn-administrarCursos": "adm_cursos",
        "btn-administrarRecompensas": "AdministrarRecompensas",
        "btn-administrarAlumnos": "AdministrarAlumnos",
        "btn-administrarDocentes": "AdministrarDocentes",
        "btn-bitacoras": "Bitacoras",
        "btn-reportes": "Reportes"
    };

    Object.entries(botones).forEach(([idBoton, nombreModulo]) => {
        const boton = document.getElementById(idBoton);
        if (!boton) return;

        boton.addEventListener("click", async () => {
            try {
                const modulo = await import(`./${nombreModulo}.js`);
                if (typeof modulo.mostrarContenido === "function") {
                    modulo.mostrarContenido({ idRolUsuario, nombreUsuario });
                }
            } catch (error) {
                console.error(`Error al cargar el módulo ${nombreModulo}.js:`, error);
            }
        });
    });
});
