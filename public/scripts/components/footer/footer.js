/**
 * Created by mehrnaz on 12/29/16.
 */
angular.module('motekhasesanApp')
    .directive('pagefooter', function () {
        return {
            templateUrl: '../app/scripts/components/footer/footer.html',
            restrict: 'E'
        };
    });
