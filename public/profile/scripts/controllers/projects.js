'use strict';
/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
	.controller('projects', ['$scope', '$uibModal', 'User', '$state', 'Job', '$cookies', '$rootScope', '$timeout', '$http', '$window',
		function ($scope, $uibModal, User, $state, Job, $cookies, $rootScope, $timeout, $http, $window) {
			$rootScope.startLoading();
			$rootScope.$watch('$projects', function (projects) {
				if ((angular.isUndefined(projects) || $rootScope.isEmpty(projects))) return;
				if ($rootScope.projects && !$rootScope.isEmpty($rootScope.projects)) return $rootScope.stopLoading();
				$scope.projects = angular.copy(projects);
				$scope.projects.forEach2(function (el, idx) {
					el.offers.forEach2(function (offer) {
						if ((offer.status == 'rated') || (offer.status == 'accepted') || (offer.status == 'approved')) {
							if ((offer.status == 'rated')) {
								offer.rate = offer.comment.rate;
								offer.comment = offer.comment.text;
							}
							el.offers = offer;
						}
					});
				});
				$rootScope.projects = angular.copy($scope.projects);
				if ($rootScope.toState == 'pages.projects.single') $rootScope.startLoading();
				else $rootScope.stopLoading();
			});
			$rootScope.appIsLoading = false;
			$scope.proff = {};
			User.dashboard.get({}, function (res) {
				if (res.mobileVerified == false)
					$state.go('validation', {
						'firstname': res.firstname,
						'user_id': res._id,
						'fromLogin': true
					});
				if ($cookies.get('answers') != undefined && res.gender != 'na') {
					UIkit.modal('#createJobFromLanding')
						.show();
				}
				//  else if (res.gender == 'na') {
				// 	UIkit.modal('#genderModal')
				// 		.show();
				// }
			});

			$scope.setGender = function (Gender) {
				User.updateProfile.change({
					gender: Gender
				}, function (res) {
					UIkit.modal("#genderModal")
						.hide();
					setTimeout(function () {
						UIkit.modal('#genderModal')
							.$destroy(true);
						if ($cookies.get('answers') != undefined) {
							UIkit.modal('#createJobFromLanding')
								.show();
						}
					}, 1000)
				})
			}
			$scope.createLandingJob = function () {
				var prevJob = $cookies.get('answers');
				return Job.getProjects.save({}, prevJob, function (data) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>پروژه با موفقیت ثبت شد</h5>", {
						pos: 'top-center',
						timeout: 2000
					});
					$rootScope.projects.push(data);
					$rootScope.$projects.push(data);
					$rootScope.updateViewport();
					$state.go('pages.projects');
					$cookies.remove('answers')
					UIkit.modal('#createJobFromLanding')
						.hide();
					$timeout(function () {
						UIkit.modal('#createJobFromLanding')
							.$destroy(true);
					}, 700);
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
			}
			$scope.declineLandingJob = function () {
				$cookies.remove('answers')
				UIkit.modal('#createJobFromLanding')
					.hide();
				setTimeout(function () {
					UIkit.modal('#createJobFromLanding')
						.$destroy(true);
				}, 1500)
			}
			$scope.openAnModal = function (name) {
				UIkit.modal("#" + name)
					.show();
			}
			$scope.datePickerCleave = {
				date: true,
				datePattern: ['Y', 'm', 'd']
			};
			$scope.deleteProject = function (id) {
				$uibModal.open({
						template: '<div class="modal-header uk-flex uk-flex-middle uk-flex-between"><span class="u-s--4 u-b--7">از حذف پروژه اطمینان دارید؟</span> <span class="uk-float-left uk-button-group"><button type="button" class="uk-button uk-button-default" ng-click="Ctrl.cancel()">خیر</button><button type="button" class="uk-button uk-button-danger" ng-click="Ctrl.ok()">بله</button></span></div>',
						size: '-auto',
						windowClass: 'modal--center',
						controllerAs: 'Ctrl',
						controller: function ($uibModalInstance) {
							$rootScope.updateViewport();
							this.ok = function () {
								$uibModalInstance.close({
									$value: true
								})
							};
							this.cancel = function () {
								$uibModalInstance.dismiss({
									$value: 'cancel'
								});
							}
						}
					})
					.result.then(function (e) {
						$rootScope.startLoading()
						Job.getProject.delete({
							'job_id': id
						}, function () {
							$rootScope.stopLoading();
							$rootScope.projects.forEach2(function (item, idx) {
								if (item._id == id) {
									$rootScope.projects.splice(idx, 1);
									$rootScope.$projects.splice(idx, 1);
								}
							});
							$rootScope.updateViewport();
						});
					})
			};
			$scope.inp = "";
			$scope.started = false;
			$scope.head = "";
			$scope.curr = -1;
			$scope.answers = [];
			$scope.completed = false;
			$scope.jobs = [];
			$scope.textOpt = '';
			$scope.city = '';
			$scope.district = '';
			$scope.addProffErr2 = false;
			User.getProfs.query(function (response) {
				$scope.jobs = response;
			}, function (err) {
				UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>دریافت اطلاعات انجام نشد، مجددا تلاش کنید</h5>", {
					pos: 'top-center',
					timeout: 3000
				});
			});
			$scope.rating = function (comment, rate, proff) {
				if (comment != undefined && comment != "" && rate != undefined) {
					return Job.acceptReject.save({
						job_id: proff.job,
						offer_id: proff._id
					}, {
						status: 'rated',
						rate: rate,
						commentText: comment
					}, function (response) {
						$scope.rated = true;
					}, function (err) {
						UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(238,31,88)'>مشکلی پیش آمده مجددا تلاش کنید</h5>", {
							pos: 'top-center',
							timeout: 4000
						});
						// console.log(err);
					})
				}
			}
			$scope.resetArgs = function () {
				$('#Time input[type="text"]')
					.each(function () {
						$(this)
							.val("");
					});
				$('#Time input[type="radio"]')
					.each(function () {
						$(this)
							.prop('checked', false);
					});
				$('#Phone input[type="text"]')
					.each(function () {
						$(this)
							.val("");
					});
				$('#Phone input[type="radio"]')
					.each(function () {
						$(this)
							.prop('checked', false);
					});
				$scope.inp = "";
				$scope.started = false;
				$scope.head = "";
				$scope.curr = -1;
				$scope.answers = [];
				$scope.completed = false;
				$scope.firstQuestion = true;
				$scope.lastQuestion = false;
			}
			$scope.get_questions = function (resolve, reject) {
				var id = $rootScope.$professions[$('#autocomplete__field')
					.typeahead('val')];
				$scope.getQuestionsErr = false;
				$scope.back = {
					'background': 'linear-gradient(to left bottom, #15baff, #0070ba);'
				};
				$scope.started = false;
				return Job.getQuestions.get({
					id: id
				}, function (success) {
					$scope.questionProf = success;
					$scope.getQuestionsErr = false;
					$scope.questions = success.questions.slice(0, success.questions.length);
					$scope.questions2 = $scope.questions.slice(0, $scope.questions.length);
					$scope.questions.push({
						_id: 'time',
						skippable: false,
						title: 'بهترین زمانی که به این خدمت نیازمندید چه موقع میباشد؟'
					});
					$scope.questions.push({
						_id: 'description',
						skippable: true,
						title: 'توضیحات بیشتری که تمایل دارید متخصص مربوطه مطلع شود را ذکر نمایید.'
					});
					$scope.questions.push({
						_id: 'location',
						skippable: false,
						title: 'شهر و منطقه خود را انتخاب کنید'
					});
					if ($scope.questionProf.gender == 'ask') {
						$scope.questions.push({
							_id: 'gender',
							skippable: false,
							title: 'جنسیت متخصص مربوطه مورد نظر خود را مشخص کنید'
						});
					}
					$scope.questions.push({
						_id: 'phone',
						skippable: false,
						title: 'آیا تمایل دارید شماره تلفن خود را برای متخصصین نمایش دهید تا با شما تماس بگیرند؟'
					});
					var num = 4
					if ($scope.questionProf.gender == 'ask')
						num++;
					$scope.showTextOp = new Array($scope.questions.length + num);
					$scope.textOpt = new Array($scope.questions.length + num);
					$scope.closeModal();
					$scope.showTextOp.fill(false);
					$scope.textOpt.fill("");
					$scope.createJob = {
						profession_id: id,
						answers: {}
					};
					$scope.questions.forEach2(function (question, idx) {
						$scope.createJob.answers[question._id] = {
							selected_options: [],
							text_option: $scope.showTextOp[idx]
						};
					});
					if (typeof resolve == 'function') resolve();
				}, function (err) {
					$scope.getQuestionsErr = true;
					if (err) {
						// console.log(err);
					}
					if (typeof reject == 'function') reject();
				})
			};
			$scope.skippQuestion = function () {
				if ($scope.lastQuestion) return;
				$scope.createJob.answers[$scope.questions[$scope.curr]._id].selected_options.splice(0, $scope.createJob.answers[$scope.questions[$scope.curr]._id].selected_options.length)
				$scope.createJob.answers[$scope.questions[$scope.curr]._id].text_option = "";
				$("#createJob")
					.carousel('next');
				$scope.curr += 1;
				$scope.head = $scope.questions[$scope.curr].title;
				$scope.firstQuestion = false;
			}
			$scope.checkAnswers = function (option, id, qtype, idx) {
				if (option == 'none') {
					if (qtype == 'stext') {
						($scope.createJob.answers[id].selected_options)
						.splice(0, $scope.createJob.answers[id].selected_options.length);
						$scope.showTextOp[idx] = true;
					} else if (qtype == 'mtext') {
						if ($scope.showTextOp[idx] == true) {
							$scope.showTextOp[idx] = false;
						} else
							$scope.showTextOp[idx] = true;
					}
				}
				if (option != 'none') {
					if (qtype == 'stext') {
						$scope.showTextOp[idx] = false;
						$scope.textOpt[idx] = "";
					}
					if (qtype == 'mtext' || qtype == 'multi') {
						if (($scope.createJob.answers[id].selected_options)
							.indexOf(option) == -1) {
							($scope.createJob.answers[id].selected_options)
							.push(option);
						} else {
							($scope.createJob.answers[id].selected_options)
							.splice(($scope.createJob.answers[id].selected_options)
								.indexOf(option), 1);
						}
					} else if (qtype == 'stext' || qtype == 'single') {
						($scope.createJob.answers[id].selected_options)
						.splice(0, $scope.createJob.answers[id].selected_options.length);
						($scope.createJob.answers[id].selected_options)
						.push(option);
					}
				}
			}
			// @sendAnswers
			$scope.sendAnswers = function () {
				$scope.createJob.answers[$scope.questions[$scope.curr]._id].text_option = $scope.textOpt[$scope.curr];
				return $scope.sendAnswersPromise = Job.getProjects.save({}, $scope.createJob, function (data) {
					UIkit.notification("<h5 class='persian ' dir='rtl' style='text-align: center;color:rgb(0,205,138)'>پروژه با موفقیت ثبت شد</h5>", {
						pos: 'top-center',
						timeout: 2500
					});
					$timeout(function () {
						$rootScope.projects.push(data);
						$rootScope.$projects.push(data);
						$scope.closeProjModal();
						$window.location.reload();
						$rootScope.updateViewport();
					}, 1000);
				}, function (err) {
					if (err.status == 400) {
						$scope.projectBad = err.data.message;
					} else {
						$scope.projectBad = 'قادر به ساخت این پروژه نیستید';
					}
				})
			}
			$scope.closeProjModal = function () {
				$scope.projectModal.close(true);
			};
			$scope.nextHead = function () {
				if (!$scope.lastQuestion) {
					if (($scope.createJob.answers[$scope.questions[$scope.curr]._id].selected_options.length != 0) || ($scope.textOpt[$scope.curr] != '')) {
						if ($scope.questions[$scope.curr]._id == 'location') {
							$scope.textOpt[$scope.curr] += '، ' + $rootScope.city;
							if ($rootScope.city == 'تهران')
								$scope.textOpt[$scope.curr] += '، ' + $rootScope.district;
						}
						if ($scope.questions[$scope.curr]._id == 'description' || $scope.questions[$scope.curr]._id == 'location') {
							$scope.createJob.answers[$scope.questions[$scope.curr]._id].text_option = $scope.textOpt[$scope.curr];
						} else if ($scope.showTextOp[$scope.curr] == false) {
							$scope.createJob.answers[$scope.questions[$scope.curr]._id].text_option = "";
						} else {
							$scope.createJob.answers[$scope.questions[$scope.curr]._id].text_option = $scope.textOpt[$scope.curr];
						}
						$("#createJob")
							.carousel('next');
						$scope.curr += 1;
						$scope.head = $scope.questions[$scope.curr].title;
						$scope.firstQuestion = false;
						if ($scope.curr == $scope.questions.length - 1) {
							$scope.lastQuestion = true;
						} else {
							$scope.lastQuestion = false;
						}
					}
				}
			};
			$scope.prevHead = function () {
				$("#createJob")
					.carousel('prev');
				if ($scope.questions[$scope.curr - 1]._id == 'location') {
					$scope.textOpt[$scope.curr - 1] = ""
				}
				$scope.curr -= 1;
				$scope.head = $scope.questions[$scope.curr].title;
				$scope.lastQuestion = false;
				if ($scope.curr == 0) {
					$scope.firstQuestion = true;
				} else {
					$scope.firstQuestion = false;
				}
			};
			$scope.start = function () {
				$scope.started = true;
				$scope.lastQuestion = false;
				$scope.firstQuestion = true;
				$scope.curr += 1;
				$scope.head = $scope.questions[$scope.curr].title;
				$scope.back = {
					'background-color': '#white'
				};
				$("#createJob")
					.carousel('next');
			};
			$scope.go_to_project = function (id) {
				$state.go('pages.projects.single', {
					id: id
				});
			};
			$scope.go_to_profile = function (id, offer_id) {
				$state.go('pages.profile', {
					job_id: id,
					offer_id: offer_id
				});
			};
			$scope.openText = function (id) {
				$scope.showTextOp[id] = true;
			};
			$scope.openModal = function () {
				$scope.proffModal = $uibModal.open({
					component: 'proffModal',
					resolve: {
						creatingProject: true,
						getQuestionsErr: function () {
							return $scope.getQuestionsErr
						},
						questionPromise: function () {
							return $scope.questionPromise
						},
						get_questions: function () {
							return $scope.get_questions
						}
					},
					windowClass: 'modal--project modal--center',
					size: "-auto",
				})
				$scope.proffModal.result.then(function () {
					$scope.projectModal = $uibModal.open({
						animation: false,
						templateUrl: 'merge/views/projectModal.html',
						scope: $scope,
						windowClass: 'modal--project',
						controller: function ($uibModalInstance) {
							$rootScope.isModalOpen = true;
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						}
					});
					$scope.projectModal.closed.then(function () {
						$rootScope.isModalOpen = false;
						$rootScope.updateViewport();
						$scope.curr = -1;
						$(".item")
							.removeClass("active");
						$(".item:nth-child(1)")
							.addClass("active");
					});
					$scope.projectModal.rendered.then(function () {
						document.querySelector('.modal-body').focus();
						$rootScope.updateViewport();
					})
				});
				$scope.proffModal.closed.then(function () {
					$scope.getQuestionsErr = false;
					$rootScope.updateViewport();
				});
				$scope.proffModal.rendered.then(function () {
					$scope.getQuestionsErr = false;
					$rootScope.updateViewport();
				});
			};
			$scope.closeModal = function () {
				$scope.proffModal.close(true);
			};
			$scope.go_to_profile = function (id, id2) {
				$state.go('pages.profile', {
					job_id: id,
					offer_id: id2
				});
			}
			$(document).bind('slid.bs.carousel', '#createJob', function () {
				$timeout(function () {
					$scope.sliding = false;
				});
				document.querySelector('.item.active input').focus();
			});
			$(document).bind('slide.bs.carousel', '#createJob', function () {
				$timeout(function () {
					$scope.sliding = true;
				});
			});
		}
	]);