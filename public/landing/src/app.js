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
		autoplayHoverPause: false,
		animateIn: 'fadeIn',
		animateOut: 'fadeOut'
	});

	var scroll = new ScrollMagic.Controller();

	var scrollTrigger = ($('.hero__content').length) ? {
		triggerElement: '.hero__content',
		triggerHook: 0,
		offset: -70
	} : {
		offset: 65
	};

	new ScrollMagic.Scene(scrollTrigger)
		.setClassToggle("header#header", "header--active")
		.addTo(scroll);

	// @anchor @scroll
	$('.link--scroll').on('click', function(e) {
		if ( !( $(this).attr('href').length ) )
			return;
		e.preventDefault();
		var el = $($(this).attr('href'));
		$('html, body').animate({scrollTop: el.offset().top});
		return false;
	} );

	// @mainnav @mmenu
	if( $('#home-menu').length ) {
		$('#home-menu').mmenu({
			offCanvas: {
				position: 'right'
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
				preventDefault: false,
				setSelected: true
			},

			extensions: [
				// "fx-menu-slide",
				"fx-panels-slide-0"
			],

			keyboardNavigation: {
				enable: true
			},

			setSelected: {
				hover: true
			}
		}, {

			offCanvas: {
				menuInsertSelector: '#home'
			}

			// clone: true
			
		});
	}

	var $catSlider = $('.cat__list');
	$catSlider.owlCarousel({
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
			890: {
				nav: false,
				mouseDrag: false
			}
		}
	});
	setTimeout(function() {
		$catSlider.trigger('refresh.owl.carousel');
	}, 50)
});