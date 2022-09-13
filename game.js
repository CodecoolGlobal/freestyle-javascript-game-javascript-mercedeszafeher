const grid = document.querySelector('.grid');
let blocksPerRow = 6;
let maxBlocks = 18;
let leftSpace = 0;
let rowHeight = 30;
const boardWidth = 670;
const boardHeight = 20;
const blockWidth = 100;
let userPosition = [280, 480];
let ballPosition = [320, 460];

let blockCoordinates = generateCoordinates(blocksPerRow, maxBlocks, leftSpace, rowHeight);
placeBlocks(grid, blockCoordinates);
let user = placeUser(grid, userPosition);
let ball = placeBall(grid, ballPosition);
document.addEventListener('keydown', event => moveUser(event));



function generateCoordinates(blocksPerRow, maxBlocks, leftSpace, rowHeight) {
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


function placeBlocks(grid, blockCoordinates) {
    for (let block of blockCoordinates) {
        const blockElement = document.createElement('div');
        blockElement.classList.add('block');
        blockElement.style.left = block[0] + 'px';
        blockElement.style.top = block[1] + 'px';
        grid.appendChild(blockElement);
    }
}


function placeUser(grid, userPosition) {
    const user = document.createElement('div')
    user.classList.add('user')
    user.style.left = userPosition[0] + 'px';
    user.style.top = userPosition[1] + 'px';
    grid.appendChild(user)
    console.log(user)
    return user;
}


function placeBall(grid, ballPosition) {
    const ball = document.createElement('div')
    ball.style.left = ballPosition[0] + 'px';
    ball.style.top = ballPosition[1] + 'px';
    ball.classList.add('ball')
    grid.appendChild(ball)
    return ball;
}


function moveUser(event) {
    switch (event.key) {
        case 'ArrowLeft':
            if (userPosition[0] > 0) {
                userPosition[0] -= 10
                console.log(userPosition[0] > 0)
                drawUser()   
        }
        break
        case 'ArrowRight':
            if (userPosition[0] < (boardWidth - blockWidth)) {
                userPosition[0] += 10
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
