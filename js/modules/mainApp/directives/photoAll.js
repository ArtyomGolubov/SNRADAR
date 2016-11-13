
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
                var title = moment(scope.photo.date * 1000).format('YYYY-MM-DD  HH:mm:ss');
                element.attr('title', title);

                var div = $('<div>');
                
                if (scope.resultList.photos.length > 0) {
                    if (scope.searchCounter === 0) {
                        scope.dateTmp = scope.dateEnd;
                        scope.photoTmpFirst.photo_75 = scope.resultList.photos[0].photo_75;
                    }

                    // хрена лысого. .split_date_info_bottom остается, а .split_date_info_top смещается вниз.
                    // добавляем <div class="split_date_info_top"> с промежутком времени в начало ттекущей выборки фотографий
                    //if (scope.photoTmpFirst.photo_75 === scope.photo.photo_75) {
                    //    div.text(scope.dateTmp
                    //        + '  -  '
                    //        + moment(scope.resultList.lastPhoto.date * 1000).format('YYYY-MM-DD  HH:mm:ss')).addClass('split_date_info_top');
                    //    element.before(div);
                    //}

                    // добавляем <div class="split_date_info_bottom"> с промежутком времени в начало ттекущей выборки фотографий
                    if (scope.resultList.lastPhoto === scope.photo) {
                        div.text(scope.dateTmp
                            + '  -  '
                            + moment(scope.resultList.lastPhoto.date * 1000).format('YYYY-MM-DD  HH:mm:ss')).addClass('split_date_info_bottom');
                        element.after(div);

                        scope.photoTmpFirst.photo_75 = scope.resultList.lastPhoto.photo_75;
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