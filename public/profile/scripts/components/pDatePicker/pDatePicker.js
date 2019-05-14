angular.module('motekhasesanApp')
	.directive('pDatePicker', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attr) {
				var yesterday = new Date();
				yesterday = yesterday.setDate(yesterday.getDate() - 1);
				$(elem).pDatepicker({
					autoClose: true,
					observer: true,
					inputDelay: 100,
					timePicker: {
						enabled: false
					},
					minDate: new persianDate((function(d) {
						d.setDate(d.getDate() - 1);
						return d
					})(new Date)),
					format: 'YYYY/MM/DD',
					persianDigit: true,
					dayPicker: {
						onSelect: function(selectedDayUnix) {
							scope.textOpt[scope.curr] = new persianDate(selectedDayUnix).format("YY/M/D");
						}
					}
				});
			}
		}
	})
