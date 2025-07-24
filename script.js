const materias = [...]; // OMITIDO para brevedad. Copiar el JS completo aquí como en el mensaje anterior

let estadoMaterias = JSON.parse(localStorage.getItem("estadoMaterias")) || {};
const malla = document.getElementById("malla");
const template = document.getElementById("materia-template");

function guardarEstado() {
  localStorage.setItem("estadoMaterias", JSON.stringify(estadoMaterias));
}

function actualizarProgreso() {
  const total = materias.length;
  const aprobadas = materias.filter(m => estadoMaterias[m.nombre]).length;
  const porcentaje = Math.round((aprobadas / total) * 100);

  document.getElementById("barraProgreso").style.width = porcentaje + "%";
  document.getElementById("porcentajeTexto").textContent = `${porcentaje}%`;
}

function renderizar() {
  malla.innerHTML = "";
  const porSemestre = {};
  materias.forEach(m => {
    porSemestre[m.semestre] ||= [];
    porSemestre[m.semestre].push(m);
  });

  Object.keys(porSemestre).sort((a, b) => a - b).forEach(sem => {
    const columna = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${sem}`;
    columna.appendChild(titulo);

    porSemestre[sem].forEach(materia => {
      const clon = template.content.cloneNode(true);
      const div = clon.querySelector(".materia");
      const span = clon.querySelector(".nombre");
      const tooltip = clon.querySelector(".tooltip");

      span.textContent = materia.nombre;
      const aprobada = estadoMaterias[materia.nombre];
      const requisitosCumplidos = materia.requisitos.every(req => estadoMaterias[req]);

      if (aprobada) {
        div.classList.add("aprobada");
      } else if (!requisitosCumplidos && materia.requisitos.length > 0) {
        div.classList.add("bloqueada");
        tooltip.textContent = `Faltan: ${materia.requisitos.filter(req => !estadoMaterias[req]).join(", ")}`;
      }

      div.addEventListener("click", () => {
        if (div.classList.contains("bloqueada")) return;
        estadoMaterias[materia.nombre] = !estadoMaterias[materia.nombre];
        guardarEstado();
        renderizar();
      });

      columna.appendChild(clon);
    });

    malla.appendChild(columna);
  });

  actualizarProgreso();
}

document.getElementById("modoToggle").addEventListener("click", () => {
  document.body.classList.toggle("modo-oscuro");
});

document.getElementById("reiniciarBtn").addEventListener("click", () => {
  estadoMaterias = {};
  guardarEstado();
  renderizar();
});

renderizar();