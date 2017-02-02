//var usersApp = angular.module('usersApp');

mainApp.directive('photoList', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: 'js/modules/mainApp/views/photoList.html',
        //scope: {
        //    user: '='
        //}
    }
});