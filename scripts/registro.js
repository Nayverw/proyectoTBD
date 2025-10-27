// ================================
// Mostrar/ocultar campo de código docente
// ================================
function mostrarCodigo() {
    const rol = document.getElementById('rol').value;
    const campo = document.getElementById('campoCodigo');
    campo.style.display = (rol === 'Docente') ? 'block' : 'none';
}

// ================================
// Mostrar mensaje flotante al enviar el formulario
// ================================
function mostrarMensaje(event) {
    event.preventDefault(); // Evita envío inmediato
    const mensaje = document.getElementById('mensaje-flotante');

    if (mensaje) {
        mensaje.style.display = 'block';
        mensaje.style.opacity = 1;
        mensaje.style.transition = "opacity 0.5s ease";
        mensaje.style.position = "fixed";
        mensaje.style.top = "20px";
        mensaje.style.left = "50%";
        mensaje.style.transform = "translateX(-50%)";
        mensaje.style.background = "#1f0cce";
        mensaje.style.color = "#fff";
        mensaje.style.padding = "15px 25px";
        mensaje.style.borderRadius = "10px";
        mensaje.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
        mensaje.style.fontWeight = "600";
        mensaje.style.zIndex = "1000";
    }

    // Esperar 2 segundos y luego enviar formulario
    setTimeout(() => {
        event.target.submit();
    }, 2000);
}

// ================================
// Inicializar eventos al cargar la página
// ================================
document.addEventListener("DOMContentLoaded", function() {
    mostrarCodigo();

    const form = document.getElementById("form-registro");
    const rolSelect = document.getElementById("rol");

    if (form) form.addEventListener("submit", mostrarMensaje);
    if (rolSelect) rolSelect.addEventListener("change", mostrarCodigo);
});
