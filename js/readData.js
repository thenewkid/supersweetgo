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

window.onload = function() {
	var canvas = document.querySelector("canvas");
	var surface = canvas.getContext("2d");
	var y = 35;
	var x = 0;
	surface.strokeStyle = "black";
	surface.lineWidth = 0.5;
	for (var j = 0; j < 17; j++) {
		surface.beginPath();
		surface.moveTo(x, y);
		surface.lineTo(canvas.width, y);
		surface.stroke();
		y += 35;
	}
	y = 0;
	x = 35;
	for (var k = 0; k < 17; k++) {
		surface.beginPath();
		surface.moveTo(x, y);
		surface.lineTo(x, canvas.height);
		surface.stroke();
		x += 35;
	}

	// surface.strokeStyle = "black";
	// surface.lineWidth = 2;
	// surface.beginPath();
	// surface.moveTo(0, 10);
	// surface.lineTo(canvas.width, 10);
	// surface.stroke();
	// surface.closePath();
}