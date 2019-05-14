/**
 * Created by hooman on 2/4/17.
 */
angular.module('motekhasesanApp').directive('compareTo',function()
{
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                // console.log(scope.otherModelValue);
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("password", function () {
                ngModel.$validate();
            });
        }
    };
});