angular
	.module('motekhasesanApp')
	.controller('proficients', ControllerCtrl)

function ControllerCtrl($scope, proficients, cat) {
	var vm = this;

	vm.$onInit = function init() {
		vm.cat = cat;
		vm.proficients = proficients.data;

	}

}