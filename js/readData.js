var moveHistory = [];
var hasPieceBeenDrawn = false;
var CELL_SPACING = 35;
var PIECE_WIDTH = 16;
var playerColor;
var currentMoveData = [];
var ajaxCalling;
var board = [];

function getLastMove() {
	return moveHistory[moveHistory.length-1];
}
function getEmptyBoard() {
	var b = [];
	for (var i = 0; i < 19; i++) {
		var a = [];
		for (var j = 0; j < 19; j++) {
			a.push('e');
		}
		b.push(a);
	}
	return b;
}
function getSurroundingStones(board, ex, why) {
	//coords of sourrounding pieces
	var west = null;
	var east = null;
	var south = null;
	var north = null;
	
	if (ex != 0) west = [ex-1, y];
	if (ex != 18) east = [ex+1, y];
	if (why != 0) north = [ex, why-1];
	if (why != 18) south = [ex, why+1];

	surr_stone_data = [];

	each([west, east, south, north], function(e) {
		if (e != null) surr_stone_data.append([board[e[0]][e[1]], e[0], e[1]]);
	})

	return surr_stone_cols
}
function getOpposite(stone_args, current_color) {
	opposite_cols = []
	each(stone_args, function(e) {
		if (e[0] != current_color) opposite_cols.append(e);
	})
	return opposite_cols;
}
function updateBoard(board, x, y, col) {
	board[x][y] = col;
	var oppositeStones = null;
	//capture stones alogrithm
	//of the piece that was placed, we check each surrounding piece
	//check each liberty
	//as soon as one is the opposite color of 
	//the current piece were looking at
	//append those to a list
	var surr_stones = getSurroundingStones(x, y);

	if (surr_stones.length == 0) 
		return;

	else if (surr_stones.length > 0) {
		oppositeStones = getOpposite(surr_stones, col)

		if (oppositeStones.length == 0 || oppositeStones == null) 
			return;

		else if (oppositeStones.length > 0) {
			//we have opposite stones in our adjacent stones
			//we loop through the opposite stones
			each(oppositeStones, function(e) {

			})
		}
	}
	return board;
	

	//3. return board, number of white and black stones captured
}
function makeBoard() {
	var x_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
	var bored = getEmptyBoard();
	for (var i = 0; i < moveHistory.length; i++) {
		var currentTurn = moveHistory[i];
		var x = x_letters.indexOf(currentTurn[2]);
		var y = currentTurn[3]-1;
		bored = updateBoard(bored, x, y, currentTurn[1])
	}
	return bored;
}
function each(array, funky) {
	for (var i = 0; i < array.length; i++)
		funky(array[i]);
}
function setCurrentColor(c) {
	if (c == 'white')
		playerColor = 'w';
	else if (c == 'black')
		playerColor = 'b';
}
function drawGoPieces(surface) {
	if (moveHistory.length > 0) {
		for (var m = 0; m < moveHistory.length; m++) {
			if (moveHistory[m][2] != 'pass') {
				var positionArray = getXYCoords(moveHistory[m][2], moveHistory[m][3])
				drawGoPiece(surface, positionArray[0], positionArray[1], moveHistory[m][1]);
			}
		}	
	}
}
function addToData(turn, color, x, y) {
	moveHistory.push([turn, color, x, y]);
}
function addPassToData(turn, color, pass_string) {
	var arr = [turn, color, pass_string]
	moveHistory.push(arr);
}

function getXYCoords(letter,number) {
	var x_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
	var letter_index = x_letters.indexOf(letter.toUpperCase());
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

	if (x > 665)
		x = 665;
	else if (x < 35)
		x = 35;

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
function addCanvasListener(canvas, surface) {
	canvas.addEventListener('click', function(e) {
		var canvasRect = this.getBoundingClientRect();
		var gx = e.x - canvasRect.left;
		var gy = e.y - canvasRect.top;
		var igx = nearestIntersectionCoord(gx); 
		var igy = nearestIntersectionCoord(gy);
		var movePosition = getLetterNumberCoords(igx, igy);
		var isSpotTaken = checkSpotPosition(movePosition);
		//alert(igx + ' ' + igy);
		if (isSpotTaken) 
			alert("Please select a different spot");
		else {
			var turnToIncrement = 0;
			if (moveHistory.length > 0) 
				turnToIncrement = moveHistory[moveHistory.length-1][0];

			if (currentMoveData.length == 0) {
				currentMoveData = [turnToIncrement, playerColor, movePosition[0], movePosition[1]];
			
				drawGoPiece(surface, igx, igy, playerColor);
				hasPieceBeenDrawn = true;
			}
			else if (currentMoveData.length > 0) {
				surface.clearRect(0, 0, canvas.width, canvas.height);
				drawBoard(surface, canvas);
				drawGoPieces(surface);
				currentMoveData = [turnToIncrement, playerColor, movePosition[0], movePosition[1]];
				drawGoPiece(surface, igx, igy, playerColor);
				hasPieceBeenDrawn = true
			}
		}
	}, false);
}
function addNotYourTurnListener(canvas) {
	canvas.addEventListener('click', function() {
		alert("You must wait for the other player!!! Be Patient");
	}, false);
}
function retrieveAllTakenIntersections() {
	//this function loops through move history and stores each x, y coords in an array
	var currentTakenSpots = [];
	each(moveHistory, function(move) {
		currentTakenSpots.push([move[2], move[3]]);
	})
	return currentTakenSpots;
}
function checkSpotPosition(currentMoveArray) {
	var currentMoveIntersectionsTaken = retrieveAllTakenIntersections();
	for (var j = 0; j < currentMoveIntersectionsTaken.length; j++) {
		var currentTakenIntersection = currentMoveIntersectionsTaken[j];
		if (currentTakenIntersection[0] == currentMoveArray[0] && currentTakenIntersection[1] == currentMoveArray[1]) 
			return true;
	}
	return false;

}
function callAjaxNigga() {
	$.ajax({

		type: 'POST',
		data: {'subm': 'submit_ajax'},
		dataType: 'json',
		success: function(movesLengthFromServer) {
			
			if (movesLengthFromServer > moveHistory.length) {
				clearInterval(ajaxCalling);
				var chill = window.location;
				window.location = chill.protocol + '//' + chill.host + chill.pathname;
			}
		}
	});
}
function removeSubmitButton() {
	document.getElementById("submit_move_form").innerHTML = "";
}
function init() {
	var canvas = document.querySelector("canvas");
	var surface = canvas.getContext("2d");
	drawBoard(surface, canvas);
	drawGoPieces(surface);

	var colorOpp = {'b':'white', 'w':'black'}
	var currentPlayerTurn = document.getElementById('whose_turn');
	var lastPlayerTurnColor;

	if (moveHistory.length == 0) {
		currentPlayerTurn.innerHTML = "Black Goes First";
		if (playerColor == 'b') 
			addCanvasListener(canvas, surface);
		else {
			addNotYourTurnListener(canvas);
			removeSubmitButton();
			ajaxCalling = window.setInterval(callAjaxNigga, 4000);
		}
	}
	else {
		lastPlayerTurnColor = moveHistory[moveHistory.length-1][1];
		currentPlayerTurn.innerHTML = colorOpp[lastPlayerTurnColor].toUpperCase() + "'s turn";
		if (playerColor != lastPlayerTurnColor)
			addCanvasListener(canvas, surface);
		else {
			addNotYourTurnListener(canvas);
			removeSubmitButton();
			ajaxCalling = window.setInterval(callAjaxNigga, 4000);
		}
	}
}
function setFormSubmit() {
	var form = document.next_turn;
	if (form) {
		$(form).submit(function() {
			if (hasPieceBeenDrawn) {
				currentMoveData[0]++;
				form.move_to_add_db.value = currentMoveData.join(',');
				return true;
			}
			else {
				var confirmPass = confirm("Are you sure you want to pass?");
				if (confirmPass) {
					form.move_to_add_db.value = 'pass';
					return true;
				}
				else
					return false;
			}
		});
	}
}
window.onload = function() {

	console.log(moveHistory);
	init();
	setFormSubmit();
}

//once the user has clicked, do we want to have a button that says undo move so that they can pass after already placing a go PIECE_WIDTH
