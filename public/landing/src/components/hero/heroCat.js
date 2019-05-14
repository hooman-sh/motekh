$(document).ready(function() {

	$('.cat__list').owlCarousel({
		margin: 0,
		items: 4,
		autoWidth: true,
		rtl: true,
		freeDrag: false,

		nav: true,
		navClass: ['cat__arrow cat__arrow--prev', 'cat__arrow cat__arrow--next'],
		navText: ['<i class="icon-arrow-right"></i>', '<i class="icon-arrow-left"></i>'],

		dots: false,
		stagePadding: 0,

		responsive: {
			1300: {
				// items: 9,
				// autoWidth: false
				nav: false,
				center: true,
				mouseDrag: false
			}
		}
	})
	
})
