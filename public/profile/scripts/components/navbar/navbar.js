/**
 * Created by mehrnaz on 12/29/16.
 */
angular.module('motekhasesanApp')
    .directive('navbar', function () {
        return {
            templateUrl: 'views/navbar.html',
            restrict: 'E'
        };
    });
