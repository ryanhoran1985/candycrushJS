
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

let currTile;
let otherTile;

window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100)
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id="0-0">
            let tile = document.createElement("img");
                tile.id = r.toString() + "-" + c.toString();
                tile.src = "./images/" + randomCandy() + ".png";

                // Drag functionality
                tile.addEventListener('dragstart', dragStart); // click on a candy, initialize drag process
                tile.addEventListener('dragover', dragOver);   // clicking on candy, moving mouse to drag the candy
                tile.addEventListener('dragenter', dragEnter); // dragging candy onto another candy
                tile.addEventListener('dragleave', dragLeave); // leave candy over another candy
                tile.addEventListener('drop', dragDrop);       // dropping a candy over another candy
                tile.addEventListener('dragend', dragEnd);     // after drag process completed, we swap candies
                
                document.getElementById("board").append(tile);
                row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function dragStart() {
    // this refers to tile/candy that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave(e) {
    e.preventDefault();
}

function dragDrop() {
    // this refers to the target tile/candy that was dropped on
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-"); // turns id "0-0" into ["0", "0"]
    let currRowNum = parseInt(currCoords[0]);
    let currColNum = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let otherRowNum = parseInt(otherCoords[0]);
    let otherColNum = parseInt(otherCoords[1]);

    let moveLeft = otherColNum == currColNum - 1 && currRowNum == otherRowNum;
    let moveRight = otherColNum == currColNum + 1 && currRowNum == otherRowNum;
    let moveUp = otherRowNum == currRowNum - 1 && currColNum == otherColNum;
    let moveDown = otherRowNum == currRowNum + 1 && currColNum == otherColNum;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }
}

function crushCandy() {
    crushThree();
    document.getElementById('score').innerText = score;
}

function crushThree() {
    // check rows
    for (let r = 0; r < rows; r++) {
        // columns - 2 because we are checking the row 2 candies ahead
        for (let c = 0; c < columns - 2; c++) { 
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];

            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    // check rows
    for (let r = 0; r < rows; r++) {
    // columns - 2 because we are checking the row 2 candies ahead
        for (let c = 0; c < columns - 2; c++) { 
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];

            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}