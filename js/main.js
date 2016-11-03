var app = angular.module('MyApp', ['ymaps']);

app.config(function (ymapsConfig) {
    //ymapsConfig.fitMarkers = false;
    //включим кластеризацию
    ymapsConfig.clusterize = true;
    //нужно сменить preset у карты на специальный текстовый
    ymapsConfig.markerOptions.preset = 'islands#darkgreenStretchyIcon';
});

app.controller('MapCtrl', function ($scope, serviceSearchVk) {
    //создаем массив координат. При желании его можно загружать и с сервера,
    //подробнее об этом - в документации Angular
    $scope.markers = [];
    //настройки положения карты
    $scope.map = {
        center: [53.57, 37.13],
        zoom: 12
    };

    // жмем кнопку поиска
    $scope.searchVk = function () {
        console.log($scope.center);

        serviceSearchVk.search();
        $scope.markers = serviceSearchVk.markers;

        //$scope.$watch('text1', function () {

        //});
    }
});

app.service('serviceSearchVk', function () {
    var self = this;
    this.vkResult = null;
    this.markers = [];

    this.search = function () {
        console.log('serviceSearchVk');
        self.markers = [
            { coordinates: [54.46, 38.31], title: 'Пункт А' },
            { coordinates: [53.57, 37.13], title: 'Пункт Б' },
            { coordinates: [53.14, 37.59], title: 'Запасной пункт Б'}//,
        ];
    }
});