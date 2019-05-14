'use strict';

/**
 * @ngdoc function
 * @name motekhasesanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
  .controller('main',['$scope','$state','anchorSmoothScroll', function ($scope,$state,anchorSmoothScroll) {
  	$scope.gotoElement = function (eID){
		// set the location.hash to the id of
		// the element you wish to scroll to.


		// call $anchorScroll()
		anchorSmoothScroll.scrollTo(eID);
		};
      $scope.goTosignup = function () {
        $state.go('signup');
      }
  }]);
