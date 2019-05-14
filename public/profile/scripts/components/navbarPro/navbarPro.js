/**
 * Created by mehrnaz on 12/29/16.
 */
angular.module('motekhasesanApp')
	.directive('navbarPro', function () {
		return {
			templateUrl: 'views/navbarPro.html',
			restrict: 'E',
			controller: function ($scope, $timeout, $cookies, $rootScope) {
				$timeout(function () {
					$scope.isProff = $cookies.get('isProff');
					$scope.$menu = $('#profile-menu').mmenu({
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
						}
					}, {
					});
					$scope.$icon = $("#nav__opener");
					$rootScope.menuApi = $scope.$menu.data("mmenu");
					$scope.$icon.on("click", function () {
						$rootScope.menuApi.open();
					});
					$rootScope.menuApi.bind("open:finish", function () {
						setTimeout(function () {
							$scope.$icon.addClass("is-active");
						}, 100);
					});
					$rootScope.menuApi.bind("close:finish", function () {
						setTimeout(function () {
							$scope.$icon.removeClass("is-active");
						}, 100);
					});
				}, 1);
			}
		};
	});