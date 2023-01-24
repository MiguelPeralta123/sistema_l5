function leerExcel() {
  var input = document.getElementById("input");
  readXlsxFile(input.files[0]).then(function (data) {
    procesarInformacion(data);
  });
}

function procesarInformacion(data) {
  // Eliminando accesos denegados
  const registros = data.filter(function (data) {
    return data[9] !== "Acceso Denegado";
  });

  // Invirtiendo el orden del array
  registros.reverse();

  // Convirtiendo fecha de string a date
  for (let i = 0; i < registros.length - 1; i++) {
    let fecha = new Date(registros[i][0]);
    registros[i][0] = fecha;
  }

  // Creando un nuevo arreglo con numero de control, hora y si fue entrada/salida
  let newRegistros = [];
  for (let i = 0; i < registros.length - 1; i++) {
    newRegistros.push([registros[i][1], registros[i][0], registros[i][6]]);
  }

  calculandoHoras(newRegistros);
}

var noControl = [];
var datosGrafica = [];

// Datos para crear la gráfica
var dias = [];
var minutos = [];

function calculandoHoras(registros) {
  // Limpiar los arrays cada vez que se ejecute la aplicación
  var noControl = [];
  var datosGrafica = [];
  var dias = [];
  var minutos = [];

  /* Recorrer el arreglo y crear uno nuevo donde compare el numero de control. Si el nuevo registro es entrada y no hay otro con el mismo numero de control, lo guardamos.
  Si es entrada y ya hay un registro de entrada, lo reemplazamos con el nuevo.
  Si el nuevo registro es de salida y no hay ningún registro, lo ignoramos.
  Si es de salida y hay un registro de entrada, se hace la cuenta de cuanto tiempo estuvo la persona en el laboratorio y se eliminan los dos registros*/
  for (let i = 0; i < registros.length; i++) {
    // Añadiendo los días a un arreglo para la gráfica
    dias.push(registros[i][1].toString().substring(0, 10));
    let result = dias.filter((item, index) => {
      return dias.indexOf(item) === index;
    });
    dias = result;

    for (let j = 0; j < noControl.length; j++) {
      if (registros[i][0] == noControl[j][0]) {
        if (
          registros[i][2].substring(registros[i][2].length - 1) == "1" ||
          registros[i][2].substring(registros[i][2].length - 1) == "3"
        ) {
          noControl[j] = registros[i];
          continue;
        } else {
          // contar el tiempo que paso entre el registro de entrada y el de salida, guardar en un arreglo junto con la fecha
          let resta = registros[i][1].getTime() - noControl[j][1].getTime();

          /*console.log(
            `${noControl[j][0]} pasó ${Math.round(
              resta / (1000 * 60)
            )} en el laboratorio de sistemas el dia ${noControl[j][1]}`
          );*/

          // Añadimos el objeto {minutos, dia} al arreglo para crear la grafica
          datosGrafica.push({
            minutos: Math.round(resta / (1000 * 60)),
            dia: noControl[j][1],
          });
          continue;
        }
      }
    }
    if (
      registros[i][2].substring(registros[i][2].length - 1) == "1" ||
      registros[i][2].substring(registros[i][2].length - 1) == "3"
    ) {
      noControl.push(registros[i]);
    }
  }

  procesarDatosGrafica(dias, datosGrafica);
}

function procesarDatosGrafica(dias, datosGrafica) {
  for (let i = 0; i < datosGrafica.length; i++) {
    minutos.push({
      dia: datosGrafica[i].dia.toString().substring(0, 10),
      tiempo: datosGrafica[i].minutos,
    });
  }
  crearGrafica(dias, minutos);
}

var tiempo = [];

function crearGrafica(dias, minutos) {
  for (let i = 0; i < dias.length; i++) {
    for (let j = 0; j < minutos.length; j++) {
      if (dias[i] == minutos[j].dia) {
        tiempo.push(minutos[j].tiempo);
      } else {
        tiempo.push(0);
      }
    }
  }

  // Para crear la gráfica, vamos a usar los arrays dias y tiempo
  var grafica = document.getElementById("grafica");

  const usoLaboratorio = {
    label: "Minutos de uso del laboratorio L5",
    data: tiempo, // Debe tener la misma cantidad de valores que la cantidad de etiquetas
    backgroundColor: "rgba(54, 162, 235, 0.2)", // Color de fondo
    borderColor: "rgba(54, 162, 235, 1)", // Color del borde
    borderWidth: 1, // Ancho del borde
  };
  new Chart(grafica, {
    type: "line", // Tipo de gráfica
    data: {
      labels: dias,
      datasets: [usoLaboratorio],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  crearBotonImprimir()
}

function crearBotonImprimir() {
  var botonImprimir = document.getElementById("imprimir")
  botonImprimir.innerHTML = `<div></div><button class="botonImprimir boton" onclick="imprimirReporte()">Imprimir reporte</button>`
}

function imprimirReporte() {
  alert("Imprimiendo reporte")
}