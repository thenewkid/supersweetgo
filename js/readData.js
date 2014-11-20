var moveHistory = [];
var hasPieceBeenDrawn = false;
var CELL_SPACING = 35;
var PIECE_WIDTH = 16;
var playerColor;
var currentMoveData = [];

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
		// url: document.URL.substring(23),
		//all ajax does is send a post request asking for the length of the moves from the server
		//if this length is higher, then we reload the page, 
		//a better way to do this might be to send the current length of the move History to ther server
		//and if the length of the move history on the server is greater than the one we sent then
		//we send the new move history array of data as json homie 
		type: 'POST',
		data: {'moveHistoryLength':moveHistory.length},
		dataType: 'json',
		success: function(movesLengthFromServer) {
			if (movesLengthFromServer > moveHistory.length)
				location.reload(true);
				return

			// if (data['hasMoveHistoryChanged'] == true)
			// 	location.reload(true);
		}
	})
}
function removeSubmitButton() {
	var button = document.getElementById("submit_hoes_to_the_pimp");
	document.next_turn.removeChild(button);
}
function init() {
	var canvas = document.querySelector("canvas");
	var surface = canvas.getContext("2d");

	drawBoard(surface, canvas);
	drawGoPieces(surface);

	var colorOpp = {'b':'white', 'w':'black'}
	var currentPlayerTurn = document.getElementById('current_turn');
	var lastPlayerTurnColor;

	if (moveHistory.length == 0) {
		currentPlayerTurn.innerHTML = "Black Goes First";
		if (playerColor == 'b') 
			addCanvasListener(canvas, surface);
		else {
			addNotYourTurnListener(canvas);
			removeSubmitButton();
			window.setInterval(callAjaxNigga, 4000);
		}
	}
	else {
		lastPlayerTurnColor = moveHistory[moveHistory.length-1][1];
		currentPlayerTurn.innerHTML = colorOpp[lastPlayerTurnColor] + "'s turn";
		if (playerColor != lastPlayerTurnColor)
			addCanvasListener(canvas, surface);
		else {
			addNotYourTurnListener(canvas);
			removeSubmitButton();
			window.setInterval(callAjaxNigga, 4000);
		}
			
		
	}
}
window.onload = function() {
	console.log(moveHistory);
	init();
	var form = document.next_turn;
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

//once the user has clicked, do we want to have a button that says undo move so that they can pass after already placing a go PIECE_WIDTH
