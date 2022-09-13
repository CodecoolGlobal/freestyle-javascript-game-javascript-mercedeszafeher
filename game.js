const grid = document.querySelector('.grid');
let blocksPerRow = 6;
let maxBlocks = 18;
let leftSpace = 0;
let rowHeight = 30;
const boardWidth = 670;
const boardHeight = 20;
const blockWidth = 110;
let userPosition = [280, 480];
let ballPosition = [320, 460];

let hour = 0;
let minute = 0;
let second = 0;

let blockCoordinates = generateCoordinates();
placeBlocks(grid, blockCoordinates);
let user = placeUser(grid, userPosition);
let ball = placeBall(grid, ballPosition);
document.addEventListener('keydown', event => moveUser(event));



function generateCoordinates() {
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
    ball.style.bottom = ballPosition[1] + 'px'
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
