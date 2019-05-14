/**
 * Created by mehrnaz on 12/29/16.
 */
angular.module('motekhasesanApp')
    .directive('pagefooter', function () {
        return {
            templateUrl: 'views/footer.html',
            restrict: 'E'
        };
    });
