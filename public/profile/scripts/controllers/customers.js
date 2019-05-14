'use strict';
/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
	.controller('customers', ['$scope', '$uibModal', 'User', '$state', 'Job', '$rootScope', '$timeout',
		function ($scope, $uibModal, User, $state, Job, $rootScope, $timeout) {
			$rootScope.startLoading();
			$rootScope.$watch('$customers', function (customers) {
				if ((angular.isUndefined(customers) || $rootScope.isEmpty(customers))) return;
				if ($rootScope.customers && !$rootScope.isEmpty($rootScope.customers)) return $rootScope.stopLoading();
				$scope.customers = [];
				for (var l = 0; l < customers.length; l++) {
					$scope.customers = $scope.customers.concat(customers[l].availableJobs);
				}
				for (var i = 0; i < $scope.customers.length; i++) {
					$scope.customers[i].attrs = '';
					for (var j = 0; j < $scope.customers[i].attributes.length; j++) {
						$scope.customers[i].attrs += $scope.customers[i].attributes[j].title + ': ';
						if ($scope.customers[i].attributes[j].text != undefined)
							$scope.customers[i].attrs += $scope.customers[i].attributes[j].text;
						if ($scope.customers[i].attributes[j].options.length != 0 && $scope.customers[i].attributes[j].text != undefined)
							$scope.customers[i].attrs += "،";
						for (var k = 0; k < $scope.customers[i].attributes[j].options.length; k++) {
							$scope.customers[i].attrs += $scope.customers[i].attributes[j].options[k];
							if (k != $scope.customers[i].attributes[j].options.length - 1)
								$scope.customers[i].attrs += "، ";
						}
						if (j != ($scope.customers[i].attributes.length - 1)) $scope.customers[i].attrs += " / ";
					}
					$scope.customers[i].attrs += ' / زمان: ' + $scope.customers[i].time;
					if (!(!$scope.customers[i].description)) $scope.customers[i].attrs += ' / توضیحات: ' + $scope.customers[i].description;
					if ($scope.customers[i].location != undefined) {
						$scope.location = $scope.customers[i].location.split('،');
						$scope.customers[i].city = $scope.location.pop();
						if ($scope.location[$scope.location.length - 1].match(/تهران/))
							$scope.customers[i].city = $scope.location.pop() + '، ' + $scope.customers[i].city;
					}
				}
				$scope.customers.sort(function (a, b) {
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				});
				$rootScope.customers = $scope.customers;
				$rootScope.stopLoading();
			});
		}
	])
