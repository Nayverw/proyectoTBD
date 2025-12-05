document.addEventListener("DOMContentLoaded", () => {
    const rolUsuario = sessionStorage.getItem("rol_usuario") || "";

    // Mostrar bot�n de bit�cora solo si es ADMIN
    if (rolUsuario.toUpperCase() === "ADMINISTRADOR") {
        const btn = document.getElementById("btn-bitacora");
        if (btn) btn.style.display = "block";
    }
});

