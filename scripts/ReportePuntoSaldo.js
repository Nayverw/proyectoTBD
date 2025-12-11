export function mostrarContenido({ idRolUsuario, nombreUsuario }) {
  const contenedor = document.getElementById("contenido-central");

  contenedor.innerHTML = `
    <!-- Estilos locales para este reporte -->
    <style>
        .reporte-saldo-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding: 20px;
            box-sizing: border-box;
        }

        .reporte-saldo-superior {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            justify-content: center;
        }

        #btnVolver {
            padding: 10px 20px;
            border-radius: 20px;
            border:none;
            background: #64b5f6;
            color:white;
            cursor:pointer;
        }

        #btnGenerarReporte {
            padding: 10px 25px;
            border-radius: 20px;
            border:none;
            background:#42a5f5;
            color:white;
            cursor:pointer;
            font-size:16px;
        }

        .input-fecha {
            padding: 10px;
            width: 160px;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 14px;
        }

        #btnHistorico {
            padding: 10px 20px;
            border-radius: 20px;
            border:none;
            background:#64b5f6;
            color:white;
            cursor:pointer;
        }

        .reporte-saldo-inferior {
            text-align: center;
            font-size: 1.2em;
            color: #333;
            padding-top: 10px;
        }
    </style>

    <div class="reporte-saldo-container">

        <div class="reporte-saldo-superior">

            <button id="btnVolver">← Volver</button>

            <button id="btnGenerarReporte">📄 Generar Reporte</button>

            <span><strong>Inicial:</strong></span>
            <input type="date" class="input-fecha" id="fechaInicial">

            <span><strong>Final:</strong></span>
            <input type="date" class="input-fecha" id="fechaFinal">

            <button id="btnHistorico">Histórico</button>

        </div>

        <div class="reporte-saldo-inferior">
            Seleccione una fecha inicial y una fecha final
        </div>

    </div>
  `;

  // === BOTÓN VOLVER → Regresa al menú de Reportes.js ===
  document.getElementById("btnVolver").addEventListener("click", () => {
      import("./Reportes.js").then(mod => {
          mod.mostrarContenido({ idRolUsuario, nombreUsuario });
      });
  });
}