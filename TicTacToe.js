let currentPlayer = 'blue';
let waitingPlayer = 'red';
let pieceSize = 'medium';

let redPieces = {
    large: 3,
    medium: 3,
    small: 3
}

let bluePieces = {
    large: 3,
    medium: 3,
    small: 3
}

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const turn = document.getElementById('turn');

let randomStart = Math.floor(Math.random() * 2);

if (randomStart == 1) {
    currentPlayer = 'red';
    waitingPlayer = 'blue';
    turn.innerHTML = 'rojo';
}

cells.forEach(cell => {
    cell.addEventListener('click', cellClick);
});

fillDiv('blue');
fillDiv('red');

function swapSize(size) {
    pieceSize = size;
    highlightPick();
}

function checkPieces(cell) {
    if (currentPlayer == 'red') {

        if (pieceSize == 'small' && redPieces.small != 0 && !cell.classList.contains(currentPlayer)) {
            redPieces.small -= 1;
            return true;
        } else if (pieceSize == 'medium' && redPieces.medium != 0 && !cell.classList.contains(currentPlayer)) {
            redPieces.medium -= 1;
            return true;
        } else if (pieceSize == 'large' && redPieces.large != 0 && !cell.classList.contains(currentPlayer)) {
            redPieces.large -= 1;
            return true;
        } else {
            return false;
        }
    } else {

        if (pieceSize == 'small' && bluePieces.small != 0 && !cell.classList.contains(currentPlayer)) {
            bluePieces.small -= 1;
            return true;
        } else if (pieceSize == 'medium' && bluePieces.medium != 0 && !cell.classList.contains(currentPlayer)) {
            bluePieces.medium -= 1;
            return true;
        } else if (pieceSize == 'large' && bluePieces.large != 0 && !cell.classList.contains(currentPlayer)) {
            bluePieces.large -= 1;
            return true;
        } else {
            return false;
        }
    }
}

function fillPosition(cell) {

    if (cell.classList.contains(waitingPlayer)) {
        if (cell.classList.contains('small') && pieceSize != 'small' && checkPieces(cell)) {

            cell.classList.remove(waitingPlayer, 'small');
            cell.classList.add(currentPlayer, pieceSize);

            return true;
        } else if (cell.classList.contains('medium') && pieceSize == 'large' && checkPieces(cell)) {

            cell.classList.remove(waitingPlayer, 'medium');
            cell.classList.add(currentPlayer, pieceSize);

            return true;
        } else {
            return false;
        }

    } else if (checkPieces(cell) && !cell.classList.contains(currentPlayer)) {
        cell.classList.add(currentPlayer, pieceSize);
        return true;
    }
}

function cellClick(event) {
    const cell = event.target;

    let validMovement = fillPosition(cell);

    if (validMovement) {

        fillDiv(currentPlayer);

        if (checkWin()) {
            message.innerHTML = `El jugador ${currentPlayer} ha ganado!`;
        } else {
            currentPlayer = waitingPlayer;

            if (currentPlayer == 'blue') {
                waitingPlayer = 'red';
                turn.innerHTML = "azul";
            } else {
                waitingPlayer = 'blue';
                turn.innerHTML = "rojo"
            }

            highlightPick();
        }

    }
}

function checkWin() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let isWin = false;

    for (const line of lines) {
        const [a, b, c] = line;

        if (cells[a].classList.contains(currentPlayer) && cells[b].classList.contains(currentPlayer) && cells[c].classList.contains(currentPlayer)) {
            isWin = true;
        }
    }

    if (isWin) {
        cleanHighlight();
        document.getElementById('reset').style.display = 'block';
        cells.forEach(cell => cell.removeEventListener('click', cellClick));
    }

    return isWin;
}

function fillDiv(player) {
    document.getElementById(`${player}Large`).innerHTML = '';
    document.getElementById(`${player}Medium`).innerHTML = '';
    document.getElementById(`${player}Small`).innerHTML = '';

    for (let i = 0; i < (player === 'red' ? redPieces.large : bluePieces.large); i++) {
        document.getElementById(`${player}Large`).innerHTML += `<div class="large ${player}" onclick="swapSize('large')"></div>`;
    }
    for (let i = 0; i < (player === 'red' ? redPieces.medium : bluePieces.medium); i++) {
        document.getElementById(`${player}Medium`).innerHTML += `<div class="medium ${player}" onclick="swapSize('medium')"></div>`;
    }
    for (let i = 0; i < (player === 'red' ? redPieces.small : bluePieces.small); i++) {
        document.getElementById(`${player}Small`).innerHTML += `<div class="small ${player}" onclick="swapSize('small')"></div>`;
    }
}

function highlightPick() {
    cleanHighlight();
    if (pieceSize == 'large') {
        document.getElementById(`${currentPlayer}Large`).style.backgroundColor = '#CCCCCC';
    } else if (pieceSize == 'medium') {
        document.getElementById(`${currentPlayer}Medium`).style.backgroundColor = '#CCCCCC';
    } else {
        document.getElementById(`${currentPlayer}Small`).style.backgroundColor = '#CCCCCC';
    }
}

function cleanHighlight() {
    document.getElementById(`blueLarge`).style.backgroundColor = '';
    document.getElementById(`blueMedium`).style.backgroundColor = '';
    document.getElementById(`blueSmall`).style.backgroundColor = '';
    document.getElementById(`redLarge`).style.backgroundColor = '';
    document.getElementById(`redMedium`).style.backgroundColor = '';
    document.getElementById(`redSmall`).style.backgroundColor = '';

}

// ? La IA debe tener en cuenta todas las posibles jugadas, valorarlas y decir qué tal son, hacer la mejor
// * cells.forEach(if (checkCanFill) posibles.push({cell, piece}))
// * posibles.forEach(pensar)

function decide() { // ? Podría usar una matriz 3x3 para anotar los pesos de cada posicion o incluso un tensor 3x3x3 (3 columnas, 3 filas, 3 tamaños de pieza)
    // ! Combinaciones de victoria y demás variables

    const lines = [ // ? Lineas en las que se hace tateti
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let colors = ['red', 'blue'];

    let possibilities = [];

    let boardWeights = [ // ? Pesos de decision (Toma las mejores posiciones con puntos extra por defecto)
        [0.1, 0, 0.1],
        [0, 0.2, 0],
        [0.1, 0, 0.1]
    ];

    let flattenedArray = [];

    // ! Anota las posibles jugadas para realizar

    colors.forEach(color => { // ? Anota las posiciones donde debe bloquear o anotar
        for (const line of lines) {
            const [a, b, c] = line;

            let occupied = [];
            let empty = [];

            (cells[a].classList.contains(color)) ? occupied.push(a) : empty.push(a);
            (cells[b].classList.contains(color)) ? occupied.push(b) : empty.push(b);
            (cells[c].classList.contains(color)) ? occupied.push(c) : empty.push(c);

            if (occupied.length == 2) {
                if (color == 'blue') possibilities.push({ type: "block", empty: empty, occupied: occupied });
                else possibilities.push({ type: "use", empty: empty[0], occupied: occupied });
            }
        }
    });

    // ! Asignación de peso a cada casilla (Sin considerar tamaño de piezas)

    possibilities.forEach(play => { // ? Asignación de pesos sin considerar tamaño de pieza
        let cell = cells[play.empty];
        if (play.type === 'use') {
            // Asigna un peso positivo a la casilla que se debe usar para ganar
            const { row, col } = getRowAndColFromIndex(play.empty);
            boardWeights[row][col] += 1.5;
        } else if (play.type === 'block') {
            // Asigna un peso positivo a las casillas que bloquean la victoria del oponente
            const { row, col } = getRowAndColFromIndex(play.empty);

            if (!cell.classList.contains('red')) {
                play.occupied.forEach(cell => {
                    const { row, col } = getRowAndColFromIndex(cell);
                    boardWeights[row][col] += 0.7;
                })
                boardWeights[row][col] += 0.7;
            }
        }
    });

    // ! Creación de flattenedArray por si es necesario ver el valor de la casilla

    for (let i = 0; i < boardWeights.length; i++) {
        for (let j = 0; j < boardWeights[i].length; j++) {
            flattenedArray.push({ value: boardWeights[i][j], position: i * boardWeights[i].length + j });
        }
    }

    // ! Añadir ligero peso según si hay ficha del rival

    cells.forEach((cell, index) => {
        if (cell.classList.contains('blue')) {
            const row = Math.floor(index / 3);
            const col = index % 3;
            boardWeights[row][col] += 0.15;
            if (cell.classList.contains('large')) boardWeights[row][col] = 0;
        }
    });

    // ! Modificación de pesos de casillas según tamaño de pieza
    // * Si no tiene una pieza lo suficientemente grande para comer, que la casilla sea 0
    // * Si está bloqueando un próximo tateti, que use el tamaño más pequeño con el que el enemigo no pueda comer
    // * Si gana con ese movimiento, que use cualquiera que sirva

    const sortedPositions = sortArrayWithPositions(boardWeights);

    let checkedDouble = false;

    let doublePos = -1;

    for (const position of sortedPositions) {
        if (position == 4 && !cells[4].classList.contains('red') && !cells[4].classList.contains('large')) { // ? Revisa si jugar en medio
            console.log("Usar grande en medio");
            finished = true;
            break;
        }

        if (cells[position].classList.contains('blue')) { // ? Si el enemigo tiene una ficha ahí
            if (cells[position].classList.contains('medium')) {
                console.log('Grande: ', position);
                finished = true;
                break;
            } else if (cells[position].classList.contains('small') && flattenedArray[position] >= 1.4) {
                console.log('Grande: ', position);
                finished = true;
                break;
            } else if (cells[position].classList.contains('small')) {
                console.log("Mediano: ", position)
                finished = true;
                break;
            }
        } else if (!cells[position].classList.contains('red')) {
            
            // ! Verifica si es una posición para ganar
            let wins = false;
            
            possibilities.forEach(play => {
                if (play.type == 'use' && play.empty == position) {
                    console.log("Wins: ", position);
                    wins = true;
                }
            })

            if (wins) {
                finished = true;
                break;
            }

            // ! Verificar si es una posición de bloquear, si lo es usar mayor tamaño no comible por enemigo

            let blocks = false;
            possibilities.forEach(play => {
                if (play.type == 'block' && play.empty == position) {
                    console.log("Blocks: ", position);
                    blocks = true;
                }
            })
            if (blocks) {
                finished = true;
                break;
            }

            // ! Si nada se cumplió antes, entonces meter más lógica de "Si se pone una pieza acá se crean X casi tateti"
        
            let auxTable = crearTableroDesdeHTML();
        
            cells.forEach((cell, index) => {
                if (!cell.classList.contains('blue') && !cell.classList.contains('red')) {
                    const { row, col } = getRowAndColFromIndex(index);
                    if (tieneMultiplesAmenazas(auxTable, 1, row, col) && !checkedDouble) {
                        checkedDouble = true;
                        doublePos = index;
                        console.log('Jugar para doble en: ', index);
                    }
                }
            })
        }
    }


    console.log(boardWeights);
}

// ! Funciones auxiliares de la IA

function getRowAndColFromIndex(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { row, col };
}

function sortArrayWithPositions(arr2D) {
    const flattenedArray = [];

    for (let i = 0; i < arr2D.length; i++) {
        for (let j = 0; j < arr2D[i].length; j++) {
            flattenedArray.push({ value: arr2D[i][j], position: i * arr2D[i].length + j });
        }
    }

    flattenedArray.sort((a, b) => b.value - a.value); // Ordenar por valor de manera descendente

    const sortedPositions = flattenedArray.map(item => item.position);

    return sortedPositions;
}

function tieneMultiplesAmenazas(board, player, row, col) {
    // Copiar el tablero y colocar temporalmente la pieza en la posición especificada
    const tempBoard = board.map(row => row.slice());
    tempBoard[row][col] = player;

    // Verificar si la nueva pieza crea múltiples amenazas de victoria
    return (
        verificaAmenazas(tempBoard, player, row, col, 0, 1) >= 2 ||
        verificaAmenazas(tempBoard, player, row, col, 1, 0) >= 2 ||
        verificaAmenazas(tempBoard, player, row, col, 1, 1) >= 2 ||
        verificaAmenazas(tempBoard, player, row, col, 1, -1) >= 2
    );
}

function verificaAmenazas(board, player, row, col, dr, dc) {
    let count = 0;
    while (row >= 0 && row < board.length && col >= 0 && col < board[0].length && board[row][col] === player) {
        count++;
        row += dr;
        col += dc;
    }
    return count;
}

function crearTableroDesdeHTML() {
    const celdas = document.querySelectorAll('.cell'); // Selecciona todas las celdas con la clase .cell
    const tamano = Math.sqrt(celdas.length); // Calcula el tamaño del lado del tablero (asumiendo que sea un cuadrado)
    const tablero = [];

    let filaActual = [];
    celdas.forEach((celda, indice) => {
        const contenido = celda.classList.contains('blue') ? 2 : celda.classList.contains('red') ? 1 : 0;
        filaActual.push(contenido);

        // Verifica si hemos llenado una fila completa
        if ((indice + 1) % tamano === 0) {
            tablero.push(filaActual); // Agrega la fila al tablero
            filaActual = []; // Inicia una nueva fila
        }
    });

    return tablero;
}

// Ejemplo de uso
const tablero = crearTableroDesdeHTML();
console.log(tablero);

highlightPick();
decide();