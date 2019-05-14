'use strict';

/**
 * @ngdoc function
 * @name motekhasesanApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motekhasesanApp
 */
angular.module('motekhasesanApp')
  .controller('signup',['$scope','User','$state', function ($scope,User,$state) {
    $scope.Professions = [];
    $scope.selectedtitle = "";
    $scope.repPass="";
    $scope.add_proff=false;
    $scope.user = {
      firstname: "",
      lastname: "",
      email: "",
        mobile:'',
      password: "",
      selected_profession: "",
        new_profession:""
    };

    User.getproffesions.get(function success(res /*, responseHeaders*/){
          // console.log(res);
          $scope.Professions = res.professions;

    },function (err) {
      // console.log(err);
    });
    $scope.register = function () {
        $scope.alreadySigned=false;
        $scope.err=false;
      User.registerUser.save({},JSON.stringify($scope.user), function success(res ){
        $state.go('welcome', {'firstname' : $scope.user.firstname });
      }, function (err) {
        // console.log(err);
          if(err.status == 409)
              $scope.alreadySigned = true;
          else{
              $scope.err = true;
          }
      })
    };
    $scope.openbox=function () {
        if($scope.add_proff == false){
            $scope.add_proff = true;
        }
        else {
            $scope.add_proff = false;
        }
    }

  }]);

