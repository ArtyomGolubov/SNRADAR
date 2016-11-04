var app = angular.module('MyApp', ['ymaps']);

app.config(function (ymapsConfig) {
    //ymapsConfig.fitMarkers = false;
    //включим кластеризацию
    ymapsConfig.clusterize = true;
    //нужно сменить preset у карты на специальный текстовый
    ymapsConfig.markerOptions.preset = 'islands#darkgreenStretchyIcon';
});

app.controller('MapCtrl', function ($scope, ymapsLoader, serviceSearchVk, serviceForYmapsCircle) {
    //console.log(serviceForYmapsCircle);

    //создаем массив координат. При желании его можно загружать и с сервера,
    //подробнее об этом - в документации Angular
    $scope.markers = [];

    //настройки положения карты
    $scope.map = {
        center: [53.57, 37.13],
        zoom: 12
    };

    //---- Начало блока кода для добавления и работы круга ----
    // свойства круга.
    $scope.circleProp = serviceForYmapsCircle.properties;

    $scope.radiuses = [
        { id: 0, value: 10, name: '10 метров' },
        { id: 1, value: 100, name: '100 метров' },
        { id: 2, value: 800, name: '800 метров' },
        { id: 3, value: 6000, name: '6000 метров' },
        { id: 4, value: 50000, name: '50000 метров' }
    ];

    $scope.selectRadius = function () {
        $scope.myCircle.geometry.setRadius($scope.radiuses[$scope.circleIndex].value);
        $scope.myCircle.properties.set("balloonContent", "Радиус круга - " + $scope.radiuses[$scope.circleIndex].name);
    }
    
    ymapsLoader.ready(function (ymaps) {
        // Создаем круг.
        $scope.myCircle = new ymaps.Circle([
            // Координаты центра круга.
            $scope.circleProp.coords,
            // Радиус круга в метрах.
            $scope.circleProp.radius
        ], {
            // Описываем свойства круга.
            // Содержимое балуна.
            balloonContent: "Радиус круга - 10 км",
            // Содержимое хинта.
            hintContent: "Подвинь меня"
        }, {
            // Задаем опции круга.
            // Включаем возможность перетаскивания круга.
            draggable: true,
            // Цвет заливки.
            // Последний байт (77) определяет прозрачность.
            // Прозрачность заливки также можно задать используя опцию "fillOpacity".
            fillColor: "#DB709377",
            // Цвет обводки.
            strokeColor: "#990066",
            // Прозрачность обводки.
            strokeOpacity: 0.8,
            // Ширина обводки в пикселях.
            strokeWidth: 5
        });

        $scope.myCircle.events.add('dragend', function (e) {
            // Получение ссылки на объект, который был передвинут.
            var thisPlacemark = e.get('target');

            // Определение координат объекта
            $scope.$applyAsync(function () {
                serviceForYmapsCircle.properties.coords = thisPlacemark.geometry.getCoordinates();
                console.log(serviceForYmapsCircle.properties.coords);
            });
            // и вывод их при щелчке на объект (метка/круг)
            //thisPlacemark.properties.set('balloonContent', coords);
        });

        //Без setTimeout срабатывает раньше инициализации карты
        setTimeout(function () {
            serviceForYmapsCircle.map.geoObjects.add($scope.myCircle);
        }, 0);

        $scope.$watch('circleGeometry.radius', function () {
            $scope.$applyAsync(function () {
                $scope.myCircle.geometry.setRadius(serviceForYmapsCircle.properties.radius);
            });
        });
        $scope.$watch('circleGeometry.coords', function () {
            $scope.$applyAsync(function () {
                $scope.myCircle.geometry.setCoordinates(serviceForYmapsCircle.properties.coords);
            });
        });
        //-------------------
        /// ----  конец блока для добавления и работы с кругом ------
    });
    

    // жмем кнопку поиска
    $scope.searchVk = function () {
        console.log($scope.center);
        console.log(serviceForYmapsCircle.map);
        serviceSearchVk.search();
        //$scope.markers = serviceSearchVk.markers;
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