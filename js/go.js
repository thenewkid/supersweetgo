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
function checkDim(w, h) {
	if (w == '' || h == '')
		return false;
	else if (isDigit(w) && isDigit(h)) {
		if (w >= 4 && w <= 19 && h <= 19 && h >= 4)
			return true;
	}
	else return false;
}
function setHtml(element, content) {
	element.innerHTML = content;
}
function assignOninput(ie) {
	ie.oninput = checkInput;
}
function checkInput() {
	var checkmark = '&#10004;';
	if (this.name == 'w' || this.name == 'h') {
		var widHei = document.getElementById('hw'); 
		var width = document.getElementById('width').value;
		var height = document.getElementById('height').value;
		if (checkDim(width, height)) {
			setColor(widHei, 'green');
			setHtml(widHei, checkmark);
		}
		else 
			setHtml(widHei, '');
	}
	else if (this.name == 'player1_name' || this.name == 'player2_name') {
		var pNameStatus = document.getElementById(this.name);
		if (this.value != ''){
			setColor(pNameStatus, 'green');
			setHtml(pNameStatus, checkmark);
		}
	}
	else if (this.name == 'p1_email' || this.name == 'p2_email') {
		var emailStatus = document.getElementById(this.name);
		if (this.value != '' && !validEmail(this.value)) {
			setColor(emailStatus, 'red');
			setHtml(emailStatus, "<b style='font-size:15px;''>Email Invalid</b>");
		}
		else if (this.value == '') {
			setHtml(emailStatus, '');
		}
		else if (this.value != '' && validEmail(this.value)) {
			setColor(emailStatus, 'green');
			setHtml(emailStatus, checkmark);
		}
	}
};
function switchColors() {
	var p1_color = document.getElementById('p1_col');
	var p2_color = document.getElementById('p2_col');
	var temp = p1_color.innerHTML;
	p1_color.innerHTML = p2_color.innerHTML;
	p2_color.innerHTML = temp;
}
function assignInputs() {
	var inputs = getInputs();
	each(inputs,assignOninput);
	var switchColorButton = document.getElementById('switch_cols');
	switchColorButton.onclick = switchColors;
};
$(document).ready(function() {
	assignInputs();
})
$(document.create_game_form).submit(function() {
	var formErrors = {};
	var form = document.create_game_form;

	var width = form.w.value;
	var height = form.h.value;
	var p1Name = form.player1_name.value;
	var p1Email = form.p1_email.value;
	var p1_color = document.getElementById('p1_col').innerHTML;
	var p2Name = form.player2_name.value;
	var p2Email = form.p2_email.value;
	var p2_color = document.getElementById('p2_color').innerHTML;

	if ((width < 4 || width > 19) || (height < 4 || height > 19)) 
		$('#hw_err').html("Height and Width must be between 4 and 19");
	return false;
	
})
function checkDimensions(arr) {
}






