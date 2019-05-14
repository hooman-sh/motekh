$(document).ready(function() {
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
	// @mainnav @mmenu
	if ($('#home-menu').length) {
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

			clone: true
			
		});
	}
});