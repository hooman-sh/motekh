angular
	.module('motekhasesanApp')
	.component('landingMain', component());


function component() {

	function componentController() {
		var vm = this;

		init();

		vm.ready = function ($api) {
			owlAPi = $api;
		};
		vm.heroSlider = {
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

		function init() {

		}
	}

	return {
		bindings: {},
		controller: componentController,
		controllerAs: '${ctrl}',
		templateUrl: '/landing/src/views/home.html'
	}
}