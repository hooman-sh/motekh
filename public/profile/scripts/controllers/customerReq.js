'use strict';

/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
	.controller('customerReq', ['$scope', '$uibModal', 'User', '$state', '$stateParams', 'Job', '$cookies', '$rootScope', '$timeout',
		function ($scope, $uibModal, User, $state, $stateParams, Job, $cookies, $rootScope, $timeout) {
			$rootScope.startLoading()
			$scope.suggestedPrice;
			var cleave = new Cleave('#suggPrice', {
				numeral: true,
				numeralThousandsGroupStyle: 'thousand'
			});
			Job.getJobOffersDetail.get({
					job_id: $stateParams.id
				}, function (res) {
					$rootScope.stopLoading()
					if (res.location != undefined) {
						$scope.location = res.location.split('،');
						res.city = $scope.location.pop();
						if ($scope.location[$scope.location.length - 1].match(/تهران/))
							res.location = $scope.location.pop() + '، ' + res.city + '، ' + $scope.location.join('،');
					}
					$scope.customer = res;
				},
				function (err) {
					// console.log(err);
				});
			$scope.makeOffer = function () {
				if ($scope.unit == 'ساعتی') {
					$scope.unit = 'hourly'
				} else if ($scope.unit == 'روزی') {
					$scope.unit = 'daily'
				} else if ($scope.unit == 'ماهیانه') {
					$scope.unit = 'monthly'
				} else if ($scope.unit == 'پروژه ای') {
					$scope.unit = 'project'
				}
				$scope.suggestedPrice = cleave.getRawValue()
				return Job.makeNewOffer.save({}, {
					job_id: $scope.customer._id,
					costUnit: $scope.unit,
					costPerUnit: $scope.suggestedPrice,
					description: $scope.message
				}, function (response) {
					UIkit.notification("<h5 style='text-align: center;color:rgb(0,205,138)'>درخواست با موفقیت ارسال شد</h5>", {
						pos: 'top-center',
						timeout: 5000
					});
					$timeout(function () {
						for (var i = 0; i < $rootScope.customers.length; i++) {
							var item = $rootScope.customers[i];
							if ($scope.customer._id == item._id) {
								$rootScope.customers.splice(i, 1);
								$rootScope.$customers.splice(i, 1);
							}
						};
						$rootScope.requests.unshift(response);
					});
					$state.go('pages.requests');
				}, function (err) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
					console.log(err);
				})
			}
		}
	]);