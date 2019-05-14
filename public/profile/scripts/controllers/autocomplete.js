angular.module('motekhasesanApp')
	.controller('landingQuestions', ['$scope', '$uibModal', '$cookies', 'User', '$state', 'Job', '$resource', '$location', '$stateParams', '$anchorScroll', '$timeout', '$rootScope', '$document',
		function ($scope, $uibModal, $cookies, User, $state, Job, $resource, $location, $stateParams, $anchorScroll, $timeout, $rootScope, $document) {
			$scope.Ctrl = {
				creatingProject: false
			}
			$scope.logged = $cookies.get('logged');
			$scope.isProff = $cookies.get('isProff');
			// @heroslider
			$scope.ready = function ($api) {
				owlAPi = $api;
			};
			$scope.heroSlider = {
				items: 1,
				loop: true,
				mouseDrag: false,
				touchDrag: false,
				pullDrag: false,
				dots: false,
				rtl: true,
				nav: false,
				startPosition: 0,
				autoplay: true,
				autoplayTimeout: 3000,
				autoplayHoverPause: false,
				animateIn: 'fadeIn',
				animateOut: 'fadeOut'
			};
			// @header
			$rootScope.scroll = new ScrollMagic.Controller();
			$rootScope.scene = new ScrollMagic.Scene({
					offset: 65
				})
				.setClassToggle("header#header", "header--active")
				.addTo($rootScope.scroll);

			// @scroll
			$scope.gotoAnchor = function (target, e) {
				e.preventDefault();
				$scope.target = target;
				if ($rootScope.toState.indexOf('landing.home') == -1) {
					$state.go('landing.home');
				} else {
					$timeout($scope.scroll(target));
				};
			}
			$scope.$on('$viewContentLoaded', function () {
				$rootScope.scroll.scrollTo(0);
				$rootScope.scroll.updateScene($rootScope.scene, true);
				if ($scope.target != undefined)
					$scope.scroll($scope.target);
			});
			$scope.scroll = function (target) {
				if (document.getElementById(target) != null) {
					$document.scrollToElementAnimated(angular.element(document.getElementById(target)), 60);
				};
				$scope.target = undefined;
			}

			$(document)
				.ready(function () {
					// @mainnav @mmenu
					if ($('#home-menu')
						.length) {
						$scope.$menu = $('#home-menu')
							.mmenu({
								offCanvas: {
									position: 'right',
									zposition: "back"
								},
								rtl: {
									use: true
								},
								navbar: {
									add: true,
									title: "منو"
								},
								onClick: {
									close: true,
									preventDefault: true,
									setSelected: true
								},
								extensions: [
									"fx-menu-slide",
								],
								keyboardNavigation: {
									enable: true
								},
								setSelected: {
									hover: true
								},
								dragOpen: true
							});
						$scope.$icon = $("#nav__opener");
						$scope.API = $scope.$menu.data("mmenu");
						$scope.$icon.on("click", function () {
							$scope.API.open();
						});
						$scope.API.bind("open:finish", function () {
							setTimeout(function () {
								$scope.$icon.addClass("is-active");
							});
						});
						$scope.API.bind('open:before', function () {
							setTimeout(function () {
								if (!($('#landing__inner')
										.hasClass('mm-slideout'))) {
									$('#landing__inner')
										.addClass('mm-slideout');
								}
							}, 1);
						});
						$scope.API.bind("close:finish", function () {
							setTimeout(function () {
								$scope.$icon.removeClass("is-active");
							});
						});
					}
					$scope.catSlider = {
						margin: 0,
						items: 4,
						loop: false,
						autoWidth: true,
						rtl: true,
						freeDrag: false,
						nav: true,
						navClass: ['cat__arrow cat__arrow--prev', 'cat__arrow cat__arrow--next'],
						navText: ['<i class="icon-arrow-right"></i>', '<i class="icon-arrow-left"></i>'],
						dots: false,
						stagePadding: 0,
						responsive: {
							890: {
								nav: false,
								mouseDrag: false
							}
						}
					};
				});
			$scope.createJobErr = false;
			$scope.inp = "";
			$scope.started = false;
			$scope.head = "";
			$scope.curr = -1;
			$scope.answers = [];
			$scope.completed = false;
			$scope.jobs = [];
			$scope.textOpt = '';
			$scope.datePickerCleave = {
				date: true,
				datePattern: ['Y', 'm', 'd']
			};
			$scope.resetArgs = function () {
				$(".item")
					.removeClass("active");
				$(".item:nth-child(1)")
					.addClass("active");
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
				$scope.projectUnauthorized = false;
				$scope.projectBad = false;
			};
			$scope.get_questions = function (_id) {
				if (_id !== undefined)
					var id = _id
				else if ($rootScope.$professions[$('.autocomplete__field')
						.typeahead('val')])
					var id = $rootScope.$professions[$('.autocomplete__field')
						.typeahead('val')];
				else
					return;
				document.getElementById('autocomplete__field') != undefined && document.getElementById('autocomplete__field')
					.blur();
				$rootScope.startLoading();
				$scope.resetArgs();
				$scope.getQuestionsErr = false;
				$scope.back = {
					'background': 'linear-gradient(to left bottom, #15baff, #0070ba);'
				};
				$scope.started = false;
				return $scope.questionPromise = Job.getQuestions.get({
					id: id
				}, function (success) {
					$scope.getQuestionsErr = false;
					$scope.questionProf = success;
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
					$scope.showTextOp.fill(false);
					$scope.textOpt.fill("");
					$scope.createJob = {
						profession_id: id,
						answers: {}
					};
					$scope.questions.forEach(function (question, idx) {
						$scope.createJob.answers[question._id] = {
							selected_options: [],
							text_option: $scope.showTextOp[idx]
						};
					});
					$scope.openModal();
					$rootScope.stopLoading();
				}, function (err) {
					$scope.getQuestionsErr = true;
					if (err) {
						// console.log(err);
					}
					$rootScope.stopLoading();
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
			$scope.skippQuestion = function () {
				$scope.createJob.answers[$scope.questions[$scope.curr]._id].selected_options.splice(0, $scope.createJob.answers[$scope.questions[$scope.curr]._id].selected_options.length);;
				$scope.createJob.answers[$scope.questions[$scope.curr]._id].text_option = "";
				$("#createJob")
					.carousel('next');
				$scope.curr += 1;
				$scope.head = $scope.questions[$scope.curr].title;
				$('.left-carousel-control')
					.show();
				$('.right-carousel-control')
					.show();
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
			};
			$scope.sendAnswers = function () {
				$scope.createJob.answers[$scope.questions[$scope.curr]._id].text_option = $scope.textOpt[$scope.curr];
				return Job.getProjects.save({}, $scope.createJob, function (data) {
					UIkit.notification("<h5 style='text-align: center;color:rgb(0,205,138)'>پروژه با موفقیت ثبت شد</h5>", {
						pos: 'top-center',
						timeout: 4000
					});
					$timeout(function () {
						$rootScope.projects.push(data);
						$rootScope.$projects.push(data);
						$scope.closeProjModal();
						$state.go('pages.projects');
						$rootScope.updateViewport();
					}, 500)
				}, function (err) {
					if (err.status == 401) {
						// Not logged in
						$scope.projectUnauthorized = 'برای ساخت پروژه باید وارد شوید'
						$cookies.putObject('answers', $scope.createJob);
					} else if (err.status == 400) {
						$scope.projectBad = err.data.message;
					} else {
						$scope.projectBad = 'قادر به ساخت این پروژه نیستید';
					}

				});
			};
			$scope.nextHead = function () {
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
				$scope.firstQuestion = true;
				$scope.lastQuestion = false;
				$scope.started = true;
				$scope.curr += 1;
				$scope.head = $scope.questions[$scope.curr].title;
				$scope.back = {
					'background-color': '#white'
				};
				$("#createJob")
					.carousel('next');
			};
			$scope.go_to_project = function (id) {
				$state.go('pages.project', {
					id: id
				});
			};
			$scope.openText = function (id) {
				$scope.showTextOp[id] = true;
			};
			$scope.gotoSignup = function () {
				$scope.closeProjModal();
				setTimeout(function () {
					$state.go('signupCustomer');
				}, 250)
			};
			$scope.loginModal = function () {
				$scope.closeProjModal();
				setTimeout(function () {
					$state.go('login');
				}, 250)
			};
			$scope.openModal = function () {
				$scope.$projectModal = $uibModal.open({
					templateUrl: 'merge/views/projectModal.html',
					windowClass: 'modal--project',
					scope: $scope,
					controller: function ($uibModalInstance) {
						$rootScope.isModalOpen = true;
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};
					}
				});
				$scope.$projectModal.closed.then(function () {
					$rootScope.isModalOpen = false;
				});
				$scope.$projectModal.rendered.then(function () {
					document.querySelector('.modal-body').focus();
					$rootScope.updateViewport();
				});
			}
			$scope.closeProjModal = function () {
				if ($scope.$projectModal != undefined)
					$scope.$projectModal.close(true);
			};
		}
	]);