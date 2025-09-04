document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.querySelector("#game-board");
  const startButton = document.querySelector("#start-button");
  const width = 10; // Ancho del tablero en celdas
  const height = 20; // Alto del tablero
  let cells = [];
  let currentPosition = 4;
  let currentRotation = 0;
  let timerId = null;
  let random = 0;
  let currentTetromino = null;

  // Crear el tablero de juego (los divs de las celdas)
  function createBoard() {
    // Crear el tablero visible (200 celdas)
    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement("div");
      gameBoard.appendChild(cell);
    }

    // Crear la fila invisible en el fondo para la detección de colisiones
    for (let i = 0; i < width; i++) {
      const cell = document.createElement("div");
      cell.classList.add("taken");
      cell.style.display = "none";
      gameBoard.appendChild(cell);
    }

    // Actualizar la lista de celdas usando un selector más robusto
    cells = Array.from(document.querySelectorAll("#game-board div"));
  }

  // Definición de las piezas (Tetrominós) y sus rotaciones
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const jTetromino = [
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width + 1, width + 2, 2],
    [1, width + 1, width * 2 + 1, 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const sTetromino = [
    [width, width + 1, 1, 2],
    [0, width, width + 1, width * 2 + 1],
    [width, width + 1, 1, 2],
    [0, width, width + 1, width * 2 + 1],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
    jTetromino,
    sTetromino,
  ];
  const colors = ["L", "Z", "T", "O", "I", "J", "S"];

  // Función para generar una nueva pieza aleatoria
  function newPiece() {
    random = Math.floor(Math.random() * theTetrominoes.length);
    currentTetromino = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
  }

  // Dibujar la pieza en el tablero
  function draw() {
    currentTetromino.forEach((index) => {
      cells[currentPosition + index].classList.add(colors[random]);
    });
  }

  // Borrar la pieza del tablero
  function undraw() {
    currentTetromino.forEach((index) => {
      cells[currentPosition + index].classList.remove(colors[random]);
    });
  }

  // Mover la pieza hacia abajo
  function moveDown() {
    // Primero, verificamos si el siguiente movimiento hacia abajo resultará en una colisión.
    if (
      currentTetromino.some((index) =>
        cells[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      // Si hay colisión, la pieza ha aterrizado, la "fijamos" en su lugar.
      currentTetromino.forEach((index) =>
        cells[currentPosition + index].classList.add("taken")
      );

      // Ahora creamos una nueva pieza en la parte superior.
      currentRotation = 0;
      random = Math.floor(Math.random() * theTetrominoes.length);
      currentTetromino = theTetrominoes[random][currentRotation];
      currentPosition = 4;

      // Verificamos si el juego terminó (la nueva pieza choca con algo existente)
      if (
        currentTetromino.some((index) =>
          cells[currentPosition + index].classList.contains("taken")
        )
      ) {
        alert("Game Over");
        clearInterval(timerId);
        timerId = null;
      } else {
        // Si el juego continúa, dibujamos la nueva pieza
        draw();
      }

      checkRows(); // Verificamos si se completó alguna línea
    } else {
      // Si no hay colisión, simplemente movemos la pieza hacia abajo
      undraw();
      currentPosition += width;
      draw();
    }
  }

  // Mover la pieza a la izquierda, con límites
  function moveLeft() {
    undraw();
    const isAtLeftEdge = currentTetromino.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      currentTetromino.some((index) =>
        cells[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // Mover la pieza a la derecha, con límites
  function moveRight() {
    undraw();
    const isAtRightEdge = currentTetromino.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      currentTetromino.some((index) =>
        cells[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  // Rotar la pieza
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === currentTetromino.length) {
      // si la rotación llega a 4, volver a 0
      currentRotation = 0;
    }
    currentTetromino = theTetrominoes[random][currentRotation];
    // Evitar que rote fuera del tablero
    if (
      currentTetromino.some(
        (index) => (currentPosition + index) % width === 0
      ) &&
      currentTetromino.some(
        (index) => (currentPosition + index) % width === width - 1
      )
    ) {
      currentRotation = currentRotation > 0 ? currentRotation - 1 : 3;
      currentTetromino = theTetrominoes[random][currentRotation];
    }
    draw();
  }

  // Revisar si hay filas completas para eliminarlas
  function checkRows() {
    for (let i = 0; i < height * width; i += width) {
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
      if (row.every((index) => cells[index].classList.contains("taken"))) {
        row.forEach((index) => {
          cells[index].classList.remove("taken");
          cells[index].className = "cell"; // Limpiar todas las clases de color
        });
        const cellsRemoved = cells.splice(i, width);
        cells = cellsRemoved.concat(cells);
        cells.forEach((cell) => gameBoard.appendChild(cell));
      }
    }
  }
  // Controles del teclado
  function control(e) {
    if (!timerId) return;
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keydown", control);

  // Iniciar y pausar el juego
  startButton.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000); // La pieza baja cada segundo
    }
  });

  // Inicializar el juego
  createBoard();
  newPiece();
});
