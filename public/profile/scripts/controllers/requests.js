'use strict';
/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
	.controller('requests', ['$scope', '$uibModal', 'User', '$state', 'Job', '$rootScope',
		function ($scope, $uibModal, User, $state, Job, $rootScope) {
			$rootScope.startLoading()
			$scope.accept = function (id) {
				return Job.getOffer.save({
					offer_id: id
				}, {
					status: 'accept'
				}, function (res) {
					for (var i = 0; i < $rootScope.requests.length; i++) {
						if (id == $rootScope.requests[i]._id) $rootScope.requests[i].status = res.status;
					};
					$scope.acceptModal.close({
						$value: 'done'
					});
				}, function (err) {
					$scope.acceptModal.close({
						$value: 'err'
					});
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 4000
					});
					// console.log(err);
				})
			}
			$scope.decline = function (id) {
				return Job.getOffer.save({
					offer_id: id
				}, {
					status: 'reject'
				}, function (res) {
					for (var i = 0; i < $rootScope.requests.length; i++) {
						if (id == $rootScope.requests[i]._id) $rootScope.requests[i].status = res.status;
					};
					$scope.declineModal.close({
						$value: 'done'
					});
				}, function (err) {
					$scope.declineModal.close({
						$value: 'err'
					});
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 4000
					});
					// console.log(err);
				})
			}
			$rootScope.$watch('$requests', function (requests) {
				if ((angular.isUndefined(requests) || $rootScope.isEmpty(requests))) return;
				if ($rootScope.requests && !$rootScope.isEmpty($rootScope.requests)) return $rootScope.stopLoading();
				var num = 0;
				$scope.requests = [];
				requests.forEach2(function (res, index) {
					$scope.requests = $scope.requests.concat(res.offers);
					if (res.offers.length > 0) {
						for (var i = num; num < res.offers.length + i; num++) {
							$scope.requests[num].profession = res.profession.title;
						}
					}
				});
				$scope.requests.forEach2(function (item) {
					if (item && item.job != null && item.job.location != undefined) {
						$scope.location = item.job.location.split('،');
						item.city = $scope.location.pop();
						if ($scope.location.length && $scope.location[$scope.location.length - 1].match(/تهران/))
							item.city = $scope.location.pop() + '، ' + item.city;
						}
				});
				$scope.requests.sort(function (a, b) {
					return new Date(b.createdAt)
						.getTime() - new Date(a.createdAt)
						.getTime();
				});
				$rootScope.requests = angular.copy($scope.requests);
				$rootScope.stopLoading()
			});
			$scope.openAcceptModal = function (id) {
				$scope.acceptModal = $uibModal.open({
					templateUrl: 'acceptJob.html',
					scope: $scope,
					windowClass: 'modal--center',
					size: '-auto',
					controllerAs: 'Ctrl',
					controller: function ($uibModalInstance) {
						this.id = id;
						this.cancel = function () {
							$uibModalInstance.dismiss({
								$value: 'cancel'
							});
						}
					}
				})
			};
			$scope.openDeclineModal = function (id) {
				$scope.declineModal = $uibModal.open({
					templateUrl: 'declineJob.html',
					scope: $scope,
					windowClass: 'modal--center',
					size: '-auto',
					resolve: {
						id: function () {
							return id;
						}
					},
					controllerAs: 'Ctrl',
					controller: function ($uibModalInstance) {
						this.id = id;
						this.cancel = function () {
							$uibModalInstance.dismiss({
								$value: 'cancel'
							});
						}
					}
				})
			}
		}
	]);