'use strict'
var ref = new Wilddog('https://analysis.wilddogio.com/');
var usersRef = new Wilddog('https://analysis.wilddogio.com/users/');

ref.onAuth(function() {
	var authData = ref.getAuth();
	authDataCallback(authData)
});

$('#default').click(function() {
	var email = $('#email').val();
	var password = $('#password').val();
	ref.authWithPassword({
		email: email,
		password: password
	}, defaultAuthHandler);
})

$('#weibo').click(function() {
	ref.authWithOAuthRedirect("weibo", authHandler);
})

$('#qq').click(function() {
	ref.authWithOAuthRedirect("qq", authHandler);
})

$('#regist').click(function() {
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
		var password = $('#newPassword').val();
		var username = $('#username').val();
		var company = $('#company').val();
		var infoFrom = $('input[type=radio]:checked').next().text();
		ref.createUser({
				email: email,
				password: password
			},
			function(error, data) {
				if (error != null) {
					Materialize.toast('注册失败，请稍后再试。', 3000);
				} else {
					usersRef.push({
						'uid': data.uid,
						'username': username,
						'email': email,
						'company': company,
						'field': workField,
						'infoFrom': infoFrom
					});
					window.location.href = 'customer.html?user=' + data.uid;
				}
			})
	} else {
		Materialize.toast('请完善所有信息。', 3000);
	}
})

function authDataCallback(authData) {
	if (authData) {
		window.location.href = 'customer.html?user=' + authData.uid;
	} else {
		console.log("User is logged out");
	}
}

function authHandler(error, authData) {
	if (error) {
		console.log(error);
	} else {
		console.log("Authenticated successfully with payload:", authData);
	}
}

function defaultAuthHandler(error, authData) {
	if (error) {
		Materialize.toast('用户名或密码错误。', 3000);
	} else {
		window.location.href = 'customer.html?user=' + authData.uid;
	}
}