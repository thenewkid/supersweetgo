var moveHistory = [];
var hasPieceBeenDrawn = false;
var CELL_SPACING = 35;
var PIECE_WIDTH = 16;
var playerColor;
var currentMoveData = [];
var ajaxCalling;
var board = [];
var colorOpp = {'b':'white', 'w':'black'};
//the 4 functions below the globals are for returning specific information
//about the last move in moveHistory;
function getLastMove() {
	return moveHistory[moveHistory.length-1];
}
function getLastMoveColor() {
	return getLastMove()[1];
}
function getLastMoveTurn() {
	return getLastMove()[0];
}
function getLastMoveCoords() {
	return [getLastMove()[2], getLastMove()[3]];
}

//creates and returns a 19 X 19 2d list all filled with 'e'
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

//getCapturedStones takes in an opposite_stone of the current piece
//we are looking at. The opposite_stone param will be 
//an array with 3 elements, the color of the stone were checking, its x and y values
function getCapturedStones(opposite_stone, x, y) {
	var capture_color = opposite_stone[0]
	var stones_to_be_captured = [];
	var surrounding = getSurroundingStones(opposite_stone[1], opposite_stone[2])
	if (sourrounding.length == 4) {
		for (var i = 0; i < surrounding.length; i++) {
			var s  = surrounding[i];
			if (s[1] != x && s[2] != y && s[0] == capture_color) {
				//
			}
		}
		stones_to_be_captured.append(opposite_stone)
	}
	return stones_to_be_captured;	
}

//takes in an x and y spot on our 2D board and returns a 2D array
//the arrays in the array will have length of 3 and only possible sides of the stone
//first element in the array is the color: posibilities of color are
//'e' for empty: 'w' for white, and 'b' for black
//the next 2 elements [1] and [2] are the x and y coords
function getSurroundingStones(ex, why) {
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

//takes in a list of surrounding stones and color of current stone
//returns a list of opposite colored stones if any
function getOpposite(stone_args, current_color) {
	opposite_cols = []
	each(stone_args, function(e) {
		if (e[0] != current_color && e[0] != 'e') opposite_cols.append(e);
	})
	return opposite_cols;
}
function updateBoard(x, y, col) {
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
				//[['c', 1, 2]]
				var capturedStones = getCapturedStones(e, x, y);

			})
		}
	}
	return board;
	

	//3. return board, number of white and black stones captured
}
function makeBoard() {
	var x_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
	board = getEmptyBoard();
	for (var i = 0; i < moveHistory.length; i++) {
		var currentTurn = moveHistory[i];
		if (currentTurn[2] != 'pass') {
			var x = x_letters.indexOf(currentTurn[2]);
			var y = currentTurn[3]-1;
			board[y][x] = currentTurn[1];
			//updateBoard(board, x, y, currentTurn[1])
		}
	}
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
		makeBoard();
		for (var x = 0; x < board.length; x++) {
			for (var y = 0; y < board[x].length; y++) {
				if (board[x][y] != 'e') {
					var coords = getXY(x, y);
					console.log(coords);
					drawGoPiece(surface, coords[0], coords[1], board[x][y])
				}	
			}
		}
	}
}
	// 	for (var m = 0; m < moveHistory.length; m++) {
	// 		if (moveHistory[m][2] != 'pass') {
	// 			var positionArray = getXYCoords(moveHistory[m][2], moveHistory[m][3])
	// 			drawGoPiece(surface, positionArray[0], positionArray[1], moveHistory[m][1]);
	// 		}
	// 	}	
	// }
	//if movehistory > 0 we call makeBoard()
	//that will set our global board to be set
	//then we loop through our 2d board
	//if the current element != 'e', then we call drawGoPiece(surface, )
function getXY(x, y) {
	var ex = (y+1)*35;
	var y = (x+1)*35;
	return [ex,y];
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
function coordsToBoardDim(ix, iy) {
	var boardX = (ix / 35)-1;
	var boardY = (iy /35)-1;
	return [boardY, boardX];
}
function checkIfTaken(arr) {
	var spot = board[arr[0]][arr[1]];
	return spot != 'e';
}
function addCanvasListener(canvas, surface) {
	canvas.addEventListener('click', function(e) {
		var canvasRect = this.getBoundingClientRect();
		var gx = e.x - canvasRect.left;
		var gy = e.y - canvasRect.top;
		var igx = nearestIntersectionCoord(gx); 
		var igy = nearestIntersectionCoord(gy);
		var boardDimClicked = coordsToBoardDim(igx, igy);
		var isSpotTaken = checkIfTaken(boardDimClicked);
		var movePosition = getLetterNumberCoords(igx, igy);
		//var isSpotTaken = checkSpotPosition(movePosition);
		//alert(igx + ' ' + igy);
		if (isSpotTaken) 
			alert("Please select a different spot");
		else {
			var turnToIncrement = 0;
			if (moveHistory.length > 0) 
				turnToIncrement = getLastMoveTurn();

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
function setAjaxPosting() {
	//we set the page to post every 10 seconds
	//every 10 seconds we get the 
	//get mouse coords every 20 seconds
	//if mouse coords are the same then we stop
}
function setAjax(timer) {
	ajaxCalling = window.setInterval(callAjaxNigga, timer);
}
function clearAjax() {
	clearInterval(ajaxCalling);
}
function reloadPage() {
	var chill = window.location;
	window.location = chill.protocol + '//' + chill.host + chill.pathname;
}
function refresh() {
	clearAjax();
	reloadPage();
}
function callAjaxNigga() {
	$.ajax({

		type: 'POST',
		data: {'subm': 'submit_ajax'},
		dataType: 'json',
		success: function(movesLengthFromServer) {
			
			if (movesLengthFromServer > moveHistory.length) {
				refresh();
			}
		}
	});
}
function removeSubmitButton() {
	document.getElementById("submit_move_form").innerHTML = "";
}
function isBeginning() {
	return moveHistory.length == 0;
}
function setBlackFirst(turn_element) {
	turn_element.innerHTML = "Black Goes First";
}
function applyNoTurn(cvas) {
	addNotYourTurnListener(cvas);
	removeSubmitButton();
	setAjax(10000);
}

function setHtml(html_element, content) {
	html_element.innerHTML = content;
}

function setTurn(canvas, surface) {
	var turn_ele = document.getElementById("whose_turn");
	setHtml(turn_ele, colorOpp[getLastMoveColor()].toUpperCase() + "'s Turn");
	lastPlayerTurnColor = getLastMoveColor();
	if (playerColor != lastPlayerTurnColor)
		addCanvasListener(canvas, surface);
	else 
		applyNoTurn(canvas);
}

function isBlack() {
	return playerColor == 'b';
}
function isWhite() {
	return playerColor == 'w';
}
function init() {
	var canvas = document.querySelector("canvas");
	var surface = canvas.getContext("2d");
	drawBoard(surface, canvas);
	drawGoPieces(surface);

	var currentPlayerTurn = document.getElementById('whose_turn');

	if (isBeginning()) {
		setBlackFirst(currentPlayerTurn);

		if (isBlack()) {
			addCanvasListener(canvas, surface);
		}
		else if (isWhite()) {
			applyNoTurn(canvas);
		}
	}
	else if (!isBeginning()) {
		setTurn(canvas, surface);
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
