'use strict';

/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
	.controller('request', ['$scope', '$uibModal', 'User', '$state', 'Job', '$stateParams', '$rootScope',
		function ($scope, $uibModal, User, $state, Job, $stateParams, $rootScope) {
			$rootScope.startLoading()
			$scope.pm = "";

			$scope.user_id = User.get_user_id();
			var messagesSize = 0;
			$scope.getMessages = function () {
				// TODO: Loading
				User.messages.query({
					mobile: $scope.res.job.creator.mobile
				}, function (messages) {
					$scope.messages = messages;
					$scope.res.description && $scope.messages.unshift({
						createdAt: $scope.res.createdAt,
						text: $scope.res.description,
						from: $scope.res.applicator
					});
					$scope.messages.sort(function (a, b) {
						return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					})
					if (messagesSize != messages.length) {
						$("#messageScroll").animate({
							scrollTop: ($scope.messages.length) * 200
						}, 1000);
						messagesSize = messages.length;
					}
				}, function (err) {
					// console.log(err);
				})
			}
			Job.getOffer.get({
				offer_id: $stateParams.id
			}, function (res) {
				$rootScope.stopLoading()
				if (res.job.location != undefined) {
					$scope.location = res.job.location.split('،');
					res.city = $scope.location.pop();
					if ($scope.location[$scope.location.length - 1].match(/تهران/))
						res.job.location = $scope.location.pop() + '، ' + res.city + '، ' + $scope.location.join('،');
				}
				$scope.res = res;
				$scope.getMessages()
				$rootScope.requestMessage = setInterval($scope.getMessages, 5000)
			}, function (err) {
				// console.log(err)
			});
			$scope.sendMessage = function () {
				if ($scope.pm != '') {
					User.messages.save({
						mobile: $scope.res.job.creator.mobile
					}, {
						message: $scope.pm
					}, function (res) {
						User.messages.query({
							mobile: $scope.res.job.creator.mobile
						}, function (messages) {
							$scope.messages = messages;
							$("#messageScroll").animate({
								scrollTop: $scope.messages.length * 200
							}, 1000);
						}, function (err) {
							// console.log(err)
						})
					}, function (err) {
						// console.log(err)
					})
					$scope.pm = "";
				}
			}
			$scope.go_to_customer = function (id) {
				$state.go('pages.customReq', {
					id: id
				});
			}
		}
	]);