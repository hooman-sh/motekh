/**
 * Created by hooman on 7/21/17.
 */
angular.module('motekhasesanApp')
	.controller('profile', ['$scope', '$uibModal', 'User', '$state', 'Job', '$stateParams', '$cookies', '$rootScope', '$timeout',
		function ($scope, $uibModal, User, $state, Job, $stateParams, $cookies, $rootScope, $timeout) {
			$scope.profilePics = {
				items: 3,
				loop: false,
				rtl: true,
				nav: false,
				dots: false
			};
			$rootScope.startLoading();
			$scope.pm = "";
			$scope.user_id = User.get_user_id();
			$scope.openTrustModal = function () {
				$uibModal.open({
					templateUrl: 'trust.html',
					scope: $scope,
					controller: function ($uibModalInstance) {
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
					}
				});
			};
			var messagesSize = 0;
			$scope.getMessages = function (mo) {
				User.messages.query({
					mobile: $scope.offer.applicator.mobile
				}, function (messages) {
					$scope.messages = messages;
					$scope.offer.description && $scope.messages.unshift({
						createdAt: $scope.offer.createdAt,
						text: $scope.offer.description,
						from: $scope.offer.applicator._id
					});
					$scope.messages.sort(function (a, b) {
						return new Date(a.createdAt)
							.getTime() - new Date(b.createdAt)
							.getTime();
					})
					if (messagesSize != messages.length) {
						$("#messageScroll")
							.animate({
								scrollTop: ($scope.messages.length) * 200
							}, 1000);
						messagesSize = messages.length;
					}
				}, function (err) {
					// console.log(err);
				})
			}
			Job.getCustomerOffer.get({
				job_id: $stateParams.job_id,
				offer_id: $stateParams.offer_id
			}, function (response) {
				$rootScope.stopLoading();
				$scope.offer = response;
				$scope.getMessages()
				$rootScope.profileMessage = setInterval($scope.getMessages, 5000);
			}, function (err) {
				// console.log(err);
			});
			$scope.sendMessage = function () {
				User.messages.save({
					mobile: $scope.offer.applicator.mobile
				}, {
					message: $scope.pm
				}, function (res) {
					$scope.getMessages()
				}, function (err) {
					// console.log(err);
				})
				$scope.pm = "";
			};
			$scope.accept = function () {
				if ($scope.offer.status == 'accepted' || $scope.offer.status == 'completed' || $scope.offer.status == 'rated' || $scope.offer.status == 'approved') return;
				$rootScope.startLoading();
				return Job.acceptReject.save({
					job_id: $stateParams.job_id,
					offer_id: $stateParams.offer_id
				}, {
					status: 'accepted'
				}, function (response) {
					$scope.closeConfirm();
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>درخواست با موفقیت ارسال شد، منتظر تایید متخصص باشید</h5>", {
						pos: 'top-center',
						timeout: 4000
					});
					Job.getProject.get({
						job_id: $stateParams.job_id
					}, function (res) {
						// var theProject = angular.copy(res);
						// var index;
						// for (var i = 0; i < $rootScope.projects.length; i++) {
						// 	var item = $rootScope.projects[i];
						// 	if (item._id == theProject._id) {
						// 		index = i;
						// 	}
						// }
						// for (var i = 0; i < theProject.offers.length; i++) {
						// 	var offer = theProject.offers[i];
						// 	if ((offer.status == 'rated') || (offer.status == 'accepted') || (offer.status == 'approved')) {
						// 		theProject.offers = offer;
						// 	}
						// }
						// $rootScope.$apply(function () {
						// 	$rootScope.projects[i] = theProject;
						// });
						Job.getProjects.query({}, function (res) {
							$rootScope.projects = [];
							$rootScope.$projects = res;
						}, $rootScope.errFetch);
						$state.go('pages.projects');
					}, function (err) {
						console.log(err);
					});
				}, function (err) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 3000
					});
				})
			}
			$scope.confirmHire = function () {
				$scope.confirmHireModal = $uibModal.open({
					templateUrl: 'confirm-hire.html',
					scope: $scope,
					windowClass: 'modal--center',
					size: '-auto',
					controller: function () {}
				})
			}
			$scope.closeConfirm = function () {
				$scope.confirmHireModal.close(true);
			}
		}
	]);