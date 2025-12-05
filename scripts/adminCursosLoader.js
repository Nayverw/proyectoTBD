adminCursosLoader.js

import { administrarCursos } from "./AdministrarCursos.js";

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-admiCursos");
    if (!btn) {
        console.error("No se encontr� el bot�n #btn-admiCursos");
        return;
    }

    btn.addEventListener("click", () => {
        administrarCursos.iniciar();
    });
});