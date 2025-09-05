document.addEventListener("DOMContentLoaded", () => {
  const tableroJuego = document.querySelector("#juego-board");
  const inicioButton = document.querySelector("#inicio-button");
  const ancho = 10;
  const alto = 20;
  let celdas = [];
  let posicionActual = 4;
  let rotacionActual = 0;
  let timerId = null;
  let random = 0;
  let tetrominoActual = null;

  function crearTablero() {
    for (let i = 0; i < ancho * alto; i++) {
      const celda = document.createElement("div");
      tableroJuego.appendChild(celda);
    }

    //Crear la fila invisible en el fondo para la detección de colisiones
    for (let i = 0; i < ancho; i++) {
      const celda = document.createElement("div");
      celda.classList.add("taken");
      celda.style.display = "none";
      tableroJuego.appendChild(celda);
    }

    celdas = Array.from(document.querySelectorAll("#juego-board div"));
  }

  const lTetromino = [
    [1, ancho + 1, ancho * 2 + 1, 2],
    [ancho, ancho + 1, ancho + 2, ancho * 2 + 2],
    [1, ancho + 1, ancho * 2 + 1, ancho * 2],
    [ancho, ancho * 2, ancho * 2 + 1, ancho * 2 + 2],
  ];

  const zTetromino = [
    [0, ancho, ancho + 1, ancho * 2 + 1],
    [ancho + 1, ancho + 2, ancho * 2, ancho * 2 + 1],
    [0, ancho, ancho + 1, ancho * 2 + 1],
    [ancho + 1, ancho + 2, ancho * 2, ancho * 2 + 1],
  ];

  const tTetromino = [
    [1, ancho, ancho + 1, ancho + 2],
    [1, ancho + 1, ancho + 2, ancho * 2 + 1],
    [ancho, ancho + 1, ancho + 2, ancho * 2 + 1],
    [1, ancho, ancho + 1, ancho * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, ancho, ancho + 1],
    [0, 1, ancho, ancho + 1],
    [0, 1, ancho, ancho + 1],
    [0, 1, ancho, ancho + 1],
  ];

  const iTetromino = [
    [1, ancho + 1, ancho * 2 + 1, ancho * 3 + 1],
    [ancho, ancho + 1, ancho + 2, ancho + 3],
    [1, ancho + 1, ancho * 2 + 1, ancho * 3 + 1],
    [ancho, ancho + 1, ancho + 2, ancho + 3],
  ];

  const jTetromino = [
    [1, ancho + 1, ancho * 2 + 1, ancho * 2],
    [ancho, ancho + 1, ancho + 2, 2],
    [1, ancho + 1, ancho * 2 + 1, 2],
    [ancho, ancho * 2, ancho * 2 + 1, ancho * 2 + 2],
  ];

  const sTetromino = [
    [ancho, ancho + 1, 1, 2],
    [0, ancho, ancho + 1, ancho * 2 + 1],
    [ancho, ancho + 1, 1, 2],
    [0, ancho, ancho + 1, ancho * 2 + 1],
  ];

  const Tetrominos = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
    jTetromino,
    sTetromino,
  ];
  const colores = ["L", "Z", "T", "O", "I", "J", "S"];

  //Función para generar una nueva pieza aleatoria
  function nuevaPieza() {
    random = Math.floor(Math.random() * Tetrominos.length);
    tetrominoActual = Tetrominos[random][rotacionActual];
    posicionActual = 4;
    dibujar();
  }

  //Dibujar la pieza en el tablero
  function dibujar() {
    tetrominoActual.forEach((index) => {
      celdas[posicionActual + index].classList.add(colores[random]);
    });
  }

  function desdibujar() {
    tetrominoActual.forEach((index) => {
      celdas[posicionActual + index].classList.remove(colores[random]);
    });
  }

  function moverAbajo() {
    //Primero, verificamos si el siguiente movimiento hacia abajo resultará en una colisión
    if (
      tetrominoActual.some((index) =>
        celdas[posicionActual + index + ancho].classList.contains("taken")
      )
    ) {
      //Si hay colisión, la pieza ha aterrizado, la "fijamos" en su lugar
      tetrominoActual.forEach((index) =>
        celdas[posicionActual + index].classList.add("taken")
      );

      //Ahora creamos una nueva pieza en la parte superior
      rotacionActual = 0;
      random = Math.floor(Math.random() * Tetrominos.length);
      tetrominoActual = Tetrominos[random][rotacionActual];
      posicionActual = 4;

      //Verificamos si el juego terminó
      if (
        tetrominoActual.some((index) =>
          celdas[posicionActual + index].classList.contains("taken")
        )
      ) {
        alert("Juego terminado");
        clearInterval(timerId);
        timerId = null;
      } else {
        dibujar();
      }

      checkFilas();
    } else {
      desdibujar();
      posicionActual += ancho;
      dibujar();
    }
  }

  //Mover la pieza a la izquierda, con límites
  function moverIzquierda() {
    desdibujar();
    const isAtLeftEdge = tetrominoActual.some(
      (index) => (posicionActual + index) % ancho === 0
    );
    if (!isAtLeftEdge) posicionActual -= 1;
    if (
      tetrominoActual.some((index) =>
        celdas[posicionActual + index].classList.contains("taken")
      )
    ) {
      posicionActual += 1;
    }
    dibujar();
  }

  //Mover la pieza a la derecha, con límites
  function moverDerecha() {
    desdibujar();
    const isAtRightEdge = tetrominoActual.some(
      (index) => (posicionActual + index) % ancho === ancho - 1
    );
    if (!isAtRightEdge) posicionActual += 1;
    if (
      tetrominoActual.some((index) =>
        celdas[posicionActual + index].classList.contains("taken")
      )
    ) {
      posicionActual -= 1;
    }
    dibujar();
  }

  //Rotar la pieza
  function rotar() {
    desdibujar();
    rotacionActual++;
    if (rotacionActual === tetrominoActual.length) {
      //si la rotación llega a 4, volver a 0
      rotacionActual = 0;
    }
    tetrominoActual = Tetrominos[random][rotacionActual];
    //Evitar que rote fuera del tablero
    if (
      tetrominoActual.some((index) => (posicionActual + index) % ancho === 0) &&
      tetrominoActual.some(
        (index) => (posicionActual + index) % ancho === ancho - 1
      )
    ) {
      rotacionActual = rotacionActual > 0 ? rotacionActual - 1 : 3;
      tetrominoActual = Tetrominos[random][rotacionActual];
    }
    dibujar();
  }

  //Revisar si hay filas completas para eliminarlas
  function checkFilas() {
    for (let i = 0; i < alto * ancho; i += ancho) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => celdas[index].classList.contains("taken"))) {
        row.forEach((index) => {
          celdas[index].classList.remove("taken");
          celdas[index].className = "celda"; //Limpiar todas las clases de color
        });
        const celdasRemoved = celdas.splice(i, ancho);
        celdas = celdasRemoved.concat(celdas);
        celdas.forEach((celda) => tableroJuego.appendChild(celda));
      }
    }
  }
  //Controles del teclado
  function control(e) {
    if (!timerId) return;
    if (e.keyCode === 37) {
      moverIzquierda();
    } else if (e.keyCode === 38) {
      rotar();
    } else if (e.keyCode === 39) {
      moverDerecha();
    } else if (e.keyCode === 40) {
      moverAbajo();
    }
  }
  document.addEventListener("keydown", control);

  //Iniciar y pausar el juego
  inicioButton.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      dibujar();
      timerId = setInterval(moverAbajo, 1000);
    }
  });

  //Inicializar el juego
  crearTablero();
  nuevaPieza();
});
