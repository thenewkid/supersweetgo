var moveHistory = [];
var hasPieceBeenDrawn = false;
var CELL_SPACING = 35;
var PIECE_WIDTH = 16;
var OFFSET = 10;
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
function isLastMovePass() {
	return (getLastMove()[2] == 'pass');
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

//takes in an x and y spot on our 2D board and returns a 2D array
//the arrays in the array will have length of 3 and only possible sides of the stone
//first element in the array is the color: posibilities of color are
//'e' for empty: 'w' for white, and 'b' for black
//the next 2 elements [1] and [2] are the x and y coords
function getSurroundingStones(down, over) {
	//coords of sourrounding pieces
	var west = null;
	var east = null;
	var south = null;
	var north = null;
	
	if (over != 0) west = [down, over-1];
	if (over != 18) east = [down, over+1];
	if (down != 0) north = [down-1, over];
	if (down != 18) south = [down+1, over];

	surr_stone_data = [];

	each([west, east, north, south], function(e) {
		if (e != null) surr_stone_data.push([board[e[0]][e[1]], e[0], e[1]]);
	})

	return surr_stone_data
}

function areSurrStonesEmpty(stone_list) {
	var bool = true;
	each(stone_list, function(stone) {
		if (stone[0] != 'e')
			bool = false;
	})
	return bool;
}
function areSurrStonesFull(stone_list) {
	var bool = true;
	each(stone_list, function(stone) {
		if (stone[0] == 'e')
			bool = false;
	}) 
	return bool;
}
function getOpposite(stone_args, current_color) {
	opposite_stones = []
	each(stone_args, function(e) {
		if (e[0] != current_color && e[0] != 'e') 
			opposite_stones.push(e);
	})
	return opposite_stones;
}
function updateBoard(howFarDown, howFarOver, col) {

	console.log("Placing col on board at ".replace('col', col) + howFarDown.toString() + " " + howFarOver.toString());
	board[howFarDown][howFarOver] = col;
	var captured_hoes = []
	console.log("getting surrounding stones...");
	var surr_stones = getSurroundingStones(howFarDown, howFarOver);
	if (areSurrStonesEmpty(surr_stones)) {
		console.log("No Surrounding stones");
		return
	}
	else {
		console.log("listing surrounding stones...");
		each(surr_stones, function(e) {
			console.log(e.toString());
		})
		console.log("getting opposite surrounding stones...");
		var opp_stones = getOpposite(surr_stones, col);
		if (opp_stones.length == 0) {
			console.log("No Opposite Stones");
			return
		}
		else {
			console.log("Listing opposite surrounding stones");
			each(opp_stones, function(e) {
				console.log(e.toString());
				console.log("calling getCapturedStones algorithm on " + e.toString());
				each(getCapturedStones(e), function(e) {
					captured_hoes.push(e)
				});

			});
			console.log("captured hoes is of length " + captured_hoes.length);
		}
	}
	each(captured_hoes, function(cs) {
		removePieceFromBoard(cs);
	});
}
function removePieceFromBoard(stone) {
	board[stone[1]][stone[2]] = 'e';
}
function addStoneToCaptured(stone) {
	if (stone[0] == 'w')
		capturedWhites.push(stone);
	else if (stone[0] == 'b') 
		capturedBlacks.push(stone);
}
function getSameColorStones(surrounding, color) {
	var stones = [];
	each(surrounding, function(s) {
		if (s[0] == color)
			stones.push(s);
	});
	return stones;
}

function getCapturedStones(stone) {
		function findCapturedStones(stones_left_to_check, captured_stones, stones_already_checked) {
			console.log('fcs stones_left_to_check is of length ' + stones_left_to_check.length)
			console.log('fcs captured_stones is of length ' + captured_stones.length)

			//0. base-case: if stones left to check is empty return list of captured stones
			//1. pop the first stone in stones left to check list 
			//   check if stone has empty liberties if so -> stop and return false;
			//2. now we know the current stone is surrounded
			//   add any same color surrounding stones to the stones left to check list ONLY if
			//   it is not in stones_already_checked_list, 
			//3. add next_stone to the list of stones to capture and to list of stones_already_checked 
			//4. recur with updated lists

			//step 0
			if (stones_left_to_check.length == 0) return captured_stones;
			//step 1
			var next_stone = stones_left_to_check.pop();
			var surrounding = getSurroundingStones(next_stone[1], next_stone[2]);
			if (!areSurrStonesFull(surrounding)) return [];
			//step 2
			var same_color_stones = getSameColorStones(surrounding, next_stone[0]);

			each(same_color_stones, function(stone) {
				var stone_exists_flag = false;
				each(stones_already_checked, function(s) {
					if (argsEqual(s,stone)) stone_exists_flag = true;
				});
				if (!stone_exists_flag) {
					stones_left_to_check.push(stone);	
				}
			});
			//step 3
			captured_stones.push(next_stone);
			stones_already_checked.push(next_stone);
			//step 4
			return findCapturedStones(stones_left_to_check, captured_stones, stones_already_checked);

	}
	return findCapturedStones([stone], [], []);
}
function makeBoard() {
	var x_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
	board = getEmptyBoard();
	for (var i = 0; i < moveHistory.length; i++) {
		var currentTurn = moveHistory[i];
		if (currentTurn[2] != 'pass') {
			var how_far_over = x_letters.indexOf(currentTurn[2]);
			var how_far_down = currentTurn[3]-1;
			//board[y][x] = currentTurn[1];
			updateBoard(how_far_down, how_far_over, currentTurn[1])
		}
	}
}

function argsEqual(arr1, arr2) {
	return arr1.join('') == arr2.join('');
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
	makeBoard();
	if (moveHistory.length > 0) {
		for (var x = 0; x < board.length; x++) {
			for (var y = 0; y < board[x].length; y++) {
				if (board[x][y] != 'e') {
					var coords = getXY(x, y);
					drawGoPiece(surface, coords[0], coords[1], board[x][y])
				}	
			}
		}
	}
}
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
	surface.arc(x+OFFSET, y+OFFSET, PIECE_WIDTH, (Math.PI/180)*0, (Math.PI/180)*360, false);
	surface.fill();
	surface.stroke();
	surface.closePath();
}
function drawBoard(surface, canvas) {
	surface.strokeStyle = "black";
	surface.lineWidth = 1.5;
	surface.fillStyle = "black";
	var y = CELL_SPACING+OFFSET;
	var x = CELL_SPACING+OFFSET;

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

	y = CELL_SPACING+OFFSET;
	x = CELL_SPACING+OFFSET;

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
	return [boardY,boardX];
}
function checkIfTaken(arr) {
	return board[arr[0]][arr[1]] != 'e';
}
function drawFromBoard(surface) {
	for (var x = 0; x < board.length; x++) {
		for (var y = 0; y < board[x].length; y++) {
			if (board[x][y] != 'e') {
				var coords = getXY(x, y);
				drawGoPiece(surface, coords[0], coords[1], board[x][y])
			}	
		}
	}
}
function setCurrentMoveData(i, pc, mp0, mp1) {
	currentMoveData = [i, pc, mp0, mp1];
}
function drawThePiece(surf, can, x, y, pc) {
	surf.clearRect(0, 0, can.width, can.height);
	drawBoard(surf, can);
	drawFromBoard(surf);
	drawGoPiece(surf, can, x, y, pc);
}
function setDrawnTrue() {
	hasPieceBeenDrawn = true;
}
function addCanvasListener(canvas, surface) {
	canvas.addEventListener('click', function(e) {
		var alertInvalidMoveFlag = false;
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
			//get the piece thats being placed and get its xy coords
			//for our 2d board array
			//then we get the surrounding stones 
			//if surrounding stones arent full we place the piece
			//else if surrounding stones are full we get the opposite stones
			//if opposite stones == 4 we call our algo on the opposite stones
			//if the captured stones isnt empty then the move is valid
			//else if oppositestones is between 0 and 4 we know have at least one color of the same stone
			//then we call our algo on the same color stones and if those are captured we alert Invalid Move
			//else if captured stones are empty we allow the piece to be played
			var stone = [board[boardDimClicked[0]][boardDimClicked[1]], boardDimClicked[0], boardDimClicked[1]];
			var surrounding = getSurroundingStones(stone[1], stone[2]);
			if (!areSurrStonesFull(surrounding)) {
				//code to draw a piece on the board;

				surface.clearRect(0, 0, canvas.width, canvas.height);
				drawBoard(surface, canvas);
				drawFromBoard(surface);
				currentMoveData = [turnToIncrement, playerColor, movePosition[0], movePosition[1]];
				drawGoPiece(surface, igx, igy, playerColor);
				hasPieceBeenDrawn = true;
			}
			else {
				var oppStones = getOpposite(surrounding, playerColor);
				console.log("these are opposite stones for stone " + stone.toString())
				if (oppStones.length == 0) {
					surface.clearRect(0, 0, canvas.width, canvas.height);
					drawBoard(surface, canvas);
					drawFromBoard(surface);
					currentMoveData = [turnToIncrement, playerColor, movePosition[0], movePosition[1]];
					drawGoPiece(surface, igx, igy, playerColor);
					hasPieceBeenDrawn = true;
				}
				else if (oppStones.length == 4) {
					each(oppStones, function(stone) {
						var capturedStones = getCapturedStones(stone);
						if (capturedStones.length != 0) {
							//code to draw a piece on the board;
							surface.clearRect(0, 0, canvas.width, canvas.height);
							drawBoard(surface, canvas);
							drawFromBoard(surface);
							currentMoveData = [turnToIncrement, playerColor, movePosition[0], movePosition[1]];
							drawGoPiece(surface, igx, igy, playerColor);
							hasPieceBeenDrawn = true;
						}
						else {
							alertInvalidMoveFlag = true;
						}
					});
				}
				else if (oppStones.length > 0 && oppStones.length < 4) {
					var sameColorSurrounding = getSameColorStones(surrounding, stone[0]);
					each(sameColorSurrounding, function(stone) {
						var capturedStones = getCapturedStones(stone);
						if (capturedStones.length != 0) {
							//code to draw a piece on the board;
							surface.clearRect(0, 0, canvas.width, canvas.height);
							drawBoard(surface, canvas);
							drawFromBoard(surface);
							currentMoveData = [turnToIncrement, playerColor, movePosition[0], movePosition[1]];
							drawGoPiece(surface, igx, igy, playerColor);
							hasPieceBeenDrawn = true;
						}
						else {
							alertInvalidMoveFlag = true;
						}
					})	
				}
			}
			if (alertInvalidMoveFlag) {
				alert("Invalid Move Bitch");
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

function setTurn(turn_ele, canvas, surface) {
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
function updateSubmitButton(button_strang) {
	var submit_button = document.getElementById('submit_hoes_to_the_pimp');
	if (button_strang == 'pass') {
		submit_button.innerHTML = "PASS";
	}
	else if (button_strang == "submit") {
		submit_button.innerHTML = "SUBMIT MOVE";
	}
}
//FOR A TRIPPY BUTTON WHEN ME AND MY BRO ARE BROGRAMMING WHILE TRIPPING BRO-BALLS
// function bangblackbitches() {
// 	var chill_nigga = window.setInterval(changeCol, 300);
// }
// function changeCol() {
// 	colors = ['blue', 'green', 'black', 'white', 'purple', 'red'];
// 	var rando_color = colors[Math.floor(Math.random() * colors.length)]
// 	document.getElementById("submit_hoes_to_the_pimp").style.color = rando_color;
// 	var rando_color = colors[Math.floor(Math.random() * colors.length)];
// 	document.getElementById("submit_hoes_to_the_pimp").style.background = rando_color;

// }
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
		setTurn(currentPlayerTurn, canvas, surface);
	}
}
function calculate_territory() {
	alert("I hope this runs");
	console.log("Starting calculate territory function");
	var inters_already = [];

	function find_inters(border_stones, inters_to_check, inters_already) {
		//get surrounding stones, if one is white and one is black we return
		//if their all the same color then we check to see if the opp color is in 
		//border_stones, if it is we return
		if (inters_to_check.length == 0) return inters_already;
		var next_inter = inters_to_check.pop();
		console.log("next intersection to check is " + next_inter.toString())
		// get all the neighboring locations
		console.log("listing neighbors...")
		var neighbors = getSurroundingStones(next_inter[1], next_inter[2])	// if any are stones, add them to the border list, unless they conflict, in which case just fail
		console.log(neighbors);
		console.log("looping through neighbors now");
		for(var i=0; i < neighbors.length;i++) {
			if (neighbors[i][0] == 'e') {
				console.log("")
				var flag = false;
				each(inters_already, function(e) {
					if (argsEqual(neighbors[i], e)) {
						flag = true;
					}
				})
				if (!flag) {
					console.log("adding neighbor" + neighbors[i].toString() + " to inters_to_check");
					inters_to_check.push(neighbors[i]);
				}
			}
			else if (border_stones.length == 0) {
				//we know this is our ifrst stone
				console.log("adding " + neighbors[i].toString() + "to border stones")
				border_stones.push(neighbors[i]);
			}
			else {
				if (neighbors[i][0] != border_stones[0][0]) {
					return [];
				}
			}
		}
		find_inters(border_stones, inters_to_check, inters_already);
	}
	console.log("looping through each intersection");
	for (var down = 0; down < 19; down++) {
		for (var over = 0; over < 19; over++) {
			if (board[down][over] == 'e') {
				var current_inter = [board[down][over], down, over];
				console.log("robot has reached empty intersection at " + down + ',' + over )
				console.log("calling find_inters algorithm on " + down + "," + over);
				if (inters_already.length > 0) {
					var flag = false;
					each(inters_already, function(e) {
						if (argsEqual(e, current_inter))
							flag = true;
					})
					//if current intersection has not already been checked
					if (!flag) {
						var inters = find_inters([], [current_inter], inters_already);
						if (inters.length > 0) {
							each(inters, function(i) {
								inters_already.push(i);
							})
							console.log("printing calculated intersections now");
							console.log(inters);
						}
					}
				}
				else if (inters_already.length == 0) {
					var inters = find_inters([], [current_inter], inters_already);
					if (inters.length > 0) {
						each(inters, function(i) {
							inters_already.push(i);
						})
						console.log("Printing calculated intersections");
						console.log(inters);
					}
				}
			}
		}
	}
}
function setFormSubmit() {
	var submit_move_form = document.next_turn;
	//unnecessary if statement but whatever
	if (submit_move_form) {
		$(submit_move_form).submit(function() {
			if (hasPieceBeenDrawn) {
				currentMoveData[0]++;
				submit_move_form.move_to_add_db.value = currentMoveData.join(',');
				return true;
			}
			else {
				alert("You Must make a move before!!!")
				return false;
			}
		});
	}
	var submit_pass_form = document.pass_form;
	$(submit_pass_form).submit(function() {
		if (isLastMovePass()) {
			var game_over = confirm("Your opponent just passed. That means If you pass the game is over. Are you sure you want to pass and end the game?");
			if (game_over) {
				alert("Running game_over algorithm now");
				//for each intersection we call calculate_territory its surrounding stones
				//calculate_territory();
				alert("Finished calculating score Dylan");
				//after we calculate score and send emails we freeze the board how it is and remove buttons and forms
				return false;
			}
			else
				return false;
		}
		else {
			var user_pass = confirm("Are you sure you want to pass");
			if (user_pass) return true;
		}
	})

}
window.onload = function() {
	console.log(moveHistory);
	init();
	setFormSubmit();
	
}
//get the last move in moveHistory
				//if its a pass then we alert the user that 
				//if they continue the game will be over
				// var lastMovePass = (getLastMove()[2] == 'pass');
				// if (lastMovePass)
				// 	var passSecondTimeGameOver = confirm("Are you sure you want to pass, 2 passes in row mean Game Over!!");
				// 	if (passSecondTimeGameOver)
				// var confirmPass = confirm("Are you sure you want to pass?");
				// if (confirmPass) {
				// 	form.move_to_add_db.value = 'pass';
				// 	return true;
				// }
				// else
				// 	return false;