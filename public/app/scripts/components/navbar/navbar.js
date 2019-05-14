/**
 * Created by mehrnaz on 12/29/16.
 */
angular.module('motekhasesanApp')
    .directive('navbar', function () {
        return {
            templateUrl: '../app/scripts/components/navbar/navbar.html',
            Controller: '../app/scripts/controllers/main.js',
            restrict: 'E'
        };
    });
