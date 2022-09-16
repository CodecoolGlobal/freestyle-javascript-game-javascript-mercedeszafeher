const movePlayerFunction = (event) => movePlayer(event);
const scoreNode = document.querySelector('#score');
const boardNode = document.querySelector('.board');
const gameConfiguration = Object.freeze({
    boardWidth: 670,
    ballDiameter: 40,
    ballRadius: 20,
    boardHeight: 500,
    blockWidth: 100,
    blockHeight: 20,
    gapWidth: 10,
    rowHeight: 30,
    blocksPerRow: 6,
    IndexOfXCoordinate: 0,
    IndexOfYCoordinate: 1,
    defaultMaxBlocks: 18,
    playerXMovement: 25,
    colors: ['#78B07A', '#91B4E1', '#E1CE91', '#D691E1', '#CBE191']
});

let gameIsRunning = false;
let playerPosition = [280, 470];
let ballPosition = [310, 430];
let ballSpeed = 20;
let ballXMovement = -2;
let ballYMovement = -2;
let second = 0;
let minute = 0;
let hour = 0;
let score = 0;

let blockCoordinates;
let timerId;
let ballId;
let player;
let ball;


// game initialization
function initGame() {
    blockCoordinates = generateCoordinates();
    player = createPlayer();
    ball = createBall();
    document.addEventListener('keydown', movePlayerFunction);
    createBlocks();
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


// pick a random color for the blocks
function pickRandomColor() {
    return gameConfiguration.colors[Math.floor(Math.random() * gameConfiguration.colors.length)];
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


// increase the ball speed at a certain score
function increaseBallSpeed() {
    switch (score) {
        case 5:
            ballSpeed = 17;
            ballId = changeIntervalDelay(ballId)
            break;
        case 10:
            ballSpeed = 14;
            ballId = changeIntervalDelay(ballId)
            break;
        case 15:
            ballSpeed = 11;
            ballId = changeIntervalDelay(ballId)
            break;
        case 20:
            ballSpeed = 8;
            ballId = changeIntervalDelay(ballId)
            break;
    }
}


// change the delay of an interval
function changeIntervalDelay(intervalId) {
    clearInterval(intervalId);
    return setInterval(moveBall, ballSpeed);
}


// set the intervals on the first keypress
function startGame() {
    if (gameIsRunning === false) {
        timerId = setInterval(timer, 1000);
        ballId = setInterval(moveBall, ballSpeed);
        gameIsRunning = true;
    }
}


// move the player by pressing a key
function movePlayer(event) {
    startGame();
    switch (event.key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
            if (playerPosition[gameConfiguration.IndexOfXCoordinate] > 5) {
                playerPosition[gameConfiguration.IndexOfXCoordinate] -= gameConfiguration.playerXMovement;
                alignElement(player, playerPosition);
            }
            break;
        case 'd':
        case 'D':
        case 'ArrowRight':
            if (playerPosition[gameConfiguration.IndexOfXCoordinate] < (gameConfiguration.boardWidth - gameConfiguration.blockWidth - gameConfiguration.playerXMovement)) {
                playerPosition[gameConfiguration.IndexOfXCoordinate] += gameConfiguration.playerXMovement;
                alignElement(player, playerPosition);
            }
            break;
    }
}


// align an element on the board
function alignElement(element, elementPosition) {
    element.style.left = elementPosition[gameConfiguration.IndexOfXCoordinate] + 'px';
    element.style.top = elementPosition[gameConfiguration.IndexOfYCoordinate] + 'px';
}


// move the ball on the board
function moveBall(){
    ballPosition[gameConfiguration.IndexOfXCoordinate] += ballXMovement;
    ballPosition[gameConfiguration.IndexOfYCoordinate] += ballYMovement;
    alignElement(ball, ballPosition);
    checkForCollisions();
}


// check if the ball hits an element
function checkForCollisions(){
    for (let index = 0; index < blockCoordinates.length ; index++ ) {
        if (hitBlock(index)) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[index].classList.remove('block');
            blockCoordinates.splice(index, 1);
            score++;
            scoreNode.textContent = String('Score: ' + score);
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
        clearInterval(ballId);
        clearInterval(timerId);
        displayMessage('You won!');
        document.removeEventListener('keydown', movePlayerFunction);
    }
}


// game over (the ball reaches the bottom wall)
function checkIfPlayerLooses() {
    let ballYPosition = ballPosition[gameConfiguration.IndexOfYCoordinate] + gameConfiguration.ballDiameter;
    if (ballYPosition >= gameConfiguration.boardHeight) {
        clearInterval(ballId);
        clearInterval(timerId);
        displayMessage('You lost!');
        document.removeEventListener('keydown', movePlayerFunction);
    }
}


// display a message on the board
function displayMessage(text) {
    const message = document.createElement('div');
    message.classList.add('text-message');
    message.textContent = text;
    boardNode.appendChild(message);
}


// change the direction of the ball
function changeDirection(randomAngle = false) {
    if (ballXMovement > 0 && ballYMovement < 0) {
        ballYMovement = 2;
    } else if (ballXMovement > 0 && ballYMovement > 0) {
        ballXMovement = (randomAngle === true) ? generateRandomNumber() * -1 : ballXMovement * -1;
    } else if (ballXMovement < 0 && ballYMovement > 0) {
        ballYMovement = -2;
    } else {
        ballXMovement = (randomAngle === true) ? generateRandomNumber() : ballXMovement * -1;
    }
}


// generate a random number (for a random ball angle)
function generateRandomNumber() {
    return Math.ceil(Math.random() * gameConfiguration.blocksPerRow);
}


// convert the time and display it on the board
function timer() {
    const addOneSecond = () => second++;
    const addOneHour = () => {minute = 0; hour++;}
    const addOneMinute = () => {second = 0; minute++;}

    addOneSecond();
    if (second === 60) addOneMinute();
    if (minute === 60) addOneHour();

    document.getElementById('hour').textContent = formatTime(hour);
    document.getElementById('minute').textContent = formatTime(minute);
    document.getElementById('second').textContent = formatTime(second);

    if (second % 30 === 0) generateNewRow();
}


// add leading zero to single digit (0-9)
function formatTime(input) {
    const singleCharDigits = 9;
    return input > singleCharDigits ? input : `0${input}`;
}


// generate a new row of blocks
function generateNewRow() {
    const blocks = Array.from(boardNode.childNodes);
    for (let block of blocks) {
        if (block.className != 'ball' && block.className != 'player') {
            block.remove();
        }
    }
    for (let coordinate of blockCoordinates) {
        coordinate[gameConfiguration.IndexOfYCoordinate] += gameConfiguration.rowHeight;
    }
    let newRow = generateCoordinates(gameConfiguration.blocksPerRow);
    blockCoordinates = newRow.concat(blockCoordinates);
    createBlocks();
}


initGame()
