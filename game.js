const moveUserFunction = (event) => moveUser(event);
const scoreNode = document.querySelector('#score');
const gridNode = document.querySelector('.grid');
const ballDiameter = 20;
const boardWidth = 670;
const boardHeight = 500;
const blockWidth = 100;
const blockHeight = 20;
const gapWidth = 10;
const rowHeight = 30;
const blocksPerRow = 6;
const xCoordinate = 0;
const yCoordinate = 1;

let gameIsRunning = false;
let userPosition = [280, 480];
let ballPosition = [350, 460];
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

document.addEventListener('keydown', moveUserFunction);
placeBlocks();


function generateCoordinates(maxBlocks=18) {
    let blockCoordinates = [];
    let leftSpace = 0;
    let counter = 0;
    while (counter < maxBlocks) {
        let row = Math.floor(counter / blocksPerRow);
        blockCoordinates.push([leftSpace, rowHeight * row]);
        leftSpace = (counter % blocksPerRow) == 5 ? 0 : leftSpace + blockWidth + gapWidth;
        counter++;
    }
    return blockCoordinates;
}


function pickRandomColor() {
    const colors = ['#78B07A', '#91B4E1', '#E1CE91', '#D691E1', '#CBE191'];
    return colors[Math.floor(Math.random()*colors.length)];
}


function placeBlocks() {
    for (let block of blockCoordinates) {
        const blockElement = document.createElement('div');
        let color = pickRandomColor();
        blockElement.classList.add('block');
        blockElement.style.left = block[xCoordinate] + 'px';
        blockElement.style.top = block[yCoordinate] + 'px';
        blockElement.style.backgroundColor = color;
        gridNode.appendChild(blockElement);
    }
}


function placeUser() {
    const user = document.createElement('div');
    user.classList.add('user');
    user.style.left = userPosition[xCoordinate] + 'px';
    user.style.top = userPosition[yCoordinate] + 'px';
    gridNode.appendChild(user);
    return user;
}


function placeBall() {
    const ball = document.createElement('div');
    ball.style.left = ballPosition[xCoordinate] + 'px';
    ball.style.top = ballPosition[yCoordinate] + 'px';
    ball.classList.add('ball');
    gridNode.appendChild(ball);
    return ball;
}


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
    increaseBallSpeed();
    if (gameIsRunning == false) {
        timerId = setInterval(() => {timer();}, 1000);
        ballId = setInterval(moveBall, ballSpeed);
        gameIsRunning = true;
    }

    switch (event.key) {
        case 'ArrowLeft':
            if (userPosition[xCoordinate] > 5) {
                userPosition[xCoordinate] -= 25;
                drawUser();
        }
        break
        case 'ArrowRight':
            if (userPosition[xCoordinate] < (boardWidth - blockWidth - 20)) {
                userPosition[xCoordinate] += 25;
                drawUser();
        }
        break
    }
}


function drawUser() {
    user.style.left = userPosition[xCoordinate] + 'px';
    user.style.top = userPosition[yCoordinate] + 'px';
}
  

function drawBall() {
    ball.style.left = ballPosition[xCoordinate] + 'px';
    ball.style.top = ballPosition[yCoordinate] + 'px';
}


function moveBall(){
    ballPosition[xCoordinate] += xMovement;
    ballPosition[yCoordinate] += yMovement;
    drawBall();
    checkTheCollisions();
}


function checkTheCollisions(){
    //check for block collision
    for(let index = 0; index < blockCoordinates.length ; index++ )
    {
        let bottomLeft = [blockCoordinates[index][xCoordinate], blockCoordinates[index][yCoordinate] + blockHeight];
        let bottomRight = [blockCoordinates[index][xCoordinate] + blockWidth, blockCoordinates[index][yCoordinate] + blockHeight];
        let topLeft = [blockCoordinates[index][xCoordinate], blockCoordinates[index][yCoordinate]];
        if (
            (ballPosition[xCoordinate] > bottomLeft[xCoordinate] && ballPosition[xCoordinate] < bottomRight[xCoordinate]) &&
            ((ballPosition[yCoordinate] - ballDiameter / 2) < bottomLeft[yCoordinate] && ballPosition[yCoordinate] > topLeft[yCoordinate]) 
          )
          {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[index].classList.remove('block');
            blockCoordinates.splice(index, 1);
            changeDirection();
            score++;
            scoreNode.innerHTML = String('Score: ' + score);

            // winning condition
            if (allBlocks.length <= 1)
            {
                clearInterval(ballId);
                clearInterval(timerId);
                scoreNode.innerHTML = 'You won!';
                document.removeEventListener('keydown', moveUserFunction);
            }
        }
    }

    // check for wall hits
    if (ballPosition[xCoordinate] >= (boardWidth - ballDiameter) || ballPosition[xCoordinate] <= 0 || ballPosition[yCoordinate] < 0)
    {
        changeDirection();
    }

    //check for user collision
    if (
        (ballPosition[xCoordinate] > userPosition[xCoordinate] && ballPosition[xCoordinate] < userPosition[xCoordinate] + blockWidth) &&
        (ballPosition[yCoordinate] < userPosition[yCoordinate] && ballPosition[yCoordinate] > userPosition[yCoordinate] - blockHeight)
    )
    {
        changeDirection(true);
    }

    // game over
    if(ballPosition[1] >= boardHeight - blockHeight){
        clearInterval(ballId);
        clearInterval(timerId);
        scoreNode.innerHTML = 'You lost!';
        document.removeEventListener('keydown', moveUserFunction);
    }
}


function changeDirection(random=false) {
    if (xMovement > 0 && yMovement < 0) {
        yMovement = 2;
        return;
    }
    if (xMovement > 0 && yMovement > 0) {
        if (random == true) {
            xMovement = generateRandomNumber() * -1;
        } else {
            xMovement *= -1;
        }
        return;
    }
    if (xMovement < 0 && yMovement > 0) {
        yMovement = -2;
        return;
    }
    if (xMovement < 0 && yMovement < 0) {
        if (random == true) {
            xMovement = generateRandomNumber();
        } else {
            xMovement *= -1;
        }
        return;
    }
}


function generateRandomNumber() {
    return Math.ceil(Math.random() * 6);
}


function timer() {
    if (second == 60) {
        second = 0;
        minute++;
    } else {
        second++;
    }
    if (minute == 60) {
        minute = 0;
        hour++;
    }
    document.getElementById('hour').innerText = returnData(hour);
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);

    if (second % 30 == 0) {
        generateNewLine();
    }
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
        coordinate[yCoordinate] += rowHeight;
    }
    let newLine = generateCoordinates(blocksPerRow);
    blockCoordinates = newLine.concat(blockCoordinates);
    placeBlocks();
}
