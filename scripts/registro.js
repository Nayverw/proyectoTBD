document.addEventListener("DOMContentLoaded", () => {
    const selectRol = document.getElementById("rol");
    const campoCodigo = document.getElementById("campoCodigo");

    // 1️⃣ Verificar si ya existe administrador
    fetch("../processes/verificarAdmin.php")
        .then(response => response.json())
        .then(data => {
            if (data.adminExistente) {
                const adminOption = selectRol.querySelector('option[value="Administrador"]');
                if (adminOption) {
                    adminOption.disabled = true; // deshabilitar
                    adminOption.textContent += " (Ya registrado)";
                }
            }
        })
        .catch(err => console.error("Error al verificar administrador:", err));

    // 2️⃣ Mostrar campo código solo para docentes
    selectRol.addEventListener("change", () => {
        if (selectRol.value === "Docente") {
            campoCodigo.style.display = "block";
        } else {
            campoCodigo.style.display = "none";
        }
    });
});
