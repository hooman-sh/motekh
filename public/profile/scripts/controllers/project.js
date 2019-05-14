'use strict';
/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
	.controller('project', ['$scope', '$uibModal', 'User', '$state', 'Job', '$stateParams', '$rootScope', '$timeout',
		function ($scope, $uibModal, User, $state, Job, $stateParams, $rootScope, $timeout) {
			$rootScope.startLoading();
			$timeout(function () {
				Job.getCustomerOffers.query({
					job_id: $stateParams.id
				}, function (response) {
					$scope.project = response;
					$rootScope.stopLoading();
				}, $rootScope.errFetch);
			})
			$scope.go_to_profile = function (id, id2) {
				$state.go('pages.profile', {
					job_id: id,
					offer_id: id2
				});
			}
		}
	]);
