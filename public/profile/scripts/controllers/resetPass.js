/**
 * Created by hooman on 8/20/17.
 */

angular.module('motekhasesanApp')
    .controller('reset_password_ctrl',[ '$scope','$uibModalInstance','User', function ($scope, $uibModalInstance, User) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.UserphoneNumber = {
            mobile: ''
        };
        $scope.reset_done = false;
        $scope.reset_error = false;
        $scope.show_sigunUp = false;
        $scope.firstname_reset = '';
        $scope.resetPass2 = function () {
            User.resendPass.save({},JSON.stringify($scope.UserphoneNumber),function (res) {
                $scope.reset_done = true;
                $scope.reset_error = false;
                $scope.show_sigunUp = false;
                $scope.firstname_reset = res.firstname;
            },function (err) {
                $scope.reset_error = true;
                $scope.reset_done = false;
                if(err.status == 400){
                    $scope.reset_err_text =  'شما ثبت نام نکرده اید';
                    $scope.show_sigunUp =  true;
                }
                else{
                    $scope.reset_err_text = ' مشکلی به وجود آمده، مجددا تلاش کنید.'
                }
                console.log(err);
            })
        };
    }]);
