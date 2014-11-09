var globalData = [];

function addToData(turn, color, x, y) {
	// remember x is a letter and y is a number
	var curr_move = [];
	curr_move.push(turn);
	curr_move.push(color);
	curr_move.push(x);
	curr_move.push(y);

	globalData.push(curr_move);
}
function showData() {
	for (i = 0; i < globalData.length; i++) {
		alert(globalData[i]);
	}
}

function nearestIntersectionCoord(x) {
	if ((x % 35) > (35 / 2)) {
		x = (Math.floor(x / 35) * 35) + 35;
	} 
	else{
		x = (Math.floor(x / 35) * 35);	
	}
	return x;
}

window.onload = function() {
	var canvas = document.querySelector("canvas");
	var surface = canvas.getContext("2d");
	var CELL_SPACING = 35
	var y = CELL_SPACING;
	var x = CELL_SPACING;
	surface.strokeStyle = "black";
	surface.lineWidth = 0.5;
	for (var j = 0; j < 19; j++) {
		surface.beginPath();
		surface.moveTo(x, y);
		surface.lineTo(canvas.width-35, y);
		surface.stroke();
		y += CELL_SPACING;
		surface.closePath();
	}
	y = CELL_SPACING;
	x = CELL_SPACING;
	for (var k = 0; k < 19; k++) {
		surface.beginPath();
		surface.moveTo(x, y);
		surface.lineTo(x, canvas.height-35);
		surface.stroke();
		x += CELL_SPACING;
		surface.closePath();
	}
	canvas.addEventListener('click', function(e) {
		var canvasRect = this.getBoundingClientRect();
		var gx = e.x - canvasRect.left;
		var gy = e.y - canvasRect.top;
		var igx = nearestIntersectionCoord(gx); 
		var igy = nearestIntersectionCoord(gy);
		//alert(igx + ' ' + igy);
		surface.strokeStyle = 'green';
		surface.lineWidth = 1;
		surface.beginPath();
		surface.arc(igx, igy, 16, (Math.PI/180)*0, (Math.PI/180)*360, false)
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