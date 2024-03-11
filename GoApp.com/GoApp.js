const canvas = document.getElementById("canvas"); 
const ctx = canvas.getContext("2d");
const height = canvas.height;
const width = canvas.width;
const size = 9;
const gridMargin = 50;
const gridSize = (height - ( 2 * gridMargin)) / (size - 1); 
const board = new Board(size, size, 0); 
let prevX = -100; 
let prevY = -100;


function drawBoard(){ 

    for (let i = 0; i < size; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize + gridMargin, gridMargin); 
        ctx.lineTo(i * gridSize + gridMargin, height - gridMargin); 
        ctx.stroke();
      }
    
      for (let i = 0; i < size; i++) {
        ctx.beginPath();
        ctx.moveTo(gridMargin, i * gridSize + gridMargin);
        ctx.lineTo(width - gridMargin, i * gridSize + gridMargin);
        ctx.stroke();
      }

     // board.drawPts();

}

function drawPts(){  
    for (let row = 0; row < board.rows; row++) {
        for (let col = 0; col < board.cols; col++) {
            const index = row * board.cols + col;
            const player = board.pts[index];

            // Draw an empty cell or a piece based on the value in the pts array
            if (player === 0 || player === 1) {
                drawPiece(row, col, player);
            } 
        }
    }
}

function drawPiece(row, col, player) { 
    const cellSize = canvas.width / (board.cols - 1);
    const x = physicalPos(col); 
    const y = physicalPos(row); 

    ctx.beginPath();
    ctx.arc(x, y, cellSize / 3, 0, 2 * Math.PI);
    ctx.fillStyle = player === 0 ? "black" : "white"; // Adjust colors as needed
    ctx.fill();
    ctx.stroke();
}

function refreshBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawWoodGrain();
    drawBoard();
    drawPts();
}

function logicalCoordinates(pos){
    return Math.floor((pos - gridMargin /* align to 0 */ + (gridSize/2) /* center on the grid line */) / gridSize);
}

function physicalPos(pos) {
    return (pos * gridSize) + gridMargin;
}

function makeMove(row, col){
    if( board.player == 0 ){
        board.setPoint(row, col, 0); 
    }else{ board.setPoint(row, col, 1); }
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('mousemove', trackMouse); 



function handleClick(event) {
    // Get the mouse coordinates relative to the canvas
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    
    const logCol = logicalCoordinates(mouseX); 
    const logRow = logicalCoordinates(mouseY);
    const move = board.getLoc(logRow, logCol);


    if(!board.occupiedHuh(move) && (!board.isSuicide(logCol, logRow))){
        makeMove(logRow, logCol);
        deleteArr = board.checkAllSurr(board.getOppColor()); // parallel array, stores the boolean value for if a stone should be captured after the recent move 
	
			for(let i = 0; i < board.getPts().length; i++) {
				if(deleteArr[i]) {
					board.getPts()[i] = null; // stone at i is captured, set its intersection to empty 
                    board.updateScore();
                    updateHTMLScores();
					}
				}
        console.log(board.blackScore, board.whiteScore); 
        board.changePlayer();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawWoodGrain();
    drawBoard();
    drawPts();
}

function updateHTMLScores(){
    let whiteScoreHTML = document.getElementById('whiteScore');
    let blackScoreHTML = document.getElementById('blackScore');
    if( board.player == 0 ){
        blackScoreHTML.innerHTML = "Black Score: " + board.blackScore;
    }
    else{whiteScoreHTML.innerHTML = "White Score: " + board.whiteScore;
}
}

function trackMouse(event){
    prevX = event.clientX - canvas.getBoundingClientRect().left;
    prevY = event.clientY - canvas.getBoundingClientRect().top;
    drawTrackMouse();

}

function mouseOnBoard(x, y){

    return x > 5 && x < 645 && y > 0 && y < 645
}

function drawTrackMouse(){
    refreshBoard();

    const cellSize = canvas.width / (board.cols - 1);
    if(mouseOnBoard(prevX, prevY)){
        ctx.beginPath();
        ctx.arc(prevX, prevY, cellSize / 3, 0, 2 * Math.PI);
        ctx.fillStyle = board.player === 0 ? "black" : "white"; // Adjust colors as needed
        ctx.fill();
        ctx.stroke(); 
    }
}


function drawWoodGrain() {
            const colors = ["#D2B48C", "#C9A978", "#B0895D", "#A17A4D"]; // Tannish brown tones for wood grain

            // Create horizontal gradient
            const gradientX = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradientX.addColorStop(0, colors[0]);
            gradientX.addColorStop(0.5, colors[1]);
            gradientX.addColorStop(0.75, colors[2]);
            gradientX.addColorStop(1, colors[3]);

            // Create vertical gradient
            const gradientY = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradientY.addColorStop(0, colors[0]);
            gradientY.addColorStop(0.5, colors[1]);
            gradientY.addColorStop(0.75, colors[2]);
            gradientY.addColorStop(1, colors[3]);

            // Fill the canvas with the gradients
            ctx.fillStyle = gradientX;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = gradientY;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
}

drawWoodGrain();
drawBoard();