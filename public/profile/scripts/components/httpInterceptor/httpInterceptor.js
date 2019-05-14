angular.module('motekhasesanApp')
	.factory('myHttpInterceptor', function ($q) {
		return {
			// optional method
			'request': function (config) {
				// do something on success
				// return $q.reject(rejection);
				// console.log(config)
				return config;
			},
			// optional method
			'requestError': function (rejection) {
				// do something on error
				// if (canRecover(rejection)) {
				// return responseOrNewPromise
				console.log(rejection);
				// }
				return $q.resolve(rejection);
			},
			// optional method
			'response': function (res) {
				// do something on success

				if (res.config.url == 'http://localhost:7532/customers/jobs') {
					$timeout(function () {

						return res
					}, 2000);
					
					// return (deferred.promise);
				}
				else
					return res
			},
			// optional method
			'responseError': function (rejection) {
				// do something on error
				console.log(rejection);
				// $http[rejection.config.method](rejection.config.url)
				// 	.success(function (res) {
				// 		console.log(res);
				// 		return $q.resolve(rejection);
				// 	});
				// if (canRecover(rejection)) {
				// 	return responseOrNewPromise
				// }
				// return $q.resolve(rejection);

				var Session = $injector.get('Session');
				var $http = $injector.get('$http');
				// first create new session server-side
				var defer = $q.defer();
				var promiseSession = defer.promise;
				Session.query({}, function () {
					defer.resolve();
				}, function () {
					// error
					defer.reject();
				});
				// and chain request
				var promiseUpdate = promiseSession.then(function () {
					return $http(response.config);
				});
				return promiseUpdate;
				// return $q.reject(response);
			}
		};
	});