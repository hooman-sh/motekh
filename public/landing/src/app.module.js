import angular from 'angular'

// Angular Modules
require('angular-material')
require('../node_modules/angular-simple-slider/dist/angular-simple-slider.min.js')
require('@uirouter/angularjs')
require('angular-resource')


const App = angular.module('app', ['ngMaterial', 'angularSimpleSlider', 'ui.router', 'ngAnimate', 'ngResource'])

	// Routes
	.config(($stateProvider, $urlRouterProvider) => {

		// @UI.ROUTER ==============
		const home = {
			name: 'home',
			url: '/',
			template: '<home></home>',
	}

		const services = {
			name: 'services',
			url: '/services',
			template: '<services></services>',
	}

		$urlRouterProvider.otherwise('/')

		$stateProvider.state(home)
		$stateProvider.state(services)

	})

	.run(['$transitions', '$rootScope', '$timeout', function($transitions, $rootScope, $timeout) {

		$transitions.onStart({
			from: '',
			to: 'home'
		}, () => {
			$rootScope.homeLoaderProgress = 0
			$rootScope.homeIsLoading = true
		})

		$transitions.onFinish({
			from: '',
			to: 'home'
		}, () => {
			$rootScope.homeLoaderProgress = 100
			$timeout(() => {
				$rootScope.homeIsLoading = false
			}, 1200)
		})

		$transitions.onStart({}, function() {

		})

	}])

;
