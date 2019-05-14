'use strict';

angular.module('motekhasesanApp')
  .factory('User', ['$resource',function ($resource) {
    var output = {};
    output.registerUser = $resource(config.api + 'signup',{
      firstname: '@firstname',
      lastname:  '@lastname',
      email: '@email',
      password: '@password',
      selected_profession: '@selected_profession'
    });
    output.getproffesions = $resource(config.api + 'signup', null, {
      'update': { method: 'PUT'}
    });
    return output;
  }]);
