initGame();

function initGame() {
    const grid = document.querySelector('.grid');
    let blocksPerRow = 6;
    let maxBlocks = 18;
    let leftSpace = 0;
    let rowHeight = 30;

    let blockCoordinates = generateCoordinates(blocksPerRow, maxBlocks, leftSpace, rowHeight);
    placeBlocks(grid, blockCoordinates);
}


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

}
