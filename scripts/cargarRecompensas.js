fetch("../processes/cargarRecompensas.php")
  .then(res => res.json())
  .then(data => {
    const mainBox = document.querySelector(".main-box");
    mainBox.innerHTML = ""; // limpiar contenido

    if (data.success) {
      data.recompensas.forEach(r => {
        const card = document.createElement("div");
        card.classList.add("curso-rectangulo");
        card.innerHTML = `
          <h3>${r.nombre}</h3>
          <p>Tipo: ${r.nombre_tipo}</p>
          <p>Precio en puntos: ${r.precio_puntos}</p>
          ${r.descuento > 0 ? `<p>Descuento: ${r.descuento}%</p>` : ""}
          <button class="btn-canjear" data-id="${r.id_recompensa}">Canjear</button>
          <p class="mensaje"></p>
        `;
        mainBox.appendChild(card);
      });

      // Agregar eventos a todos los botones de canjear
      document.querySelectorAll(".btn-canjear").forEach(btn => {
        btn.addEventListener("click", () => {
          const idRecompensa = btn.dataset.id;

                 fetch("../processes/canjearRecompensa.php", {
                 method: "POST",
                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
                 body: `id_recompensa=${idRecompensa}`,
                credentials: "include" // 🔹 clave para XAMPP
                })

          .then(res => res.json())
          .then(resp => {
            const mensaje = btn.nextElementSibling;
            if (resp.success) {
              mensaje.textContent = "✅ Recompensa canjeada";
              mensaje.style.color = "green";
              btn.disabled = true;
            } else {
              mensaje.textContent = "❌ " + resp.mensaje;
              mensaje.style.color = "red";
            }
          })
          .catch(err => {
            console.error(err);
            alert("Error al canjear la recompensa");
          });
        });
      });

    } else {
      mainBox.innerHTML = `<p>${data.mensaje}</p>`;
    }
  })
  .catch(err => {
    console.error(err);
    document.querySelector(".main-box").innerHTML = "<p>Error al cargar las recompensas</p>";
  });
