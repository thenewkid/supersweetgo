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
function assignInputs() {
	var inputs = getInputs();
	each(inputs,assignOninput);
	var radios = document.getElementsByClassName('ballin');
	each(radios, function(e) {
		e.onclick = function() {
			alert(this);
		}
	})


};



$(document).ready(function() {
	assignInputs();
})







