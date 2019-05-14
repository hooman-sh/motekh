'use strict';

/**
 * @ngdoc overview
 * @name motekhasesanApp
 * @description
 * # motekhasesanApp
 *
 * Main module of the application.
 */
var config = {
  api: "http://67.205.129.9:3458/"
};
angular
  .module('motekhasesanApp', [
    'ngAnimate',
    'ngStorage',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch'
  ])
.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/home');
            $stateProvider
                .state('home',{
                    url: '/home',
                    controller: 'main',
                    templateUrl: 'views/mainpage.html'
                })
              .state('signup',{
                url: '/signup',
                templateUrl: 'views/signup.html',
                // controller: 'signup'
              })
              .state('welcome',{
                url: '/welcome',
                controller: 'welcome',
                params:{'firstname' : null},
                templateUrl: 'views/welcome.html'
              })
              .state('services',{
                url: '/services',
                templateUrl: 'views/services.html'
              })
              .state('rules',{
                url: '/rules',
                templateUrl: 'views/rules.html'
              })
        }])
  .config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
});
