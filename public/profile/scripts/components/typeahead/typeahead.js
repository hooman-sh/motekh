angular.module('motekhasesanApp')
	.directive('typeahead', function ($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, el, attrs) {
				el.typeahead({
					hint: false,
					highlight: false,
					minLength: 0
				}, {
					name: 'professions',
					limit: 50,
					source: $rootScope.ac_engine
				});

				$(el)
					.bind('typeahead:select', function (ev, val) {
						scope.checkOption(val)
					})

				scope
					.$watch(attrs['ngModel'], function (val) {
						scope.checkOption(val)
						if (val != undefined && val.length) {
							el[0].value = persianJs(val)
								.arabicChar()
								.toString();
						}
					});
			},
			controller: function ($scope, $rootScope, $q) {
				if ($scope.Ctrl == undefined) $scope.Ctrl = {};
				
				this.$onInit = function () {
					
					$scope.proffIsValid = true
					$scope.proffAlreadySelected = false
					$scope.Ctrl.professionsIsFull = false
					
					$scope.checkOption = function (val) {
						if ($rootScope.user) {
							// Check if adding a profession and three professions is already selected
							if (!$scope.Ctrl.creatingProject && $rootScope.userProfessions.length == 3) {
								$scope.Ctrl.err = true
								$scope.Ctrl.professionsIsFull = true
							} else {
								$scope.Ctrl.professionsIsFull = false
							}
						}
						// Check if something is selected
						if (val != undefined && val.length) {
							// Selected opiton is a profession
							if ($rootScope.$professions[val]) {
								$scope.err = true
								// $scope.serverErr = true
								$scope.proffIsValid = true
								// Check if the selected profession is any of proficient's profession
								if ($rootScope.userProfessions != undefined && $rootScope.userProfessions.indexOf($rootScope.$professions[val]) != -1) {
									$scope.proffAlreadySelected = true
								} else {
									$scope.proffAlreadySelected = false
								}
							} else {
								$scope.proffIsValid = false
								$scope.proffAlreadySelected = false
							}
						} else
							$scope.err = false
					}
				}
			}
		}
	});