'use strict'
var ref = new Wilddog('https://analysis.wilddogio.com/');
var usersRef = new Wilddog('https://analysis.wilddogio.com/users/');

$('#exit').click(function() {
	ref.unauth();
})

$('#regist').click(function(){
	var moreinfo = 0;
	var _moreinfo = 1;
	var input = $('#signUp .validate');
	var select = $('#signUp .select-dropdown li');
	var workField = [];
	for (var i = 0; i < input.length; i++) {
		if (!input.eq(i).hasClass('valid')) {
			moreinfo = 1;
		}
	}
	for (var i = 0; i < select.length; i++) {
		if (select.eq(i).hasClass('active') && !moreinfo) {
			var _moreinfo = 0;
			workField.push(select.eq(i).text());
		}
	}
	if (!moreinfo && !_moreinfo) {
		var email = $('#newEmail').val();
		var username = $('#username').val();
		var company = $('#company').val();
		var infoFrom = $('input[type=radio]:checked').next().text();
		var authData = ref.getAuth();
		usersRef.push({
			'uid': authData.uid,
			'username': username,
			'email': email,
			'company': company,
			'field': workField,
			'infoFrom': infoFrom
		});
		location.reload();
	} else {
		Materialize.toast('请完善所有信息。', 3000);
	}
})

ref.onAuth(function() {
	var authData = ref.getAuth();
	authDataCallback(authData)
});

function renderAll(){
	console.log('u r lucky')
}

function moreInfo(){
	$('#tab2').show();
}

function authDataCallback(authData) {
	if (authData) {
		var uid = cutString(authData.uid, ':');
		$('#uid').text(uid);
		usersRef.orderByChild('uid').equalTo(authData.uid).on('value', function(snapshot) {
			if (snapshot.val()) {
				renderAll(snapshot.val());
			}else{
				moreInfo();
			}
		})
	} else {
		window.location.href = 'regist.html';
	}
}

function cutString(string, start, end) {
	var s = string.indexOf(start)
	var result
	if (s > -1) {
		var _string = string.substr(s + start.length)
		if (end != null) {
			var _s = _string.indexOf(end)
		} else {
			var _s = _string.length
		}
		if (_s > -1) {
			result = _string.substr(0, _s)
		} else {
			result = ''
		}
	} else {
		result = ''
	}
	return result
}