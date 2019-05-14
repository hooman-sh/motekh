(function () {
	'use strict';

	angular
		.module('motekhasesanApp')
		.directive('services', directive);


	/** @ngInject */
	function directive($rootScope, $stateParams, $document, $timeout) {

		function directiveController() {
			var vm = this;

			init();

			vm.loaded = function () {
				$timeout(function () {
					var $hash = vm.id
					var elem = angular.element(document.getElementById($hash))
					$document.scrollToElementAnimated(elem, 60)
					$rootScope.stopLoading()
				}, 700)
			}

			function init() {
				vm.id = window.decodeURIComponent($stateParams.id)
			}
		}

		function link(scope, el, attrs) {
			if (!scope.Ctrl.id) return
			$rootScope.startLoading()
			if (scope.$last)
				scope.$eval(attrs.services)
		}

		return {
			bindToController: true,
			controller: directiveController,
			controllerAs: 'Ctrl',
			link: link,
			restrict: 'A',
			// scope: {}
		}
	}

}());