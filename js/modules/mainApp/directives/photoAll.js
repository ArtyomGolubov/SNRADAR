mainApp.directive('photoAll', function () {
    return {
        replace: false,
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch('resultList', function (newValue, oldValue) {
                element.html('');

                var divCountPhoto = angular.element('<div>');
                var divProgressPhoto = angular.element('<div>');
                divProgressPhoto.attr('id', 'countOfPhotos');
                element.append(divProgressPhoto);
                divCountPhoto.append(angular.element('<h4>').text('Количество фотографий = ' + newValue.countPhotosRES));
                element.append(divCountPhoto);

                for (var i = 0; i < newValue.photos.length; i++) {
                    var date = String(new Date(newValue.photos[i].date * 1000)).substr(0, 25);
                    var a = angular.element('<a>');
                    a.attr('href', newValue.photos[i].photo_604).attr('target', "_blank");
                    a.append(angular.element('<img>').attr('src', newValue.photos[i].photo_75).css('height', '75px'))
                        .attr('title', 'Дата : ' + date);
                    element.append(a);
                }
            });
        },

        templateUrl: 'modules/mainApp/views/photoAll.html' 
    }
});