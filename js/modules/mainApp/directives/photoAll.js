
mainApp.directive('photoAll', function () {
    return {
        replace: false,
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
                var title = moment(scope.photo.date * 1000).format('YYYY-MM-DD  HH:mm:ss');
                element.attr('title', title);

                //console.log('---scope.photo.id = ' + scope.photo.id + 'scope.photo.photo_130 = ' + scope.photo.photo_130);

                var span = $('<div>');
                
                if (scope.resultList.photos.length > 0) {
                    if (scope.counter === 0) {
                        scope.dateTmp = scope.resultList.photos[0].date;
                        //span.text(moment(scope.dateTmp * 1000).format('YYYY-MM-DD HH:mm:ss') + ' - ' + title).addClass('split_span_date_info');
                    }
                    if (scope.resultList.photos[scope.resultList.photos.length - 1].photo_130 === scope.photo.photo_130) {
                        span.text(moment(scope.dateTmp * 1000).format('YYYY-MM-DD  HH:mm:ss') + '  -  ' + title).addClass('split_span_date_info');
                        //console.log('scope.photo.id = ' + scope.photo.id + 'scope.photo.photo_130 = ' + scope.photo.photo_130);
                        element.after(span);
                    }
                }
                //else {
                //    console.log('scope.resultList.photos.length = ', scope.resultList.photos.length);
                //}
            });
        },

        templateUrl: "js/modules/mainApp/views/photo.html"
        //template: '<img ng-model="photo" ng-src="{{photo.photo_130}}" class="photo_in_result" ng-click="photoModal($event, photo)" />'
    }
});