/**
 * Created by mehrnaz on 12/29/16.
 */
angular.module('motekhasesanApp')
    .directive('navbarSec', function () {
        return {
            templateUrl: 'views/navbarSec.html',
            controller: 'main',
            restrict: 'E'
        };
    });
