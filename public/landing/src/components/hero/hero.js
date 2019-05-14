$(document).ready(function() {
	$('.slider--hero').owlCarousel({
		items: 1,
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: false,
		rtl: true,
		startPosition: 0,
		autoplay: true,
		autoplayTimeout: 3000,
		animateIn: 'fadeIn',
		animateOut: 'fadeOut'
	})
});