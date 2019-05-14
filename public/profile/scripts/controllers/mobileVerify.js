/**
 * Created by hooman on 3/9/17.
 */
angular.module('motekhasesanApp')
	.controller('mobileVerify', ['$scope', '$state', 'User', '$stateParams', '$http', '$cookies', '$timeout',
		function ($scope, $state, User, $stateParams, $http, $cookies, $timeout) {
			$scope.wrongCode = false;
			var today = new Date();
			var expiresValue = new Date(today);
			expiresValue.setSeconds(today.getSeconds() + 25200);

			$scope.submitCode = function () {
				$scope.wrongCode = false;
				User.sendVerifCod.save({}, {
					user_id: $stateParams.user_id,
					code: $scope.verifcode
				}, function (res) {
					$timeout(function () {
						$cookies.put('logged', 'true', {
							'expires': expiresValue
						});
					});
					$timeout(function () {
						$state.go('pages.dashboard');
					});
				}, function (err) {
					if (err) {
						$scope.wrongCode = true;
					}
				});
			};
			$scope.count = 0;
			$scope.errShow = false;
			$scope.successShow = false;
			$scope.resendCode = function () {
				$scope.count += 1;
				if ($scope.count >= 2) {
					$scope.errShow = true;
					$scope.successShow = false;
					$scope.errorMsg = 'امکان ارسال مجدد کد تایید وجود ندارد.'
				}
				else {
					User.sendVerifCodeAgain.get({
						user_id: $stateParams.user_id
					}, function (res) {
						$scope.successShow = true;
						$scope.errShow = false;
						$scope.successMsg = 'کد تایید با موفقیت برای شما ارسال شد.'
					}, function (err) {
						if (err) {
							console.log(err);
						}
					});
				}
			};
			if ($stateParams.fromLogin == true && $stateParams.fromLogin != null) {
				$scope.resendCode();
			}
			$scope.showLogin = ($stateParams.fromLogin) ? true : false;
			$scope.GetCode = function () {
				var get_code = {
					method: 'GET',
					url: config.api + 'verify-mobile/forgot/' + $stateParams.user_id + '/call',
					headers: {
						'Content-Type': 'application/json'
					}
				};
				$http(get_code).then(function (res) {
					// console.log(res);
				}, function () {});
			}
		}
	]);
