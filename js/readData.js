var moveHistory = [[0, 'b', 'a', 5]];
var CELL_SPACING = 35;
var PIECE_WIDTH = 16;
var currentPlayerColor;
var currentMoveData = [];
var timesClicked = 0;
alert(moveHistory);

function setCurrentColor(c) {
	if (c == 'white')
		currentPlayerColor = 'w';
	else if (c == 'black')
		currentPlayerColor = 'b';
}
function drawGoPieces(surface) {
	if (moveHistory.length > 0) {
		for (var m = 0; m < moveHistory.length; m++) {
			var positionArray = getXYCoords(moveHistory[m][2], moveHistory[m][3])
			drawGoPiece(surface, positionArray[0], positionArray[1], moveHistory[m][1]);
		}
	}
}
function addToData(turn, color, x, y) {
	// remember x is a letter and y is a number
	var curr_move = [];
	curr_move.push(turn);
	curr_move.push(color);
	curr_move.push(x);
	curr_move.push(y);
	moveHistory.push(curr_move);
}
function showData() {
	alert(moveHistory.length);
}

function getXYCoords(letter,number) {
	// letter maps to x
	// number maps to y
	var x_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
	var letter_index = 0;
	//Dustin you are retarted, you can replace the for loop with
	//letter_index = x_letters.indexOf(letter);
	for (index = 0; index < x_letters.length; index++) {
		if (x_letters[index].toLowerCase() == letter.toLowerCase()) {
			letter_index = index;
		}
	}

	var letter_index_x = (letter_index * CELL_SPACING) + CELL_SPACING;
	var number_index_y = (number * CELL_SPACING);
	return [letter_index_x,number_index_y];
}
function getLetterNumberCoords(x, y) {
	var x_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
	var chillBitches = x_letters[(x/35)-1]
	var y_you_aint_got_no_type = y / 35;
	return [chillBitches, y_you_aint_got_no_type];
}

function nearestIntersectionCoord(x) {
	if ((x % CELL_SPACING) > (CELL_SPACING / 2)) {
		x = (Math.floor(x / CELL_SPACING) * CELL_SPACING) + CELL_SPACING;
	} 
	else{
		x = (Math.floor(x / CELL_SPACING) * CELL_SPACING);	
	}
	return x;
}

function drawGoPiece(surface, x, y, color) {
		if (color == 'b') {
			surface.strokeStyle = 'black';
			surface.fillStyle = 'black';
		}
		else {
			surface.strokeStyle = 'white';
			surface.fillStyle = 'white';
		}
		surface.lineWidth = 1;
		surface.beginPath();
		surface.arc(x, y, PIECE_WIDTH, (Math.PI/180)*0, (Math.PI/180)*360, false);
		surface.fill();
		surface.stroke();
		surface.closePath();
}
function drawBoard(surface, canvas) {
	surface.strokeStyle = "black";
	surface.lineWidth = 0.5;
	surface.fillStyle = "black";
	var y = CELL_SPACING;
	var x = CELL_SPACING;

	for (var j = 0; j < 19; j++) {
		surface.beginPath();
		surface.moveTo(x, y);
		surface.lineTo(canvas.width-CELL_SPACING, y);
		surface.stroke();
		y += CELL_SPACING;
		surface.closePath();
		surface.font = "20px arial";
		surface.fillText((j+1).toString(), CELL_SPACING-30,y - 27 )
	}

	y = CELL_SPACING;
	x = CELL_SPACING;

	var x_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
	for (var k = 0; k < 19; k++) {

		surface.beginPath();
		surface.moveTo(x, y);
		surface.lineTo(x, canvas.height-CELL_SPACING);
		surface.stroke();
		x += CELL_SPACING;
		surface.closePath();
		surface.font = "18px arial";
		surface.fillText(x_letters[k], x-42, CELL_SPACING-15)
	}
}
function init() {
	var canvas = document.querySelector("canvas");
	var surface = canvas.getContext("2d");

	drawBoard(surface, canvas);
	drawGoPieces(surface);

	canvas.addEventListener('click', function(e) {
		var canvasRect = this.getBoundingClientRect();
		var gx = e.x - canvasRect.left;
		var gy = e.y - canvasRect.top;
		var igx = nearestIntersectionCoord(gx); 
		var igy = nearestIntersectionCoord(gy);
		//alert(igx + ' ' + igy);
		if (timesClicked == 0) {
			timesClicked++;
			drawGoPiece(surface, igx, igy, currentPlayerColor);
			var lastMove = moveHistory[moveHistory.length-1];
			var turnIncremented = lastMove[0] + 1;
			var movePosition = getLetterNumberCoords(igx, igy);
			var nextMoveArr = [turnIncremented, currentPlayerColor, movePosition[0], movePosition[1]];
			moveHistory.push(nextMoveArr);
			alert(moveHistory)
			var undoMoveButton = document.createElement('button');
			undoMoveButton.innerHTML = "Undo Move";
			document.body.appendChild(undoMoveButton);

			undoMoveButton.onclick = function() {
				moveHistory.pop();
				surface.clearRect(0, 0, canvas.width, canvas.height);
				drawBoard(surface, canvas);
				drawGoPieces(surface);
				timesClicked = 0;
				document.body.removeChild(undoMoveButton);
			}
		}
	}, false);
	// surface.strokeStyle = "black";
	// surface.lineWidth = 2;
	// surface.beginPath();
	// surface.moveTo(0, 10);
	// surface.lineTo(canvas.width, 10);
	// surface.stroke();
	// surface.closePath();
}
//Notes Bitches. The server holds a copy of move history for each game.
//whenever the move history changes on the server, it sends the next players turn 
//a new page with the board loaded from the updated move history.
//when  a black user makes a move and submits it, it then grabs the move data 
//which is the turn, color, x, y 