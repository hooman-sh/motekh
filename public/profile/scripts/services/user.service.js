'use strict';
angular.module('motekhasesanApp').factory('User', ['$resource', '$cookies', '$http', function($resource, $cookies, $http) {
	var output = {};
	output.set_user_id = function(id) {
		var today = new Date();
		var expiresValue = new Date(today);
		expiresValue.setSeconds(today.getSeconds() + 2520000);
		$cookies.put('user_id', id, {
			'expires': expiresValue
		})
	};
	output.get_user_id = function() {
		return $cookies.get('user_id');
	};
	output.registerUser = $resource(config.api + 'signup', {}, {
		save: {
			method: 'POST'
		}
	});
	output.dashboard = $resource(config.api + 'dashboard', {});
	output.login = $resource(config.api + 'login', {}, {
		signin: {
			method: 'POST'
		}
	});
	output.resendPass = $resource(config.api + 'reset-password', {}, {
		save: {
			method: 'POST'
		}
	});
	output.getproffesions = $resource(config.api + 'signup', null, {
		'update': {
			method: 'PUT'
		}
	});
	output.getProfs = $resource(config.api + 'professions');
	output.sendVerifCod = $resource(config.api + 'verify-mobile', {}, {
		save: {
			method: 'POST'
		}
	});
	output.sendVerifCodeAgain = $resource(config.api + 'verify-mobile/forgot/:user_id', {
		user_id: '@user_id'
	}, {
		save: {
			method: 'POST'
		}
	});
	output.messages = $resource(config.api + 'dashboard/messages/chats/:mobile', {
		mobile: '@mobile'
	}, {
		'save': {
			method: 'POST'
		}
	});
	output.updateProfile = $resource(config.api + 'dashboard/profile', {}, {
		change: {
			method: 'PUT'
		}
	});
	output.uploadFileToUrl = function(file, uploadUrl, name) {
		var fd = new FormData();
		fd.append(name, file);
		$http.put(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}, function(response) {
			console.log(response);
		}, function(err) {
			console.log(err);
		})
	}
	output.addIntro = $resource(config.api + 'dashboard/professions/:proffId', {
		proffId: '@proffId'
	}, {
		put: {
			method: 'PUT'
		}
	});
	output.checkAuthentication = $resource(config.api + 'login');
	output.resetPass = $resource(config.api + 'dashboard/password', {}, {
		save: {
			method: 'POST'
		}
	});
	output.removeProff = $resource(config.api + 'dashboard/professions/:porffId/remove', {
		porffId: '@porffId'
	}, {
		delete: {
			method: 'POST'
		}
	})
	output.logout = $resource(config.api + 'logout', {}, {})
	output.visit = $resource(config.api + 'dashboard/welcome', {}, {})
	return output;
}]);
