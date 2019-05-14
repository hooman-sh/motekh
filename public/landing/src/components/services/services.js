$(document).ready(function() {

	var professions = [];

	_.templateSettings.variable = 'service';
	var $template = $('script.template').html();
	var template = _.template(
	  $template
	);

	var renderServices = function(arr) {
	  _.each(arr, function(elem) {
	    $('#services').prepend(template(elem));
	  });
	};

	$.ajax({
		url: 'http://motekhases.com/signup',
		type: 'GET',
		error: function(res) {
			callback();
		},
		success: function(res) {
			renderServices(res.categorires);
		}
	});

});
