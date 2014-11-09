var moveHistory = [];
var CELL_SPACING = 35;
var PIECE_WIDTH = 16;

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
	for (i = 0; i < moveHistory.length; i++) {
		alert(moveHistory[i]);
	}
}

function getXYCoords(letter,number) {

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

window.onload = function() {
	var canvas = document.querySelector("canvas");
	var surface = canvas.getContext("2d");
	var y = CELL_SPACING;
	var x = CELL_SPACING;
	surface.strokeStyle = "black";
	surface.lineWidth = 0.5;
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


	for (var m = 0; m < moveHistory.length; m++) {
	}


	canvas.addEventListener('click', function(e) {
		var canvasRect = this.getBoundingClientRect();
		var gx = e.x - canvasRect.left;
		var gy = e.y - canvasRect.top;
		var igx = nearestIntersectionCoord(gx); 
		var igy = nearestIntersectionCoord(gy);
		//alert(igx + ' ' + igy);
		surface.strokeStyle = 'black';
		surface.fillStyle = 'black';
		surface.lineWidth = 1;
		surface.beginPath();
		surface.arc(igx, igy, PIECE_WIDTH, (Math.PI/180)*0, (Math.PI/180)*360, false)
		surface.fill();
		surface.stroke();
		surface.closePath();
	}, false);
	// surface.strokeStyle = "black";
	// surface.lineWidth = 2;
	// surface.beginPath();
	// surface.moveTo(0, 10);
	// surface.lineTo(canvas.width, 10);
	// surface.stroke();
	// surface.closePath();
}