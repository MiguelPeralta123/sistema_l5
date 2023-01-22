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
  registros.reverse()

  // Convirtiendo fecha de string a date
  for (let i = 0; i < registros.length -1; i++) {
    let fecha = new Date(registros[i][0])
    registros[i][0] = fecha
  }

  // Creando un nuevo arreglo con numero de control, hora y si fue entrada/salida
  let newRegistros = []
  for (let i = 0; i < registros.length -1; i++) {
    newRegistros.push([registros[i][1], registros[i][0], registros[i][6]])
  }

  calculandoHoras(newRegistros)
}

function calculandoHoras(registros) {
    /* Recorrer el arreglo y crear uno nuevo donde compare el numero de control. Si el nuevo registro es entrada y no hay otro con el mismo numero de control, lo guardamos.
    Si es entrada y ya hay un registro de entrada, lo reemplazamos con el nuevo.
    Si el nuevo registro es de salida y no hay ningún registro, lo ignoramos.
    Si es de salida y hay un registro de entrada, se hace la cuenta de cuanto tiempo estuvo la persona en el laboratorio y se eliminan los dos registros*/
}