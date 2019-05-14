'use strict';
/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
	.controller('dashboard', ['$scope', 'User', '$state', 'Job', '$cookies', '$uibModal', '$rootScope', '$timeout', 'joyrideService', '$q', '$http',
		function ($scope, User, $state, Job, $cookies, $uibModal, $rootScope, $timeout, joyrideService, $q, $http) {
			var vm = this;
			$rootScope.startLoading();
			$rootScope.$watch('user', function (user) {
				if ((!angular.isUndefined(user) && !$rootScope.isEmpty(user)) && user) {
					$rootScope.stopLoading()
				}
			})
			var today = new Date();
			var expiresValue = new Date(today);
			expiresValue.setSeconds(today.getSeconds() + 25200);
			$scope.Ctrl = {
				creatingProject: false
			}
			$scope.addProffSetErr = false;
			$scope.changePassErr = false;
			$scope.changeAddrErr = false;
			$scope.changesMailErr = false;
			$scope.removeProffErr = false;
			$scope.addProffErr = false;
			$scope.repPass;
			$scope.addProffErr2 = false;
			$scope.proff = {};
			$scope.phone = "";
			$scope.address = "";
			$scope.removeProffAlert = false;
			$scope.back = {
				'background-color': 'background: linear-gradient(to left bottom, #15baff, #0070ba);'
			};
			// Events
			$("#addressModal")
				.on('hide', function () {
					$scope.changeAddrErr = false;
				})
			$("#reset")
				.on('hide', function () {
					$scope.changePassErr = false;
				})
			$("#emailModal")
				.on('hide', function () {
					$scope.changeMailErr = false;
				})
			$("#myModal")
				.on('hide', function () {
					$scope.uploadKit.$destroy();
				});
			$scope.go_to_profile = function (id) {
				$state.go('pages.profile', {
					id: id
				});
			};
			$scope.openAnModal = function (name) {
				UIkit.modal('#' + name)
					.show();
			};
			$scope.openTrustModal = function () {
				$uibModal.open({
					templateUrl: 'trust.html',
					scope: $scope,
					size: '-auto',
					windowClass: 'modal--center',
					controller: function ($uibModalInstance) {
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
					}
				});
			};
			$scope.openProffModal = function () {
				// $scope.addProffErr = false;
				$scope.proffModal = $uibModal.open({
					component: 'proffModal',
					resolve: {
						creatingProject: false,
						addProffErr: function () {
							return $scope.addProffErr
						},
						addProffession: function () {
							return $scope.addProffession
						}
					},
					windowClass: 'modal--project modal--center',
					size: "-auto"
				});
			}
			$scope.visited = function () {
				User.visit.get({}, function (res) {
					UIkit.modal("#welcomeModal")
						.hide();
					setTimeout(function () {
						UIkit.modal('#welcomeModal')
							.$destroy(true);
						if ($scope.user.gender == 'na') {
							UIkit.modal("#genderModal")
								.show();
						} else if ($cookies.get('answers') != undefined) {
							UIkit.modal('#createJobFromLanding')
								.show();
						}
					}, 1000)
				});
			}
			$scope.resetPassModal = function () {
				var modalInstance2 = $uibModal.open({
					animation: true,
					templateUrl: 'reset_password.html',
					controller: 'reset_password_ctrl'
				});
				modalInstance2.result.then(function (selectedItem) {}, function () {});
			};
			$scope.setProffId = function (id) {
				$scope.proffId = id;
			}
			$scope.setPIDIntro = function () {
				var elem = $("#c-intro")
					.find($('.uk-active'));
				var idOfText = elem.attr('id');
				idOfText = idOfText.slice(0, idOfText.length - 4);
				$scope.textProffId = idOfText;
				$scope.professionIndex = $scope.user.professions.map(function (x) {
						return x._id
					})
					.indexOf($scope.textProffId);
			}
			$scope.openModal = function (name) {
				if (name == 'profilePic1') {
					$scope.isProfile = true;
					$scope.fileName = 'profilePicture';
				} else {
					$scope.isProfile = false;
					$scope.fileName = name;
				}
				$uibModal.open({
					templateUrl: '/profile/views/uploadModal.html',
					scope: $scope,
					controller: function ($uibModalInstance, $scope) {
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
						if (name.indexOf('photo') != -1 || name.indexOf('video') != -1) {
							var videoId = $('#component-tab-right2')
								.find('li.uk-active')
								.attr('id');
							videoId = videoId.slice(0, videoId.length - 5);
							$scope.uploadURL = window.apiLocation + 'dashboard/professions/' + videoId;
						} else {
							$scope.uploadURL = window.apiLocation + 'dashboard/profile';
						}
						$timeout(function () {
							$scope.bar = document.querySelector('#progressbar');
							$scope.uploadKit = UIkit.upload('#upload-doc', {
								url: $scope.uploadURL,
								type: 'PUT',
								name: $scope.fileName,
								multiple: false,
								error: function (e) {
									console.log(arguments[0], e);
									if (arguments[0] === "Payload Too Large") {
										$uibModalInstance.close(true);
										$scope.bar.setAttribute('hidden', 'hidden');
										UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>حجم فایل حداکثر ۶ مگابایت باید باشد</h5>", {
											pos: 'top-center',
											timeout: 2000
										});
									} else {
										$uibModalInstance.close(true);
										$scope.bar.setAttribute('hidden', 'hidden');
										UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
											pos: 'top-center',
											timeout: 2000
										});
									}
								},
								complete: function () {
									if (arguments[0].status == 200) {
										$uibModalInstance.close(true);
										$scope.bar.setAttribute('hidden', 'hidden');
										UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>آپلود با موفقیت انجام شد</h5>", {
											pos: 'top-center',
											timeout: 1000
										});
										$rootScope.startLoading();
										User.dashboard.get(function (res) {
											$rootScope.user = false;
											$rootScope.$user = res;
											$rootScope.loadUser();
											$rootScope.stopLoading();
										}, function (err) {
											$rootScope.errFetch();
										});
									} else if (arguments[0].status == 413) {
										$uibModalInstance.close(true);
										$scope.bar.setAttribute('hidden', 'hidden');
										UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>حجم فایل حداکثر ۶ مگابایت باید باشد</h5>", {
											pos: 'top-center',
											timeout: 2000
										});
									}
								},
								loadStart: function (e) {
									$scope.bar.removeAttribute('hidden');
									$scope.bar.max = e.total;
									$scope.bar.value = e.loaded;
								},
								progress: function (e) {
									$scope.bar.max = e.total;
									$scope.bar.value = e.loaded;
								},
								loadEnd: function (e) {
									$scope.bar.max = e.total;
									$scope.bar.value = e.loaded;
								}
							});
						});
					},
					windowClass: 'modal--over',
					size: '-sm'
				});
			};
			$scope.removeIntro = function () {
				$scope.setPIDIntro();
				User.addIntro.put({
					proffId: $scope.textProffId
				}, {
					introDescription: " "
				}, function (response) {
					$scope.user.professions[$scope.professionIndex].intro.description = response.professions[$scope.professionIndex].intro.description;
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>تغییرات با موفقیت اعمال شد</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
				}, function (err) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
					// console.log(err);
				})
			}
			$scope.addIntro = function () {
				$scope.setPIDIntro();
				User.addIntro.put({
					proffId: $scope.textProffId
				}, {
					introDescription: $scope.user.professions[$scope.professionIndex].intro.description
				}, function (response) {
					$scope.user.professions[$scope.professionIndex].intro.description = response.professions[$scope.professionIndex].intro.description;
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>تغییرات با موفقیت اعمال شد</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
				}, function (err) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
					// console.log(err);
				})
			}
			$scope.addProffession = function (resolve, reject) {
				return Job.addProfession.save({}, {
					profession_id: $rootScope.$professions[$('#autocomplete__field')
						.typeahead('val')]
				}, function (res) {
					$scope.user.professions = res.professions;
					$rootScope.userProfessions = res.professions;
					$scope.proffModal.close();
					$scope.proff = {};
					$scope.addProffErr = false;
					if ($scope.user.professions.length > 0 && $cookies.get('isProff') == 'false') {
						$cookies.put('isProff', 'true', {
							'expires': expiresValue
						});
						setTimeout(function () {
							location.reload();
						}, 1000);
					}
					(typeof resolve == 'function') && resolve()
				}, function (err) {
					if (err.status == 400 || err.status == 405) {
						$scope.addProffErr = true
					};
					(typeof reject == 'function') && reject({
						serverErr: true
					})
				})
				// }
			};
			$scope.addressChange = function () {
				$scope.changeAddrErr = false;
				return User.updateProfile.change({}, {
					address: $scope.address
				}, function (res) {
					$scope.user.address = res.address;
					UIkit.modal('#addressModal')
						.hide();
				}, function (err) {
					$scope.changeAddrErr = true;
				})
			};
			$scope.emailChange = function () {
				$scope.changeMailErr = false;
				return User.updateProfile.change({}, {
					email: $scope.email
				}, function (res) {
					$scope.user.email = res.email;
					UIkit.modal('#emailModal')
						.hide();
				}, function (err) {
					$scope.changeMailErr = true;
				})
			};
			$scope.resetpass = function () {
				$scope.changePassErr = false;
				return User.resetPass.save({}, {
					oldPassword: $scope.oldPass,
					newPassword: $scope.newPass
				}, function (res) {
					UIkit.modal('#resetPass')
						.hide();
					setTimeout(function () {
						UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>رمز عبور شما با موفقیت تغییر یافت</h5>", {
							pos: 'top-center',
							timeout: 3000
						}, 500);
					})
				}, function (err) {
					if (err.status == 400)
						$scope.changePassErr = true;
				})
			};
			$scope.removeProffCheck = function (id) {
				$scope.removeProffModal = $uibModal.open({
					templateUrl: 'removeProff.html',
					windowClass: 'modal--center',
					size: '-auto',
					scope: $scope,
					controller: function ($uibModalInstance) {
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
					}
				})
				$scope.selectedProff = id;
			};
			$scope.goOnRemoveIt = function () {
				return User.removeProff.delete({
					porffId: $scope.selectedProff
				}, function (response) {
					$scope.user.professions = response.professions;
					$rootScope.userProfessions = response.professions;
					if ($scope.user.professions.length == 0) {
						$cookies.put('isProff', 'false', {
							'expires': expiresValue
						});
						location.reload();
					}
					$scope.removeProffModal.close(true)
				}, function (err) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
				});
			}
			$scope.changeVisiblePhone = function () {
				User.updateProfile.change({
					visiblePhone: !$scope.user.visiblePhone
				}, function (response) {
					$scope.user.visiblePhone = response.visiblePhone;
				}, function (err) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
				})
			}
			$scope.changeVisibleAddress = function () {
				User.updateProfile.change({
					visibleAddress: !$scope.user.visibleAddress
				}, function (response) {
					$scope.user.visibleAddress = response.visibleAddress;
				}, function (err) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
				})
			}
			$scope.createLandingJob = function () {
				var prevJob = $cookies.get('answers');
				return Job.getProjects.save({}, prevJob, function (data) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>پروژه با موفقیت ثبت شد</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
					$cookies.remove('answers')
					UIkit.modal('#createJobFromLanding')
						.hide();
					setTimeout(function () {
						UIkit.modal('#createJobFromLanding')
							.$destroy(true);
						$state.go('pages.projects');
					}, 700)
				}, function (err) {
					$cookies.remove('answers')
					$scope.addProffErr2 = true;
					setTimeout(function () {
						UIkit.modal('#createJobFromLanding')
							.hide();
						setTimeout(function () {
							UIkit.modal('#createJobFromLanding')
								.$destroy(true);
						}, 700)
					}, 2000)
				});
			};
			$scope.declineLandingJob = function () {
				$cookies.remove('answers')
				UIkit.modal('#createJobFromLanding')
					.hide();
				setTimeout(function () {
					UIkit.modal('#createJobFromLanding')
						.$destroy(true);
				}, 1500)
			};
			vm.updateNotifyConfig = function () {
				if (!vm.notifyConfig.$pristine) {
					vm.changedNotifyConfig = [];
					vm.notifyConfig.$$controls.forEach2(function (item, i) {
						var profIsModified = !angular.equals($rootScope.user.professions[item.$name].notificationConfig, $rootScope.$user.professions[item.$name].notificationConfig);
						if (!item.$pristine && profIsModified) {
							vm.changedNotifyConfig.push($http.put(config.api + 'dashboard/professions/' + item.id.$modelValue, {
								sendSMS: item.sms.$modelValue,
								sendEmail: item.email.$modelValue
							}));
							$rootScope.$user.professions[item.$name].notificationConfig = {
								sendSMS: item.sms.$modelValue,
								sendEmail: item.email.$modelValue,
							};
						}
					})
					vm.notifyConfigLoading = true;
					$q.all(vm.changedNotifyConfig)
						.then(function (values) {
							vm.notifyConfigLoading = false;
						})
				}
			}
			return vm;
		}
	]);