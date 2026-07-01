const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');
const levelBoard = document.getElementById('levelBoard'); // NUEVO
const levelMessage = document.createElement("div");
const pauseButton = document.getElementById("pause");
const upButton = document.getElementById("up");
const downButton = document.getElementById("down");
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
levelMessage.id = "levelMessage";
document.body.appendChild(levelMessage);


// Game settings
const boardSize = 10; 
const levelSpeeds = [300, 250, 220, 200, 180];
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
    snakeHead: 3,
    snakeBody: 4,
    snakeTail: 5
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};


// Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;
let currentLevel; // NUEVO
let currentSpeed; // NUEVO


const drawSnake = () => {
    snake.forEach((square, index) => {
        let type = 'snakeBody'; // Por defecto es cuerpo

        if (index === snake.length - 1) {
            type = 'snakeHead'; // La punta es la cabeza
        } else if (index === 0) {
            type = 'snakeTail'; // El inicio es la cola
        }

        drawSquare(square, type);
    });
}


const drawSquare = (square, type) => {
    const [ row, column ] = square.split('');
    boardSquares[row] [column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    
    // Resetear el contenido y clases previas
    squareElement.innerHTML = ''; 
    squareElement.className = `square ${type}`;

    // Si es la cabeza, añadimos el contenedor para la lengua animada
    if (type === 'snakeHead') {
        const details = document.createElement('div');
        details.className = 'snakeHead-details';
        squareElement.appendChild(details);
    }

    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
       if(emptySquares.indexOf(square) !== -1) {
         emptySquares.splice(emptySquares.indexOf(square), 1);
       }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');


    if( newSquare < 0 || 
        newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column === '0') ||
        (direction === 'ArrowLeft' && column === '9') ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
    gameOver();
    } else {
      snake.push(newSquare);
      if(boardSquares[row] [column] === squareTypes.foodSquare) {
          addFood();
      } else { 
        const emptySquare = snake.shift();
        drawSquare(emptySquare, 'emptySquare');
       } 
       drawSnake();  
    }
}

const showLevelMessage = (level) => {

    console.log("Mostrando nivel:", level);

    const messages = {

        2: {
            emoji: "🎉",
            title: "¡EXCELENTE!",
            text: "PASASTE AL",
            level: "NIVEL 2"
        },

        3: {
            emoji: "🚀",
            title: "¡INCREÍBLE!",
            text: "YA ESTÁS EN EL",
            level: "NIVEL 3"
        },

        4: {
            emoji: "⚡",
            title: "¡FANTÁSTICO!",
            text: "LLEGASTE AL",
            level: "NIVEL 4"
        },

        5: {
            emoji: "👑",
            title: "¡ESPECTACULAR!",
            text: "ÚLTIMO DESAFÍO",
            level: "NIVEL 5"
        }

    };

    const msg = messages[level];

    levelMessage.innerHTML = `
        <div class="emoji">${msg.emoji}</div>

        <div class="title">
            ${msg.title}
        </div>

        <div class="subtitle">
            ${msg.text}
        </div>

        <div class="level">
            ${msg.level}
        </div>
    `;

    levelMessage.classList.add("show");

    setTimeout(() => {
        levelMessage.classList.remove("show");
    }, 2000);
}



const addFood = () => {

    score++;
    updateScore();

    // Si ganó el juego
    if (score >= 149) {
        showVictory();
        return;
    }

    const previousLevel = currentLevel;

    updateLevel();

    // Solo crear una nueva manzana si NO cambió de nivel
    if (previousLevel === currentLevel) {
        createRandomFood();
    }
}

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    document.removeEventListener('keydown', directionEvent);
    startButton.disabled = false;
}

const togglePause = () => {

    // No permitir pausar si aún no empezó
    if (!startButton.disabled) return;

    if (!isPaused) {

        clearInterval(moveInterval);

        document.removeEventListener('keydown', directionEvent);

        isPaused = true;

        pauseButton.innerHTML = "▶ Reanudar";

    } else {

        moveInterval = setInterval(moveSnake, currentSpeed);

        document.addEventListener('keydown', directionEvent);

        isPaused = false;

        pauseButton.innerHTML = "⏸ Pausar";

    }

}





const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction !== 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}


const mobileDirection = (newDirection) => {

    switch (newDirection) {

        case "ArrowUp":
            if (direction !== "ArrowDown") {
                direction = "ArrowUp";
            }
            break;

        case "ArrowDown":
            if (direction !== "ArrowUp") {
                direction = "ArrowDown";
            }
            break;

        case "ArrowLeft":
            if (direction !== "ArrowRight") {
                direction = "ArrowLeft";
            }
            break;

        case "ArrowRight":
            if (direction !== "ArrowLeft") {
                direction = "ArrowRight";
            }
            break;
    }
}








const createRandomFood = () => {
    const randomEmptySquare = emptySquares [Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const updateLevel = () => {

    // FINAL DEL JUEGO
    if (score >= 149) {
        showVictory();
        return;
    }

    const newLevel = Math.min(Math.floor(score / 30) + 1, 5);

    if (newLevel !== currentLevel) {

        currentLevel = newLevel;
        currentSpeed = levelSpeeds[currentLevel - 1];

        levelBoard.innerText = currentLevel;

        // Mostrar mensaje solo en niveles 2,3,4 y 5
        if (currentLevel > 1) {
            showLevelMessage(currentLevel);
        }

        clearInterval(moveInterval);

        snake = ['00','01','02','03'];
        direction = 'ArrowRight';

        boardSquares = Array.from(
            Array(boardSize),
            () => new Array(boardSize).fill(squareTypes.emptySquare)
        );

        board.innerHTML = "";
        emptySquares = [];

        createBoard();
        drawSnake();
        createRandomFood();

        setTimeout(() => {
            moveInterval = setInterval(moveSnake, currentSpeed);
        }, 2000);
    }
}


const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach( (column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
   })
}


const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;

    // Nivel inicial
    currentLevel = 1;
    currentSpeed = levelSpeeds[0];
    levelBoard.innerText = currentLevel;

    direction = 'ArrowRight';

    boardSquares = Array.from(
        Array(boardSize),
        () => new Array(boardSize).fill(squareTypes.emptySquare)
    );

    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}

const startGame = () => {

    // Reiniciar estado de pausa
    isPaused = false;
    pauseButton.innerHTML = "⏸ Pausar";

    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;

    drawSnake();
    updateScore();
    createRandomFood();

    document.removeEventListener('keydown', directionEvent);
    document.addEventListener('keydown', directionEvent);

    moveInterval = setInterval(moveSnake, currentSpeed);
}
const showVictory = () => {

    clearInterval(moveInterval);
    document.removeEventListener('keydown', directionEvent);

    levelMessage.innerHTML = `
        <div class="emoji">🏆</div>

        <div class="title">
            ¡FELICIDADES!
        </div>

        <div class="subtitle">
            HAS COMPLETADO EL JUEGO
        </div>

        <div class="level">
            FIN DEL JUEGO
        </div>

        <div class="score">
            PUNTAJE FINAL
            <br>
            <span>${score}</span>
        </div>

        <div class="subtitle" style="margin-top:25px">
            🎉 ¡ERES UN VERDADERO MAESTRO DEL SNAKE! 🎉
        </div>

        <button id="playAgain">
            🔄 JUGAR NUEVAMENTE
        </button>
    `;

    levelMessage.classList.add("show");

    startButton.disabled = false;

    document.getElementById("playAgain").onclick = () => {

        console.log("CLICK");
        levelMessage.classList.remove("show");
        startGame();
    };
}

const removeFood = () => {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (boardSquares[row][col] === squareTypes.foodSquare) {
                drawSquare(`${row}${col}`, 'emptySquare');
            }
        }
    }
}


startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);

// Controles para celular
upButton.addEventListener("click", () => mobileDirection("ArrowUp"));
downButton.addEventListener("click", () => mobileDirection("ArrowDown"));
leftButton.addEventListener("click", () => mobileDirection("ArrowLeft"));
rightButton.addEventListener("click", () => mobileDirection("ArrowRight"));

// Compatibilidad con pantallas táctiles
upButton.addEventListener("touchstart", e => {
    e.preventDefault();
    mobileDirection("ArrowUp");
});

downButton.addEventListener("touchstart", e => {
    e.preventDefault();
    mobileDirection("ArrowDown");
});

leftButton.addEventListener("touchstart", e => {
    e.preventDefault();
    mobileDirection("ArrowLeft");
});

rightButton.addEventListener("touchstart", e => {
    e.preventDefault();
    mobileDirection("ArrowRight");
});