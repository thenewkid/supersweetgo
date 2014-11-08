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