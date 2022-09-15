const grid = document.querySelector('.grid');
const displayScore = document.querySelector('#score')
const ballDiameter = 20;
const boardWidth = 670;
const boardHeight = 500;
const blockWidth = 100;
const blockHeight = 20;
let gameIsRunning = false;
let userPosition = [280, 480];
let ballPosition = [350, 460];

let hour = 0;
let minute = 0;
let second = 0;

let x = -2;
let y = -2;
let score = 0;
let ballId;
let timerId;
let ballSpeed = 20;

let blockCoordinates = generateCoordinates();
placeBlocks();
let user = placeUser();
let ball = placeBall();
document.addEventListener('keydown', event => moveUser(event));


function generateCoordinates(maxBlocks=18) {
    const blocksPerRow = 6;
    const rowHeight = 30;
    let leftSpace = 0;
    let blockCoordinates = [];
    let counter = 0;
    while (counter < maxBlocks) {
        let row = Math.floor(counter / blocksPerRow);
        blockCoordinates.push([leftSpace, rowHeight * row]);
        if (counter % blocksPerRow == 5) {
            leftSpace = 0;
        } else {
            leftSpace += 110;
        }
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
        blockElement.style.left = block[0] + 'px';
        blockElement.style.top = block[1] + 'px';
        blockElement.style.backgroundColor = color;
        grid.appendChild(blockElement);
    }
}


function placeUser() {
    const user = document.createElement('div')
    user.classList.add('user')
    user.style.left = userPosition[0] + 'px';
    user.style.top = userPosition[1] + 'px';
    grid.appendChild(user)
    console.log(user)
    return user;
}


function placeBall() {
    const ball = document.createElement('div')
    ball.style.left = ballPosition[0] + 'px';
    ball.style.top = ballPosition[1] + 'px';
    ball.classList.add('ball')
    grid.appendChild(ball)
    return ball;
}


function increaseBallSpeed() {
    switch (score) {
        case 5:
            ballSpeed = 17;
            clearInterval(ballId)
            ballId = setInterval(moveBall, ballSpeed)
            break;
        case 10:
            ballSpeed = 14;
            clearInterval(ballId)
            ballId = setInterval(moveBall, ballSpeed)
            break;
        case 15:
            ballSpeed = 11;
            clearInterval(ballId)
            ballId = setInterval(moveBall, ballSpeed)
            break;
        case 20:
            ballSpeed = 8;
            clearInterval(ballId)
            ballId = setInterval(moveBall, ballSpeed)
            break;
    }
}


function moveUser(event) {
    increaseBallSpeed()
    if (gameIsRunning == false) {
        timerId = setInterval(() => {timer();}, 1000);
        ballId = setInterval(moveBall, ballSpeed)
        gameIsRunning = true;
    }

    switch (event.key) {
        case 'ArrowLeft':
            if (userPosition[0] > 5) {
                userPosition[0] -= 25
                drawUser()   
        }
        break
        case 'ArrowRight':
            if (userPosition[0] < (boardWidth - blockWidth - 20)) {
                userPosition[0] += 25
                drawUser()   
        }
        break
    }
}


function drawUser() {
    user.style.left = userPosition[0] + 'px'
    user.style.top = userPosition[1] + 'px'
}
  

function drawBall() {
    ball.style.left = ballPosition[0] + 'px'
    ball.style.top = ballPosition[1] + 'px'
}


function moveBall(){
    ballPosition[0] += x
    ballPosition[1] += y
    drawBall()
    checkTheCollisions()
}



function checkTheCollisions(){
    //check for block collision
    for(let i = 0; i < blockCoordinates.length ; i++ )
    {
        let bottomLeft = [blockCoordinates[i][0], blockCoordinates[i][1] + 20];
        let bottomRight = [blockCoordinates[i][0] + 100, blockCoordinates[i][1] + 20];
        let topLeft = [blockCoordinates[i][0], blockCoordinates[i][1]];
        if (
            (ballPosition[0] > bottomLeft[0] && ballPosition[0] < bottomRight[0]) &&
            ((ballPosition[1] - ballDiameter / 2) < bottomLeft[1] && ballPosition[1] > topLeft[1]) 
          )
          {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blockCoordinates.splice(i, 1)
            changeDirection()
            score++
            displayScore.innerHTML = String('Score: ' + score);

            // winning condition
            if (allBlocks.length <= 1)
            {
                clearInterval(ballId)
                clearInterval(timerId)
                displayScore.innerHTML = 'You won!'
                document.removeEventListener('keydown', event => moveUser(event));
            }
        }
    }

    // check for wall hits
    if (ballPosition[0] >= (boardWidth - ballDiameter) || ballPosition[0] <= 0 || ballPosition[1] < 0)
    {
        changeDirection()
    }

    //check for user collision
    if (
        (ballPosition[0] > userPosition[0] && ballPosition[0] < userPosition[0] + blockWidth) &&
        (ballPosition[1] < userPosition[1] && ballPosition[1] > userPosition[1] - blockHeight)
    )
    {
        changeDirection(true)
    }

    // game over
    if(ballPosition[1] >= boardHeight - blockHeight){
        clearInterval(ballId)
        clearInterval(timerId)
        displayScore.innerHTML = 'You lost!'
        document.removeEventListener('keydown', event => moveUser(event));
    }
}


function changeDirection(random=false) {
  if (x > 0 && y < 0) {
      y = 2
    return
  }
  if (x > 0 && y > 0) {
    if (random == true) {
        x = generateRandomNumber() * -1
    } else {
        x *= -1
    }
    return
  }
  if (x < 0 && y > 0) {
    y = -2
    return
  }
  if (x < 0 && y < 0) {
    if (random == true) {
        x = generateRandomNumber()
    } else {
        x *= -1
    }
    return
  }
}


function generateRandomNumber() {
    return Math.ceil(Math.random() * 6)
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
        generateNewLine()
    }
}


function returnData(input) {
    return input > 9 ? input : `0${input}`
}


function generateNewLine() {
    let blocks = Array.from(grid.childNodes);

    for (let block of blocks) {
        if (block.classList != 'ball' && block.classList != 'user') {
            block.remove();
        } 
    }

    for (let coordinate of blockCoordinates) {
        coordinate[1] += 30;
    }

    let newLine = generateCoordinates(6);
    blockCoordinates = newLine.concat(blockCoordinates)
    placeBlocks();
}
