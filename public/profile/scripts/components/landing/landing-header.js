angular.module('motekhasesanApp').directive('landingHeader', function factory() {
	var directiveDefinitionObject = {

		compile:

			function compile(tElement, tAttrs, transclude) {

				return function (scope, element, attrs) {
					if ($('#home-menu').length) {
						scope.$menu = $('#home-menu').mmenu({
							offCanvas: {
								position: 'right',
								zposition: "next"
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
							// extensions: [
							// 	"fx-panels-slide-0"
							// ],
							keyboardNavigation: {
								enable: true
							},
							setSelected: {
								hover: true
							},
							drag: {
								menu: {
									open: true
								}
							},
							dragOpen: true
						}, {
							offCanvas: {
								menuInsertSelector: angular.element('#landing'),
								pageSelector: '#landing__inner',
								wrapPageIfNeeded: false
							}
						});
						scope.$icon = $("#nav__opener");
						scope.API = scope.$menu.data("mmenu");
						scope.$icon.on("click", function () {
							scope.API.open();
						});
						scope.API.bind("open:finish", function () {
							setTimeout(function () {
								scope.$icon.addClass("is-active");
							});
						});
						scope.API.bind('open:before', function () {
							setTimeout(function () {
								if (!($('#landing__inner')
										.hasClass('mm-slideout'))) {
									$('#landing__inner')
										.addClass('mm-slideout');
								}
							}, 1);
						});
						scope.API.bind("close:finish", function () {
							setTimeout(function () {
								scope.$icon.removeClass("is-active");
							});
						});
					}
				}
			},

		controller:


			function controller($rootScope) {
				$rootScope.scroll = new ScrollMagic.Controller();
				$rootScope.scene = new ScrollMagic.Scene({
						offset: 65
					})
					.setClassToggle("header#header", "header--active")
					.addTo($rootScope.scroll);

			},

		templateUrl: '/landing/src/views/header.html'
	};
	return directiveDefinitionObject;
})