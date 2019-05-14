'use strict';
var config = {
	api: window.apiLocation
};
angular.module('motekhasesanApp', [
		'ngRaven',
		'ngAnimate',
		'ngResource',
		'ui.router',
		'ngSanitize',
		'ngTouch',
		'ui.bootstrap',
		'ngCookies',
		'ngRoute',
		'angularPromiseButtons',
		'jmp.carousel',
		'cleave.js',
		'angular-joyride',
		'duScroll'
	])
	.filter('dateConvertPersia', function () {
		return function (input) {
			return new persianDate(new Date(input))
				.format(' DD MMMM  YYYY');
		}
	})
	.filter('dateToPersia', function () {
		return function (input) {
			var current = new Date();
			var previous = new Date(input);
			var msPerMinute = 60 * 1000;
			var msPerHour = msPerMinute * 60;
			var msPerDay = msPerHour * 24;
			var msPerMonth = msPerDay * 30;
			var msPerYear = msPerDay * 365;
			var elapsed = current - previous;
			// console.log(elapsed);
			if (elapsed < msPerMinute) {
				return Math.round(elapsed / 1000) + ' ثانیه پیش';
			} else if (elapsed < msPerHour) {
				return Math.round(elapsed / msPerMinute) + ' دقیقه پیش';
			} else if (elapsed < msPerDay) {
				return Math.round(elapsed / msPerHour) + ' ساعت پیش';
			} else if (elapsed < msPerMonth) {
				return Math.round(elapsed / msPerDay) + ' روز پیش';
			} else if (elapsed < msPerYear) {
				return Math.round(elapsed / msPerMonth) + ' ماه پیش';
			} else {
				return Math.round(elapsed / msPerYear) + ' سال پیش';
			}
		}
	})
	.filter('numberToPersia', function () {
		return function (input) {
			String.prototype.allReplace = function (obj) {
				var retStr = this;
				for (var x in obj) {
					retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
				}
				return retStr;
			};
			if (input != undefined) {
				var toStr = input.toString();
				var res = toStr.allReplace({
					'0': '۰',
					'1': '۱',
					'2': '۲',
					'3': '۳',
					'4': '۴',
					'5': '۵',
					'6': '۶',
					'7': '۷',
					'8': '۸',
					'9': '۹'
				})
				return res;
			} else {
				return "";
			}
		};
	})
	.config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', 'angularPromiseButtonsProvider',
		function ($stateProvider, $urlRouterProvider, $resourceProvider, angularPromiseButtonsProvider) {
			angularPromiseButtonsProvider.extendConfig({
				spinnerTpl: '<span class="btn-loader"></span>',
				disableBtn: true,
				btnLoadingClass: 'is-loading',
				addClassToCurrentBtnOnly: false,
				disableCurrentBtnOnly: false,
				minDuration: 1000,
				CLICK_EVENT: 'click',
				CLICK_ATTR: 'ngClick',
				SUBMIT_EVENT: 'submit',
				SUBMIT_ATTR: 'ngSubmit',
				BTN_SELECTOR: 'button'
			});
			$resourceProvider.defaults.actions.get = {
				withCredentials: true
			};
			$resourceProvider.defaults.actions.query = {
				withCredentials: true,
				isArray: true
			};
			$resourceProvider.defaults.actions.save = {
				withCredentials: true
			};
			$resourceProvider.defaults.actions.delete = {
				withCredentials: true
			};
			$urlRouterProvider.otherwise('/landing/');
			$urlRouterProvider.when('/landing', '/landing/');
			$urlRouterProvider.when('/pages/projects', '/pages/projects/');
			$stateProvider
				// @landing
				.state('landing', {
					url: '/landing',
					controller: 'landingQuestions',
					templateUrl: 'landing/src/views/index.html',
					onExit: function () {
						angular.element('#home-menu').remove();
					},
					onEnter: function () {
						setTimeout(function () {
							angular.element('#mm-0').append(angular.element('body > div[ui-view]'));
						}, 50);
					},
					// views: {
					// 	"header": {
					// 		template: '<landing-header/>'
					// 	},
					// 	"main": {
					// 		templateUrl: 'landing/src/views/home.html'
					// 	},
					// 	"footer": {
					// 		template: '<landing-footer/>'
					// 	}
					// }
				})
				.state('landing.home', {
					url: '/',
					templateUrl: 'landing/src/views/home.html'
				})
				.state('landing.services', {
					url: '/services/:id',
					data: {
						pageTitle: 'خدمات'
					},
					templateUrl: 'landing/src/views/services.html'
					// views: {
					// 	"header": {
					// 		template: '<landing-header/>'
					// 	},
					// 	"main": {
					// 		templateUrl: 'landing/src/views/services.html'
					// 	},
					// 	"footer": {
					// 		template: '<landing-footer/>'
					// 	}
					// }
				})
				.state('landing.proficients', {
					url: '/proficients/:profession_id', //596ddf46a5d1276a05d3258a
					templateUrl: 'landing/src/views/proficients.html',
					controller: 'proficients',
					controllerAs: 'Ctrl',
					resolve: {
						proficients: function ($stateParams, $http) {
							if ($stateParams.profession_id)
								return $http.get(config.api + 'professions/' + $stateParams.profession_id + '/proficients')
						},
						cat: function ($stateParams, $rootScope, $q) {

							function resolveCat() {
								return $q(function (resolve, reject) {
									$rootScope.$watch('$services', function (category) {
										if (angular.isUndefined(category) || !angular.isUndefined(categories)) return;
										var categories = category;

										categories.forEach2(function (professions) {
											for (var i = 0; i < professions.professions.length; i++) {
												if (professions.professions[i]._id == $stateParams.profession_id) {
													resolve(professions);
													break;
												}
											}
										});
										reject();
									});
								});
							}

							var promise = resolveCat();
							return promise.then(function (cat) {
								return cat;
							}, function () {
								return 0;
							});

						}
					}
				})
				.state('landing.about', {
					url: '/about',
					templateUrl: 'landing/src/views/about.html'
				})
				.state('landing.contact', {
					url: '/contactus',
					templateUrl: 'landing/src/views/contact.html'
				})
				.state('pages', {
					url: '/pages',
					controller: 'pages',
					onExit: function () {
						angular.element('#profile-menu').remove();
						if (angular.element('.jr_container') != undefined)
							angular.element('.jr_container').remove();
					},
					templateUrl: 'merge/views/pages.html'
				})
				.state('signup', {
					url: '/signup',
					data: {
						pageTitle: 'ثبت نام متخصص'
					},
					templateUrl: 'merge/views/signup.html'
					// controller: 'signup'
				})
				.state('signupCustomer', {
					url: '/signup-customer',
					data: {
						pageTitle: 'ثبت نام مشتری'
					},
					templateUrl: 'merge/views/signup-customer.html'
					// controller: 'signup'
				})
				.state('validation', {
					url: '/validation',
					params: {
						'firstname': null,
						'user_id': null,
						'fromLogin': null
					},
					controller: 'mobileVerify',
					templateUrl: 'merge/views/verify_mobile.html'
				})
				.state('pages.setting', {
					url: '/setting',
					controller: 'dashboard as Ctrl',
					templateUrl: 'merge/views/setting.html'
				})
				.state('landing.rules', {
					url: '/rules',
					data: {
						pageTitle: 'قوانین'
					},
					templateUrl: 'views/rules.html'
				})
				.state('login', {
					url: '/login',
					data: {
						pageTitle: 'ورود'
					},
					templateUrl: 'merge/views/login.html',
					controller: 'login'
				})
				.state('pages.customersReq', {
					url: '/customers',
					templateUrl: 'merge/views/customers.html',
					controller: 'customers'
				})
				.state('pages.customReq', {
					url: '/customers/:id',
					templateUrl: 'merge/views/customersreq.html',
					controller: 'customerReq'
				})
				.state('pages.requests', {
					url: '/requests',
					templateUrl: 'merge/views/requests.html',
					controller: 'requests'
				})
				.state('pages.projects', {
					url: '/projects/',
					templateUrl: 'merge/views/projects.html',
					controller: 'projects'
				})
				.state('pages.projects.single', {
					url: ':id',
					templateUrl: 'merge/views/project.html',
					controller: 'project'
				})
				.state('pages.request', {
					url: '/requests/:id',
					templateUrl: 'merge/views/request.html',
					controller: 'request'
				})
				.state('pages.dashboard', {
					url: '/dashboard',
					templateUrl: 'merge/views/dashboard.html',
					controller: 'dashboard'
				})
				.state('pages.profile', {
					url: '/profile/:job_id/:offer_id',
					templateUrl: 'merge/views/profile.html',
					controller: 'profile'
				})
				.state('pages.help', {
					url: '/help',
					templateUrl: 'merge/views/help.html'
				});

			// $locationProvider.html5Mode(true);

			// $provide.decorator('$sniffer', function ($delegate) {
			// 	$delegate.history = false;
			// 	return $delegate;
			// });
		}
	])
	.config(function ($httpProvider, $uiViewScrollProvider, $qProvider, $animateProvider) {
		$uiViewScrollProvider.useAnchorScroll();
		$animateProvider.classNameFilter(/\banimate\b/);
		$qProvider.errorOnUnhandledRejections(false)
		$httpProvider.defaults.headers.common = {};
		$httpProvider.defaults.headers.post = {};
		$httpProvider.defaults.headers.put = {};
		$httpProvider.defaults.headers.patch = {};
		// $httpProvider.interceptors.push('myHttpInterceptor');
	})
	.run(['$state', '$rootScope', '$anchorScroll', 'User', '$cookies', '$stateParams', '$resource', '$timeout', '$window', '$location', '$document', 'Job', '$animate',
		function ($state, $rootScope, $anchorScroll, User, $cookies, $stateParams, $resource, $timeout, $window, $location, $document, Job, $animate) {
			$window.ga('create', 'UA-99324713-1', 'auto')
			$rootScope.ac_engine = new Bloodhound({
				datumTokenizer: function (d) {
					return Bloodhound.tokenizers.whitespace(d);
				},
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				async: true
			});
			$rootScope.stopLoading = function () {
				$timeout(function () {
					$rootScope.appIsLoading = false;
				});
			};
			$rootScope.startLoading = function () {
				$timeout(function () {
					$rootScope.appIsLoading = true;
				});
			}
			// @services
			// Get Services and assign it globally
			var Services = $resource(config.api + 'signup', {}, {
				query: {
					isArray: false
				}
			});
			Services.query(function (res) {
				$rootScope.$services = res.categorires;
				$rootScope.$professions = [];
				var $professions = [];
				$rootScope.$services.forEach2(function (item, index) {
					item.professions.forEach2(function (item1, index1) {
						$rootScope.$professions[item1.title] = item1._id;
						$professions.push(item1.title);
					});
				});
				$rootScope.ac_engine.add($professions);
			});
			$rootScope.startLoading()
			$rootScope.pageIsLoaded = false;
			$rootScope.$on('$stateChangeStart', function ($stateParams) {
				$rootScope.startLoading()
				$rootScope.pageIsLoaded = false;
				clearInterval($rootScope.profileMessage);
				clearInterval($rootScope.requestMessage);
			});
			$rootScope.$on('$stateChangeSuccess', function ($stateParams, toState) {
				$rootScope.toState = toState.name;
				$rootScope.stopLoading()
				$rootScope.pageIsLoaded = true;
				$window.ga('send', 'pageview', $location.path());
				$timeout(function () {
					$rootScope.title = (toState.data && toState.data.pageTitle) ? "جاپ - " + toState.data.pageTitle : 'Jopp - جاپ - درخواست آنلاین نیروی متخصص';
					$document[0].title = $rootScope.title;
					[].forEach.call(document.querySelectorAll('img.lazy'), function (img) {
						img.setAttribute('src', img.getAttribute('data-src'));
						img.onload = function () {
							img.removeAttribute('data-src');
						};
					});
					if (UIkit.modal('#myModal') != undefined) UIkit.modal('#myModal')
						.$destroy(true);
					// Check user authentication
					if ($rootScope.toState.indexOf('pages') != -1) {
						User.checkAuthentication.get({}, function (success) {
							if (success.statusCode == 401 || $cookies.get('logged') != 'true') {
								$cookies.put('logged', 'false');
								$state.go('login');
							}
						}, function (err) {});
					}
				});
			});
			$rootScope.updateViewport = function () {
				$timeout(function () {
					if (UIkit.heightViewport('[uk-height-viewport]') != undefined) {
						UIkit.heightViewport('[uk-height-viewport]')
							.$update()
					}
				}, 400);
			}
			$rootScope.$on('$viewContentLoaded', function () {
				$rootScope.updateViewport();
			});
			$rootScope.errFetch = function (res) {
				$rootScope.stopLoading()
				if (res.status == 401 || res.status == 403) return $cookies.put('logged', 'false');
				UIkit.notification("<h5 style='text-align: center;color:rgb(238,31,88)'>دریافت اطلاعات انجام نشد، مجددا تلاش کنید</h5>", {
					pos: 'top-center',
					timeout: 3000
				});
			}
			$rootScope.loadUser = function () {
				if ($rootScope.user) return $rootScope.$digest();
				$rootScope.isProff = $cookies.get('isProff')
				$rootScope.user = angular.copy($rootScope.$user);
				$rootScope.userProfessions = [];
				$rootScope.user.professions.forEach2(function (item) {
					$rootScope.userProfessions.push(item.profession._id)
				})
				if ($rootScope.user.mobileVerified == false)
					$state.go('validation', {
						'firstname': user.firstname,
						'user_id': user._id,
						'fromLogin': true
					});
				if ($rootScope.user.firstVisit == false && $rootScope.user.gender != 'na' && $cookies.get('answers') != undefined && $cookies.get('isProff') == 'true') {
					UIkit.modal('#createJobFromLanding')
						.show();
				}
			}
			$rootScope.$watch(function () {
				return $cookies.get('logged');
			}, function (logged) {
				if (angular.isUndefined(logged) || logged == 'false') {
					$timeout(function () {
						$rootScope.user = false;
						$rootScope.$user = false;
						$rootScope.projects = [];
						$rootScope.$projects = false;
						$rootScope.customers = [];
						$rootScope.$customers = false;
						$rootScope.requests = [];
						$rootScope.$requests = false;
						$rootScope.profileLoaded = false;
					})
				} else {

					var asyncTasks = [];

					function getProjects(callback) {
						return Job.getProjects.query({}, function (res) {
							$rootScope.projects = [];
							$rootScope.$projects = res;
							callback(null, res);
						}, function (err) {
							callback(err, null);
						});
					};
					asyncTasks.push(getProjects);

					function getUser(callback) {
						return User.dashboard.get(function (res) {
							$rootScope.user = false;
							$rootScope.$user = res;
							$rootScope.loadUser()
							callback(null, res);
						}, function (err) {
							callback(err, null);
						});
					};
					asyncTasks.push(getUser);

					if ($cookies.get('isProff') == 'true') {
						function getRequests(callback) {
							return Job.makeNewOffer.query(function (res) {
								$rootScope.requests = [];
								$rootScope.$requests = res;
								callback(null, res);
							}, function (err) {
								callback(err, null);
							});
						};
						asyncTasks.push(getRequests);

						function getCustomers(callback) {
							return Job.getJobsOffers.query({}, function (res) {
								$rootScope.customers = [];
								$rootScope.$customers = res;
								callback(null, res);
							}, function (err) {
								callback(err, null);
							});
						};
						asyncTasks.push(getCustomers);
					}

					async.parallel(asyncTasks, function (err, results) {
						if (err != null) {
							$rootScope.errFetch(err);
						}
					})
				}
			});
			$rootScope.setGender = function (Gender) {
				$rootScope.settingGender = false;
				User.updateProfile.change({
					gender: Gender
				}, function (res) {
					if ($cookies.get('answers') != undefined) {
						UIkit.modal('#createJobFromLanding')
							.show();
					}
				})
			}
			Array.prototype.forEach2 = function (a) {
				var l = this.length;
				for (var i = 0; i < l; i++) a(this[i], i)
			};
			$rootScope.isEmpty = function (obj) {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) return false;
				}
				return true;
			}
		}
	])
	.directive('ngEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if (event.which === 13) {
					scope.$apply(function () {
						scope.$eval(attrs.ngEnter);
					});
					event.preventDefault();
				}
			});
		};
	});