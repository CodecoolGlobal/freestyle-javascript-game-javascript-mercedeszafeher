const grid = document.querySelector('.grid');
const displayScore = document.querySelector('#score')
const ballDiameter = 20;
const boardWidth = 670;
const boardHeight = 500;
const blockWidth = 100;
const blockHeight = 20;

let userPosition = [280, 480];
let ballPosition = [350, 460];

let hour = 0;
let minute = 0;
let second = 0;

let x = -2;
let y = 2;
let score = 0;

let blockCoordinates = generateCoordinates();
placeBlocks(grid, blockCoordinates);
let user = placeUser(grid, userPosition);
let ball = placeBall(grid, ballPosition);
document.addEventListener('keydown', event => moveUser(event));


function generateCoordinates() {
    const blocksPerRow = 6;
    const maxBlocks = 18;
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
    console.log(blockCoordinates)
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


function moveUser(event) {
    if (document.getElementById('second').textContent == '00') {
        setInterval(() => {timer();}, 1000);
    }

    switch (event.key) {
        case 'ArrowLeft':
            if (userPosition[0] > 0) {
                userPosition[0] -= 20
                console.log(userPosition[0] > 0)
                drawUser()   
        }
        break
        case 'ArrowRight':
            if (userPosition[0] < (boardWidth - blockWidth)) {
                userPosition[0] += 20
                console.log(userPosition[0])
                drawUser()   
        }
        break
    }
}


function drawUser() {
    user.style.left = userPosition[0] + 'px'
    user.style.bottom = userPosition[1] + 'px'
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
time_id = setInterval(moveBall, 30)


function checkTheCollisions(){
    //check for block collision
    for(let i = 0; i < blockCoordinates.length ; i++ )
    {
        let bottomLeft = [blockCoordinates[i][0], blockCoordinates[i][1] + 20];
        let bottomRight = [blockCoordinates[i][0] + 100, blockCoordinates[i][1] + 20];
        let topLeft = [blockCoordinates[i][0], blockCoordinates[i][1]];
        let topRight = [blockCoordinates[i][0], blockCoordinates[i][1] + 100];
        if (
            (ballPosition[0] > bottomLeft[0] && ballPosition[0] < bottomRight[0]) &&
            (ballPosition[1] < bottomLeft[1] && ballPosition[1] > topLeft[1]) 
          )
          {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            allBlocks.splice(i, 1)
            changeDirection()
            score++
            // displayScore.innerHTML = String(score);

            // winning condition
            if (allBlocks.length == 0) 
            {
                // displayScore.innerHTML = 'You Win!'
                clearInterval(time_id)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    // check for wall hits
    if (ballPosition[0] >= (boardWidth - ballDiameter) || ballPosition[0] <= 0 || ballPosition[1] >= (boardHeight - ballDiameter))
    {
        changeDirection()
    }

    //check for user collision
    if (
        (ballPosition[0] > userPosition[0]&& ballPosition[0] < userPosition[0] + blockWidth)&&
        (ballPosition[1] < userPosition[1 ]&& ballPosition[1] > userPosition[1]+ blockHeight)
    )
    {
        changeDirection()
    }

    // game over
    if(ballPosition[1] >= boardHeight){
        clearInterval(time_id)
        // displayScore.innerHTML = 'You lose!'
        document.removeEventListener('keydown', moveUser)
    }
}


function changeDirection() {
  if (x == 2 && y == 2) {
      y = -2
    return
  }
  if (x == 2 && y== -2) {
      x = -2
    return
  }
  if (x == -2 && y == -2) {
    y = 2
    return
  }
  if (x == -2 && y == 2) {
    x = 2
    return
  }
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
}


function returnData(input) {
    return input > 9 ? input : `0${input}`
}
