/**
 * Created by hooman on 8/20/17.
 */
angular.module('motekhasesanApp')
	.controller('login', ['$scope', 'User', '$state', '$uibModal', '$cookies', '$rootScope',
		function ($scope, User, $state, $uibModal, $cookies, $rootScope) {
			$rootScope.stopLoading();
			if ($cookies.get('logged') == 'true') {
				if ($cookies.get('isProff') == 'false')
					$state.go('pages.projects')
				else
					$state.go('pages.dashboard');
			}
			$scope.resetPassModal = function () {
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'reset_password.html',
					controller: 'reset_password_ctrl'
				});
				modalInstance.result.then(function (selectedItem) {}, function () {});
			};
			$scope.loginInf = {
				username: '',
				password: ''
			};
			$scope.login_msg = '';
			$scope.showLoginMsg = false;
			var today = new Date();
			var expiresValue = new Date(today);
			expiresValue.setSeconds(today.getSeconds() + 25200);
			$scope.login = function () {
				User.login.signin({}, JSON.stringify($scope.loginInf), function (res) {
					$cookies.put('logged', 'true', {
						'expires': expiresValue
					});
					if (res.professions.length == 0 || res.professions == undefined)
						$cookies.put('isProff', 'false', {
							'expires': expiresValue
						});
					else
						$cookies.put('isProff', 'true', {
							'expires': expiresValue
						});
					User.set_user_id(res._id);
					$scope.showLoginMsg = false;
					$scope.activeUser = res;
					if (res.mobileVerified == false) {
						$state.go('validation', {
							'firstname': res.firstname,
							'user_id': res._id,
							'fromLogin': true
						});
					}
					else if (res.mobileVerified == true) {
						if ($cookies.get('isProff') == 'false')
							$state.go('pages.projects')
						else
							$state.go('pages.dashboard');
					}
				}, function (err) {
					$cookies.put('logged', 'false');
					$cookies.put('isProff', 'false');
					if (err.status == 401) {
						$scope.showLoginMsg = true;
						$scope.login_msg = 'رمزعبور یا شماره موبایل اشتباه است.'
					}
				})
			};
		}
	]);
