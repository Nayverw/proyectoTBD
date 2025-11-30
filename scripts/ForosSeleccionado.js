// C:\xampp\htdocs\proyectoTBD\scripts\ForosSeleccionado.js

export function mostrarForoSeleccionado({ idRol, idForo }) {
    console.log("Mostrando foro seleccionado...", idForo, "Rol:", idRol);

    // AHORA LIMPIAMOS TODO EL CONTENIDO CENTRAL
    const contenedor = document.getElementById("contenido-central");

    contenedor.innerHTML = `
        <div style="
            width: 95%;
            margin: 25px auto;
            padding: 25px;
            background: white;
            border-radius: 15px;
            text-align: center;
            font-size: 20px;
            color: black;
            box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        ">
            <strong style="font-size:22px;">Aquí aparecerá el foro seleccionado</strong>
            <br><br>
            <p style="font-size:18px;">🧩 ID del foro: <b>${idForo}</b></p>
            <p style="font-size:18px;">👤 ID del rol usuario: <b>${idRol}</b></p>
        </div>
    `;
}