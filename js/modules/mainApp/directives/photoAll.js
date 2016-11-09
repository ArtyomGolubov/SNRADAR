
mainApp.directive('photoAll', function () {
    return {
        replace: true,
        restrict: 'AE',
        link: function (scope, element, attrs) {
            scope.$watch('resultList', function (newValue, oldValue) {

                console.log(element);
            });
        },

        templateUrl: "js/modules/mainApp/views/photoAll.html"
    }
})
.directive('imageInList', function () {
    return {
        replace: true,
        restrict: 'A',

        link: function (scope, element, attrs) {
            scope.$watch('resultList', function (newValue, oldValue) {
                // var title = moment(scope.photo.date * 1000).format('MMMM Do YYYY, h:mm:ss a')
                var title = moment(scope.photo.date * 1000).format('YYYY-MM-DD HH:mm:ss');
                element.attr('title', title);
            });
        },

        templateUrl: "js/modules/mainApp/views/photo.html"
        //template: '<img ng-model="photo" ng-src="{{photo.photo_130}}" class="photo_in_result" ng-click="photoModal($event, photo)" />'
    }
});