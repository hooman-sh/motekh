angular.module('motekhasesanApp')
	.controller('signup', ['$scope', '$uibModal', 'User', '$state', '$cookies', '$rootScope',
		function ($scope, $uibModal, User, $state, $cookies, $rootScope) {
			$scope.isLogged = $cookies.get('logged');
			$scope.Professions = [];
			$scope.isExpert = false;
			// $rootScope.$watch('$services', function () {
			// 	$scope.Professions = $rootScope.$services;
			// 	$scope.selected = $scope.Professions;
			// });
			$scope.$watch('selected_profession', function (newVal) {
				if (newVal) {
					$scope.isExpert = true;
					if ($rootScope.$professions[newVal])
						$scope.user.selected_profession = $rootScope.$professions[newVal];
					else
						$scope.user.selected_profession = false;
				}
				else
					$scope.user.selected_profession = false;
			});
			$scope.user = {
				firstname: "",
				lastname: "",
				email: "",
				mobile: '',
				password: "",
				selected_profession: false
			};
			$scope.$watchCollection('user', function (newVal, oldVal) {
				if (newVal.firstname) $scope.user.firstname = persianJs(newVal.firstname).arabicChar().toString();
				if (newVal.lastname) $scope.user.lastname = persianJs(newVal.lastname).arabicChar().toString();
			});
			$('.autocomplete__field').bind('typeahead:select', function (ev, suggestion) {
				$scope.selected_profession = suggestion;
			});
			$scope.register = function () {
				if (!$scope.userForm.$invalid) {
					if ($scope.isExpert && !$scope.user.selected_profession) return $scope.err = true;
					$scope.submited = true;
					$scope.alreadySigned = false;
					$scope.err = false;
					$scope.serverErr = false;
					return User.registerUser.save({}, JSON.stringify($scope.user), function (res) {
						User.set_user_id(res.user_id);
						$cookies.put('newLogIn', 'true');
						$state.go('validation', {
							'firstname': $scope.user.firstname,
							'user_id': res.user_id
						});
					}, function (err) {
						if (err.status == 409)
							$scope.alreadySigned = true;
						else {
							$scope.serverErr = true;
						}
					});
				}
				else {
					$scope.err = true;
				}
			};
		}
	]);
