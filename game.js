const moveUserFunction = (event) => moveUser(event);
const scoreNode = document.querySelector('#score');
const gridNode = document.querySelector('.grid');

const gameConfiguration = Object.freeze({
    ballDiameter: 40,
    boardWidth: 670,
    boardHeight: 500,
    blockWidth: 100,
    blockHeight: 20,
    gapWidth: 10,
    rowHeight: 30,
    blocksPerRow: 6,
    xIndexCoordinate: 0,
    yIndexCoordinate: 1,
    defaultMaxBlock: 18,
    colors: ['#78B07A', '#91B4E1', '#E1CE91', '#D691E1', '#CBE191']
})


let gameIsRunning = false;
let userPosition = [280, 480];
let ballPosition = [310, 440];
let hour = 0;
let minute = 0;
let second = 0;
let xMovement = -2;
let yMovement = -2;
let score = 0;
let ballId;
let timerId;
let ballSpeed = 20;

let blockCoordinates = generateCoordinates();
let user = placeUser();
let ball = placeBall();




function generateCoordinates(maxBlocks = gameConfiguration.defaultMaxBlock) {
    let blockCoordinates = [];
    let leftSpace = 0;
    let counter = 0;
    while (counter < maxBlocks) {
        let row = Math.floor(counter / gameConfiguration.blocksPerRow);
        blockCoordinates.push([leftSpace, gameConfiguration.rowHeight * row]);
        leftSpace = (counter % gameConfiguration.blocksPerRow) === 5 ? 0 : leftSpace + gameConfiguration.blockWidth + gameConfiguration.gapWidth;
        counter++;
    }
    return blockCoordinates;
}


function pickRandomColor() {

    return gameConfiguration.colors[Math.floor(Math.random() * gameConfiguration.colors.length)];
}


function placeBlocks() {
    for (let block of blockCoordinates) {
        const blockElement = document.createElement('div');
        let color = pickRandomColor();
        blockElement.classList.add('block');
        blockElement.style.left = block[gameConfiguration.xIndexCoordinate] + 'px';
        blockElement.style.top = block[gameConfiguration.yIndexCoordinate] + 'px';
        blockElement.style.backgroundColor = color;
        gridNode.appendChild(blockElement);
    }
}


function placeUser() {
    const user = document.createElement('div');
    user.classList.add('user');
    user.style.left = userPosition[gameConfiguration.xIndexCoordinate] + 'px';
    user.style.top = userPosition[gameConfiguration.yIndexCoordinate] + 'px';
    gridNode.appendChild(user);
    return user;
}


function placeBall() {
    const ball = document.createElement('div');
    ball.style.left = ballPosition[gameConfiguration.xIndexCoordinate] + 'px';
    ball.style.top = ballPosition[gameConfiguration.yIndexCoordinate] + 'px';
    ball.classList.add('ball');
    gridNode.appendChild(ball);
    return ball;
}

// TODO : call it in the time func
function increaseBallSpeed() {
    switch (score) {
        case 5:
            ballSpeed = 17;
            clearInterval(ballId);
            ballId = setInterval(moveBall, ballSpeed);
            break;
        case 10:
            ballSpeed = 14;
            clearInterval(ballId);
            ballId = setInterval(moveBall, ballSpeed);
            break;
        case 15:
            ballSpeed = 11;
            clearInterval(ballId);
            ballId = setInterval(moveBall, ballSpeed);
            break;
        case 20:
            ballSpeed = 8;
            clearInterval(ballId);
            ballId = setInterval(moveBall, ballSpeed);
            break;
    }
}


function moveUser(event) {
    if (gameIsRunning === false) {
        timerId = setInterval(() => { timer(); }, 1000);
        ballId = setInterval(moveBall, ballSpeed);
        gameIsRunning = true;
    }

    switch (event.key) {
        case 'ArrowLeft':
            if (userPosition[gameConfiguration.xIndexCoordinate] > 5) {
                userPosition[gameConfiguration.xIndexCoordinate] -= 25;
                drawUser();
            }
            break
        case 'ArrowRight':
            if (userPosition[gameConfiguration.xIndexCoordinate] < (gameConfiguration.boardWidth - gameConfiguration.blockWidth - 20)) {
                userPosition[gameConfiguration.xIndexCoordinate] += 25;
                drawUser();
            }
            break
    }
}


function drawUser() {
    user.style.left = userPosition[gameConfiguration.xIndexCoordinate] + 'px';
    user.style.top = userPosition[gameConfiguration.yIndexCoordinate] + 'px';
}


function drawBall() {
    ball.style.left = ballPosition[gameConfiguration.xIndexCoordinate] + 'px';
    ball.style.top = ballPosition[gameConfiguration.yIndexCoordinate] + 'px';
}


function moveBall() {
    ballPosition[gameConfiguration.xIndexCoordinate] += xMovement;
    ballPosition[gameConfiguration.yIndexCoordinate] += yMovement;
    drawBall();
    checkTheCollisions();
}


function checkTheCollisions() {


    //check for block collision
    for (let index = 0; index < blockCoordinates.length; index++) {
        let bottomLeft = [blockCoordinates[index][gameConfiguration.xIndexCoordinate], blockCoordinates[index][gameConfiguration.yIndexCoordinate] + gameConfiguration.blockHeight];
        let bottomRight = [blockCoordinates[index][gameConfiguration.xIndexCoordinate] + gameConfiguration.blockWidth, blockCoordinates[index][gameConfiguration.yIndexCoordinate] + gameConfiguration.blockHeight];
        let topLeft = [blockCoordinates[index][gameConfiguration.xIndexCoordinate], blockCoordinates[index][gameConfiguration.yIndexCoordinate]];
        if (
            (ballPosition[gameConfiguration.xIndexCoordinate] > bottomLeft[gameConfiguration.xIndexCoordinate] && ballPosition[gameConfiguration.xIndexCoordinate] < bottomRight[gameConfiguration.xIndexCoordinate]) &&
            ((ballPosition[gameConfiguration.yIndexCoordinate] - gameConfiguration.ballDiameter / 2) < bottomLeft[gameConfiguration.yIndexCoordinate] && ballPosition[gameConfiguration.yIndexCoordinate] > topLeft[gameConfiguration.yIndexCoordinate])
        ) {
            const allBlocks = addPlayerScore(index);

            // winning condition
            checkPlayerWin(allBlocks);
        }
    }

    // check for wall hits
    checkHitToWall();

    //check for user collision
    checkHitUser();

    // game over
    checkGameOver();
}


function checkHitUser() {
    if ((ballPosition[gameConfiguration.xIndexCoordinate] > userPosition[gameConfiguration.xIndexCoordinate] && ballPosition[gameConfiguration.xIndexCoordinate] < userPosition[gameConfiguration.xIndexCoordinate] + gameConfiguration.blockWidth) &&
        (ballPosition[gameConfiguration.yIndexCoordinate] < userPosition[gameConfiguration.yIndexCoordinate] && ballPosition[gameConfiguration.yIndexCoordinate] > userPosition[gameConfiguration.yIndexCoordinate] - gameConfiguration.ballDiameter)) {
        changeDirection(true);
    }
}

function checkHitToWall() {
    if (ballPosition[gameConfiguration.xIndexCoordinate] >= (gameConfiguration.boardWidth - gameConfiguration.ballDiameter) || ballPosition[gameConfiguration.xIndexCoordinate] <= 0 || ballPosition[gameConfiguration.yIndexCoordinate] < 0) {
        changeDirection();
    }
}

function checkGameOver() {
    if (ballPosition[1] >= gameConfiguration.boardHeight - gameConfiguration.ballDiameter) {
        clearInterval(ballId);
        clearInterval(timerId);
        scoreNode.innerHTML = 'You lost!';
        document.removeEventListener('keydown', moveUserFunction);
    }
}

function checkPlayerWin(allBlocks) {
    if (allBlocks.length <= 1) {
        clearInterval(ballId);
        clearInterval(timerId);
        scoreNode.innerHTML = 'You won!';
        document.removeEventListener('keydown', moveUserFunction);
    }
}

function addPlayerScore(index) {
    const allBlocks = Array.from(document.querySelectorAll('.block'));
    allBlocks[index].classList.remove('block');
    blockCoordinates.splice(index, 1);
    changeDirection();
    score++;
    increaseBallSpeed();
    scoreNode.innerHTML = String('Score: ' + score);
    return allBlocks;
}

function changeDirection(random = false) {
    if (xMovement > 0 && yMovement < 0) {
        yMovement = 2;

    }
    else if (xMovement > 0 && yMovement > 0) {
        if (random === true) {
            xMovement = generateRandomNumber() * -1;
        } else {
            xMovement *= -1;
        }

    }
    else if (xMovement < 0 && yMovement > 0) {
        yMovement = -2;

    }
    else {
        if (random === true) {
            xMovement = generateRandomNumber();
        } else {
            xMovement *= -1;
        }

    }
}


function generateRandomNumber() {
    return Math.ceil(Math.random() * 6);
}


const addOneSecond = () => second++;
function timer() {

    addOneSecond();
    second === 60 && addOneMinute();
    minute === 60 && addOneHour();

    document.getElementById('hour').innerText = returnData(hour);
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);

    if (second % 30 === 0) {
        generateNewLine();
    }
}


function addOneHour() {
    minute = 0;
    hour++;
}

function addOneMinute() {
    second = 0;
    minute++;
}

function returnData(input) {
    let singleCharDigits = 9;
    return input > singleCharDigits ? input : `0${input}`;
}


function generateNewLine() {
    let blocks = Array.from(gridNode.childNodes);
    for (let block of blocks) {
        if (block.classList != 'ball' && block.classList != 'user') {
            block.remove();
        }
    }
    for (let coordinate of blockCoordinates) {
        coordinate[gameConfiguration.yIndexCoordinate] += gameConfiguration.rowHeight;
    }
    let newLine = generateCoordinates(gameConfiguration.blocksPerRow);
    blockCoordinates = newLine.concat(blockCoordinates);
    placeBlocks();
}


document.addEventListener('keydown', moveUserFunction);
placeBlocks();