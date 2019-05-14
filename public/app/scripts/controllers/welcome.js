'use strict';

/**
 * @ngdoc function
 * @name motekhasesanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
  .controller('welcome',['$scope','$stateParams', function ($scope,$stateParams) {
      $scope.firstname = $stateParams.firstname;
      console.log($scope.firstname);
  }]);
