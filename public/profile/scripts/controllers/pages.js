(function () {
	'use strict';

	angular
		.module('motekhasesanApp')
		.controller('pages', ControllerCtrl)

	/** @ngInject */
	function ControllerCtrl($scope, $rootScope, joyrideService, $cookies, $timeout, User, $state) {
		var vm = this;

		var introMenuItem = function () {
			if (Modernizr.mq('(min-width: 992px)')) {
				if (!this.selector.indexOf('--lg') !== -1) this.selector += '.intro--lg';
				$rootScope.joyride.resumeJoyride();
			} else {
				this.scroll = false;
				if (!this.selector.indexOf('--sm') !== -1) this.selector += '.intro--sm';
				if ($('#profile-menu')
					.hasClass('mm-opened')) {
					setTimeout(function () {
						$rootScope.joyride.resumeJoyride();
						return;
					}, 1);
				}
				$rootScope.menuApi.open();
				$rootScope.menuApi.bind('open:finish', function () {
					setTimeout(function () {
						$rootScope.joyride.resumeJoyride();
					}, 1);
				});
			}
		};

		init();

		function init() {


			vm.isProff = $cookies.get('isProff');

			$scope.exit = function () {
				$rootScope.menuApi.close();
				$cookies.put('logged', 'false');
				User.logout.get(function (res) {
					$state.go('landing.home');
				}, function () {});
				$state.go('landing.home');
			};

			$rootScope.$watch('user', function (user) {
				if (user != undefined) {
					if (user.firstVisit == true) {
						// @intro
						$rootScope.joyride = joyrideService;
						if (vm.isProff == 'true') {
							$rootScope.joyride.config = {
								template: '../../merge/views/joyride.html',
								onFinish: function () {
									User.visit.get();
								},
								steps: [{
										title: "به جاپ خوش آمدید",
										content: 'به مناسبت افتتاح وبسایت جاپ و آشنایی بهتر شما با نحوه کار، تمامی خدمات وبسایت ما به مدت محدودی کاملا رایگان می باشد.',
										placement: 'center',
									},
									{
										title: "جنسیت",
										content: "برای دریافت پروژه مناسب جنسیت خود را تعیین کنید.",
										placement: 'center',
										beforeStep: function () {
											$rootScope.settingGender = true;
											$rootScope.joyride.resumeJoyride();
										}
									},
									{
										title: "تأیید کردن ایمیل",
										content: "برای اطلاع از پروژه های جدید ایمیل خود را تأیید کنید.",
										placement: 'center',
										beforeStep: function () {
											$rootScope.settingGender = false;
											$rootScope.joyride.resumeJoyride();
										}
									},
									{
										title: "آپلود عکس",
										content: 'از خودتان یک عکس مناسب بگذارید تا علاوه بر افزایش درصد اطمینان خود باعث متمایز شدن پروفایل شما نسبت به سایرین شود',
										type: 'element',
										selector: '#intro-1'
									},
									{
										title: "درصد اطمینان",
										content: "درصد اطمینان درواقع هسته اصلی تایید هویت و اطلاعات شما برای مشتری می باشد، به هر میزان که درصد شما بیشتر باشد ما به مشتری اطمینان می دهیم که اطلاعات شما صحیح و تایید شده است. شما می توانید با کلیک بر روی گزینه افزایش درصد اطمینان اقدامات لازم برای افزایش درصد خود را مشاهده نمایید.",
										type: 'element',
										selector: '#intro-2'
									},
									{
										title: 'اضافه کردن تخصص',
										content: 'شما می توانید هم زمان در ۳ تخصص فعالیت کنید و پروژه بگیرید. ',
										type: 'element',
										selector: '#intro-3',
										beforeStep: function () {
											$rootScope.menuApi.close();
											$rootScope.joyride.resumeJoyride();
										}
									},
									{
										title: 'مشتریان',
										content: 'در این صفحه شما می توانید لیست کامل مشتریان و پروژه های آنها را ببینید و بر اساس جزئیات پروژه قیمت پیشنهادی و پیام خود را ارسال کنید.',
										type: 'element',
										selector: '.intro-4',
										beforeStep: introMenuItem
									},
									{
										title: 'درخواست های ارسال شده',
										content: 'در این صفحه شما می توانید وضعیت پروژه هایی که برای آنها پیشنهاد ارسال کردید مشاهده نمایید.',
										type: 'element',
										selector: '.intro-5',
										beforeStep: introMenuItem
									},
									{
										title: 'پروژه های شخصی',
										content: 'در این صفحه شما می توانید به عنوان مشتری پروژه ایجاد کنید و متخصص مورد نظر خود را پیدا کنید.',
										type: 'element',
										selector: '.intro-6',
										beforeStep: introMenuItem
									},
								]
							};
						} else if (vm.isProff == 'false') {
							$rootScope.joyride.config = {
								template: '../../merge/views/joyride.html',
								onFinish: function () {
									User.visit.get();
								},
								steps: [{
										title: "جنسیت",
										content: "لطفاً جنسیت خود را تعیین کنید.",
										placement: 'center',
										beforeStep: function () {
											$rootScope.settingGender = true;
											$rootScope.joyride.resumeJoyride();
										}
									},
									{
										title: 'پروژه های شخصی',
										content: 'در این صفحه می توانید پروژه ایجاد کنید و متخصص مورد نظر خود را پیدا کنید.',
										type: 'element',
										selector: '.intro-6',
										beforeStep: introMenuItem
									},
									{
										title: "تأیید کردن ایمیل",
										content: "برای اطلاع از پیشنهادات متخصصین ایمیل خود را تأیید کنید.",
										placement: 'center',
										beforeStep: function () {
											$rootScope.menuApi.close();
											$rootScope.joyride.resumeJoyride();
										}
									}
								]
							};
						}
						$rootScope.joyride.start = true;
					} else if (user.gender == 'na') {
						$rootScope.joyride = joyrideService;
						$rootScope.joyride.config = {
							template: '../../merge/views/joyride.html',
							onFinish: function () {
								User.visit.get();
							},
							steps: [{
								title: "جنسیت",
								content: "لطفاً جنسیت خود را تعیین کنید.",
								placement: 'center',
								beforeStep: function () {
									$rootScope.settingGender = true;
									$rootScope.joyride.resumeJoyride();
								}
							}]
						};
						$rootScope.joyride.start = true;
					}
				}
			});

			if (angular.element('#mm-0') != undefined) {
				angular.element('#mm-0').append(angular.element('body > div[ui-view]'));
			}

		}

	}

}());