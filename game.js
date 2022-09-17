const movePlayerFunction = (event) => movePlayer(event);
const scoreNode = document.querySelector('#score');
const boardNode = document.querySelector('.board');
const pauseButtonNode = document.querySelector('.pause-button');
const resetButtonNode = document.querySelector('.reset-button');
const gameConfiguration = Object.freeze({
    gameIsRunning: false,
    IndexOfXCoordinate: 0,
    IndexOfYCoordinate: 1,
    score: 0,
    maxRandomAngle: 4,
    boardWidth: 670,
    boardHeight: 500,
    gapWidth: 10,
    rowHeight: 30,
    blockWidth: 100,
    blockHeight: 20,
    defaultMaxBlocks: 18,
    blocksPerRow: 6,
    playerPosition: [280, 470],
    playerXMovement: 25,
    ballPosition: [310, 430],
    ballXMovement: -2,
    ballYMovement: -2,
    ballDiameter: 40,
    ballRadius: 20,
    ballSpeed: 20,
    second: 0,
    minute: 0,
    hour: 0,
    colors: ['#78B07A', '#91B4E1', '#E1CE91', '#D691E1', '#CBE191']
});

let gameIsRunning;
let playerPosition;
let ballPosition;
let ballSpeed;
let ballXMovement;
let ballYMovement;
let second;
let minute;
let hour;
let score;
let blockCoordinates;
let timerId;
let ballId;
let player;
let ball;


// website initialization
function initPage() {
    pauseButtonNode.addEventListener('click', () => resetOrPauseGame(pauseOnly =  true));
    resetButtonNode.addEventListener('click', () => resetOrPauseGame(pauseOnly = false));
    console.log('Welcome to the Breakout Game!');
    console.log('A project by "Team Breakout"');
}


// game initialization
function initGame() {
    setDefaultValues();
    displayTime();
    displayScore();
    blockCoordinates = generateCoordinates();
    player = createPlayer();
    ball = createBall();
    createBlocks();
    document.addEventListener('keydown', movePlayerFunction);
}


// set the intervals on the first keypress
function startGame() {
    if (gameIsRunning === false) {
        timerId = setInterval(timer, 1000);
        ballId = setInterval(moveBall, ballSpeed);
        gameIsRunning = true;
    }
}


// stop the game
function stopGame() {
    if (gameIsRunning === true) {
        clearInterval(ballId);
        clearInterval(timerId);
        document.removeEventListener('keydown', movePlayerFunction);
        gameIsRunning = false;
    }
}


// reset or pause the game
function resetOrPauseGame(pauseOnly) {
    stopGame();
    if (pauseOnly === true) {
        document.addEventListener('keydown', movePlayerFunction);
    } else {
        removeElements(blocksOnly=false);
        initGame(pauseOnly);
    }
}


// set or reset values of the game
function setDefaultValues() {
    gameIsRunning = gameConfiguration.gameIsRunning;
    playerPosition = [...gameConfiguration.playerPosition];
    ballPosition = [...gameConfiguration.ballPosition];
    ballSpeed = gameConfiguration.ballSpeed;
    ballXMovement = gameConfiguration.ballXMovement;
    ballYMovement = gameConfiguration.ballYMovement;
    second = gameConfiguration.second;
    minute = gameConfiguration.minute;
    hour = gameConfiguration.hour;
    score = gameConfiguration.score;
}


// return an array containing the coordinates of all blocks
function generateCoordinates(maxBlocks = gameConfiguration.defaultMaxBlocks) {
    let coordinates = [];
    let leftSpace = 0;
    let counter = 0;
    while (counter < maxBlocks) {
        let row = Math.floor(counter / gameConfiguration.blocksPerRow);
        coordinates.push([leftSpace, gameConfiguration.rowHeight * row]);
        leftSpace = (counter % gameConfiguration.blocksPerRow) === gameConfiguration.blocksPerRow - 1 ? 0 : leftSpace + gameConfiguration.blockWidth + gameConfiguration.gapWidth;
        counter++;
    }
    return coordinates;
}


// generate a new row of blocks
function generateNewRow() {
    const blocks = Array.from(boardNode.childNodes);
    removeElements(blocksOnly=true);
    for (let coordinate of blockCoordinates) {
        coordinate[gameConfiguration.IndexOfYCoordinate] += gameConfiguration.rowHeight;
    }
    let newRow = generateCoordinates(gameConfiguration.blocksPerRow);
    blockCoordinates = newRow.concat(blockCoordinates);
    createBlocks();
}


// return a random number (random ball angle/ block color)
function generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


// return a random color for the blocks
function pickRandomColor() {
    let index = generateRandomNumber(0, gameConfiguration.colors.length);
    return gameConfiguration.colors[index];
}


// display the blocks on the board
function createBlocks() {
    for (let block of blockCoordinates) {
        const blockElement = document.createElement('div');
        let color = pickRandomColor();
        blockElement.classList.add('block');
        blockElement.style.backgroundColor = color;
        alignElement(blockElement, block);
        boardNode.appendChild(blockElement);
    }
}


// display the player on the board
function createPlayer() {
    const playerElement = document.createElement('div');
    playerElement.classList.add('player');
    alignElement(playerElement, playerPosition);
    boardNode.appendChild(playerElement);
    return playerElement;
}


// display the ball on the board
function createBall() {
    const ballElement = document.createElement('div');
    ballElement.classList.add('ball');
    ballElement.textContent = '🍩';
    alignElement(ballElement, ballPosition);
    boardNode.appendChild(ballElement);
    return ballElement;
}


// remove the elements (blocks/ ball/ player) from the screen
function removeElements(blocksOnly) {
    const blocks = Array.from(boardNode.childNodes);
    for (let block of blocks) {
        if (blocksOnly === true) {
            if (block.className != 'ball' && block.className != 'player') block.remove();
        } else {
            block.remove();
        }
    }
}


// move the player by pressing a key
function movePlayer(event) {
    switch (event.key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
            startGame();
            if (playerPosition[gameConfiguration.IndexOfXCoordinate] > 5) {
                playerPosition[gameConfiguration.IndexOfXCoordinate] -= gameConfiguration.playerXMovement;
                alignElement(player, playerPosition);
            }
            break;
        case 'd':
        case 'D':
        case 'ArrowRight':
            startGame();
            if (playerPosition[gameConfiguration.IndexOfXCoordinate] < (gameConfiguration.boardWidth - gameConfiguration.blockWidth - gameConfiguration.playerXMovement)) {
                playerPosition[gameConfiguration.IndexOfXCoordinate] += gameConfiguration.playerXMovement;
                alignElement(player, playerPosition);
            }
            break;
    }
}


// increase the ball speed at a certain score
function increaseBallSpeed() {
    if (score % 5 === 0 && ballSpeed > 5) {
        ballSpeed -= 3;
        ballId = changeIntervalDelay(ballId);
    }
}


// change the delay of an interval
function changeIntervalDelay(intervalId) {
    clearInterval(intervalId);
    return setInterval(moveBall, ballSpeed);
}


// change the direction of the ball
function changeDirection(randomAngle = false) {
    if (ballXMovement > 0 && ballYMovement < 0) {
        ballYMovement *= -1;
    } else if (ballXMovement > 0 && ballYMovement > 0) {
        ballXMovement = (randomAngle === true) ? generateRandomNumber(1, gameConfiguration.maxRandomAngle) * -1 : ballXMovement * -1;
    } else if (ballXMovement < 0 && ballYMovement > 0) {
        ballYMovement *= -1;
    } else {
        ballXMovement = (randomAngle === true) ? generateRandomNumber(1, gameConfiguration.maxRandomAngle) : ballXMovement * -1;
    }
}


// align an element on the board
function alignElement(element, elementPosition) {
    element.style.left = elementPosition[gameConfiguration.IndexOfXCoordinate] + 'px';
    element.style.top = elementPosition[gameConfiguration.IndexOfYCoordinate] + 'px';
}


// move the ball on the board
function moveBall() {
    ballPosition[gameConfiguration.IndexOfXCoordinate] += ballXMovement;
    ballPosition[gameConfiguration.IndexOfYCoordinate] += ballYMovement;
    alignElement(ball, ballPosition);
    checkForCollisions();
}


// check if the ball hits an element
function checkForCollisions() {
    for (let index = 0; index < blockCoordinates.length ; index++ ) {
        if (hitBlock(index)) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[index].classList.remove('block');
            blockCoordinates.splice(index, 1);
            score++;
            displayScore();
            checkIfPlayerWins(allBlocks);
            changeDirection();
            increaseBallSpeed();
        }
    }

    if (hitWall()) changeDirection();
    if (hitPlayer()) changeDirection(randomAngle = true);
    checkIfPlayerLooses();
}


// check if the ball hits a block
function hitBlock(index) {
    let ballXPosition = ballPosition[gameConfiguration.IndexOfXCoordinate] + gameConfiguration.ballRadius;
    let ballYPosition = ballPosition[gameConfiguration.IndexOfYCoordinate];
    let topLeftCornerYPosition = blockCoordinates[index][gameConfiguration.IndexOfYCoordinate];
    let bottomLeftCornerXPosition = blockCoordinates[index][gameConfiguration.IndexOfXCoordinate];
    let bottomLeftCornerYPosition = blockCoordinates[index][gameConfiguration.IndexOfYCoordinate] + gameConfiguration.blockHeight;
    let bottomRightCornerXPosition = blockCoordinates[index][gameConfiguration.IndexOfXCoordinate] + gameConfiguration.blockWidth;

    return (ballXPosition > bottomLeftCornerXPosition && ballXPosition < bottomRightCornerXPosition) &&
           (ballYPosition > topLeftCornerYPosition && ballYPosition < bottomLeftCornerYPosition);
}


// check if the ball hits a wall
function hitWall() {
    let ballXPosition = ballPosition[gameConfiguration.IndexOfXCoordinate];
    let ballYPosition = ballPosition[gameConfiguration.IndexOfYCoordinate];
    let rightWall = (gameConfiguration.boardWidth - gameConfiguration.ballDiameter);
    let leftWall = 0;
    let topWall = 0;

    return ballXPosition >= rightWall || ballXPosition <= leftWall || ballYPosition < topWall;
}


// check if the ball hits the player
function hitPlayer() {
    let ballXPosition = ballPosition[gameConfiguration.IndexOfXCoordinate] + gameConfiguration.ballRadius;
    let ballYPosition = ballPosition[gameConfiguration.IndexOfYCoordinate] + gameConfiguration.ballDiameter;
    let playerXPosition = playerPosition[gameConfiguration.IndexOfXCoordinate];
    let playerYPosition = playerPosition[gameConfiguration.IndexOfYCoordinate];

    return (ballXPosition > playerXPosition && ballXPosition < playerXPosition + gameConfiguration.blockWidth) &&
           (ballYPosition > playerYPosition && ballYPosition < playerYPosition + gameConfiguration.blockHeight);
}


// the player wins (no more blocks left)
function checkIfPlayerWins(allBlocks) {
    if (allBlocks.length <= 1) {
        stopGame();
        displayMessage('You won!');
    }
}


// game over (the ball reaches the bottom wall)
function checkIfPlayerLooses() {
    let ballYPosition = ballPosition[gameConfiguration.IndexOfYCoordinate] + gameConfiguration.ballDiameter;
    if (ballYPosition >= gameConfiguration.boardHeight) {
        stopGame();
        displayMessage('You lost!');
    }
}


// convert the time and add new rows every 30 seconds
function timer() {
    const addOneSecond = () => second++;
    const addOneHour = () => {minute = 0; hour++;};
    const addOneMinute = () => {second = 0; minute++;};

    addOneSecond();
    if (second === 60) addOneMinute();
    if (minute === 60) addOneHour();

    displayTime();

    if (second % 30 === 0) generateNewRow();
}


// display formatted time on the board
function displayTime() {
    const singleCharDigits = 9;

    let formattedHour = hour > singleCharDigits ? hour : `0${hour}`;
    let formattedMinute = minute > singleCharDigits ? minute : `0${minute}`;
    let formattedSecond = second > singleCharDigits ? second : `0${second}`;

    document.getElementById('hour').textContent = formattedHour;
    document.getElementById('minute').textContent = formattedMinute;
    document.getElementById('second').textContent = formattedSecond;
}


// display score on the board
function displayScore() {
    scoreNode.textContent = String('Score: ' + score);
}


// display a message on the board
function displayMessage(text) {
    const message = document.createElement('div');
    message.classList.add('text-message');
    message.textContent = text;
    boardNode.appendChild(message);
}


initPage();
initGame(pauseOnly = false);
