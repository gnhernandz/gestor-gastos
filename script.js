// 1. Cargar datos de localStorage o iniciar la estructura base
const datosGuardados = localStorage.getItem("gastosSeptiembre");
const Septiembre = datosGuardados ? JSON.parse(datosGuardados) : {
  semana1: [],
  semana2: [],
  semana3: [],
  semana4: []
};

// 2. Función para registrar gastos y persistirlos
function operation(gasto, fecha, semana) {
  Septiembre[semana].push({ gasto, fecha });
  localStorage.setItem("gastosSeptiembre", JSON.stringify(Septiembre));
}

// 3. Función para eliminar un gasto individual
function eliminarGasto(semana, indice) {
  Septiembre[semana].splice(indice, 1);
  localStorage.setItem("gastosSeptiembre", JSON.stringify(Septiembre));
  actualizarPantalla();
}

// 4. Captura del formulario
const formulario = document.getElementById("form-gasto");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const gasto = Number(document.getElementById("gasto").value);
  const fecha = Number(document.getElementById("fecha").value);
  const semana = document.getElementById("semana").value;

  operation(gasto, fecha, semana);
  actualizarPantalla();
  formulario.reset();
});

// 5. Renderizado en el DOM con totales, desglose y botones de eliminar
function actualizarPantalla() {
  const contenedor = document.getElementById("contenedor-totales");
  const totalMesElemento = document.getElementById("total-mes");

  contenedor.innerHTML = "";
  let totalMensual = 0;

  for (let semana in Septiembre) {
    const listaGastos = Septiembre[semana];

    // Cálculo del total de la semana
    const totalSemana = listaGastos.reduce((acumulado, el) => acumulado + el.gasto, 0);
    totalMensual += totalSemana;

    const tarjetaSemana = document.createElement("div");
    tarjetaSemana.classList.add("tarjeta-semana");

    // Título de la semana
    const p = document.createElement("p");
    p.textContent = `Total en ${semana}: ${totalSemana} bs`;
    tarjetaSemana.appendChild(p);

    // Desglose de gastos con botón individual de borrar
    if (listaGastos.length > 0) {
      const listaUl = document.createElement("ul");

      for (let i = 0; i < listaGastos.length; i++) {
        const item = listaGastos[i];
        const li = document.createElement("li");
        li.textContent = `Día ${item.fecha}: $${item.gasto} `;

        const btnBorrar = document.createElement("button");
        btnBorrar.textContent = "❌";
        btnBorrar.style.cursor = "pointer";

        btnBorrar.addEventListener("click", function () {
          eliminarGasto(semana, i);
        });

        li.appendChild(btnBorrar);
        listaUl.appendChild(li);
        contenedor.appendChild(tarjetaSemana);
      }

      tarjetaSemana.appendChild(listaUl);
    }
  }

  totalMesElemento.textContent = totalMensual;
}

// 6. Carga inicial al abrir o recargar la página
actualizarPantalla();