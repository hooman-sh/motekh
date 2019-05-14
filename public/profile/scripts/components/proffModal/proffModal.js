(function () {
	'use strict';

	angular
		.module('motekhasesanApp')
		.component('proffModal', component());


	function component() {

		function componentController($timeout, $scope, $q, $rootScope) {
			var vm = this;

			vm.cancel = function () {
				vm.dismiss();
			};

			vm.submit = function () {
				vm.promise = $q(function (resolve, reject) {
					if ($scope.proffIsValid && !$scope.proffAlreadySelected) {
						if (!vm.creatingProject && $rootScope.userProfessions.length == 3) {
							vm.professionsIsFull = true
							reject();
						}
						return (!vm.creatingProject) ? vm.resolve.addProffession(resolve, reject) : vm.resolve.get_questions(resolve, reject)
					} else {
						reject()
					}
				})

				vm.promise.then(function () {
					vm.err = false;
					vm.serverErr = false;
				}, function (err) {
					vm.err = true;
					if (err.serverErr) vm.serverErr = true;
				})
			}


			vm.$onInit = function () {
				vm.err = false
				$rootScope.isModalOpen = true;
				$rootScope.updateViewport();
				vm.creatingProject = vm.resolve.creatingProject
				vm.modalInstance.opened.then(function () {
					document.getElementById('autocomplete__field')
						.focus()
				})
			}

			$scope.$on('modal.closing', function (ev, reason, closed) {
				$rootScope.isModalOpen = false;
			});
		}

		return {
			bindings: {
				resolve: '<',
				close: '&',
				dismiss: '&',
				modalInstance: '<'
			},
			controller: componentController,
			controllerAs: 'Ctrl',
			templateUrl: 'merge/views/proffModal.html'
		}
	}

}());