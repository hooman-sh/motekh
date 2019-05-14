'use strict';

angular.module('motekhasesanApp')
  .factory('User', function ($resource) {
    return $resource('', {
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
