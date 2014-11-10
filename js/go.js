function isDigit(strang) {
	return (/^\d+$/.test(strang));
}
function validEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
function validTele(string_nums) {
	return /^\d{10}$/.test(string_nums);
};
function getForm(form_name) {
	return document.form_name;
};
function getInputs() {
	return document.getElementsByTagName('input');
};
function setColor(element, color) {
	element.style.color = color;
}
function each(arr, funky) {
	for (var i = 0; i < arr.length; i++) {
		funky(arr[i]);
	}
};

$(document).ready(function() {
})
//$(document.create_game_form).submit(function() {

	// var formErrors = {};
	// var form = document.create_game_form;

	// var width = form.w.value;
	// var height = form.h.value;
	// var p1Name = form.player1_name.value;
	// var p1Email = form.p1_email.value;
	// var p1_color = document.getElementById('p1_col').innerHTML;
	// var p2Name = form.player2_name.value;
	// var p2Email = form.p2_email.value;
	// var p2_color = document.getElementById('p2_color').innerHTML;

	// //if ((width < 4 || width > 19) || (height < 4 || height > 19)) 
	// 	// $('#hw_err').html("Height and Width must be between 4 and 19");
	// return false;
	
//})






