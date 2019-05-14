angular.module('motekhasesanApp').directive('landingFooter', function factory() {
	var directiveDefinitionObject = {

		compile:

			function compile(tElement, tAttrs, transclude) {

				return function (scope, element, attrs) {}
			},

		controller:

			function controller() {

			},

		templateUrl: '/landing/src/views/footer.html'
	};
	return directiveDefinitionObject;
})