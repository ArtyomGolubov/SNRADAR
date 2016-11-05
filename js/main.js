var app = angular.module('MyApp', ['ymaps', 'ngCookies']);

app.config(function (ymapsConfig) {
    //ymapsConfig.fitMarkers = false;
    //включим кластеризацию
    ymapsConfig.clusterize = true;
    //нужно сменить preset у карты на специальный текстовый
    ymapsConfig.markerOptions.preset = 'islands#darkgreenStretchyIcon';
});

app.controller('MapCtrl', function ($scope, $cookies, ymapsLoader, serviceSearchVk) {


    // cookies --------------------
    // вынимаем куки
    var cookeis = $cookies.getObject('mapConfig');

    if (cookeis)
    {
        console.log(cookeis);
        $scope.map = cookeis.map;
        $scope.circleProp = cookeis.circle;
        console.log($scope.map);
        console.log($scope.circleProp);
    }
    else {
        console.log('cookie mapConfig is not have');
        cookeis = {
            map: {
                center: [46.48, 30.71],
                zoom: 12
            },
            circle: {
                // Координаты центра круга.
                coords: [46.48, 30.71],
                // Радиус круга в метрах.
                radius: 800
            }
        }
        $scope.map = cookeis.map;
        $scope.circleProp = cookeis.circle;
    }

    // пишем куки
    $scope.$watch('map', function () {
        $cookies.putObject('mapConfig', cookeis);
    }, true);
    $scope.$watch('circleProp', function () {
        $cookies.putObject('mapConfig', cookeis);
    }, true);
    //-----------------------------

    //создаем массив координат. При желании его можно загружать и с сервера,
    //подробнее об этом - в документации Angular
    $scope.markers = [];

    //настройки положения карты
    if (!cookeis) {
        $scope.map = {
            center: [53.57, 37.13],
            zoom: 12
        };
    }

    //---- Начало блока кода для добавления и работы круга ----
    // свойства круга.
    if (!cookeis) {
        $scope.circleProp = {
            // Координаты центра круга.
            coords: [53.57, 37.13],
            // Радиус круга в метрах.
            radius: 800
        }
    }

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
        $scope.circleProp.radius = $scope.radiuses[$scope.circleIndex].value;
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
            fillColor: "#3a4141",
            fillOpacity: 0.5,
            // Цвет обводки.
            strokeColor: "#3a4141",
            // Прозрачность обводки.
            strokeOpacity: 0.8,
            // Ширина обводки в пикселях.
            strokeWidth: 3
        });

        $scope.myCircle.events.add('dragend', function (e) {
            // Получение ссылки на объект, который был передвинут.
            var thisPlacemark = e.get('target');

            // Определение координат объекта
            $scope.$applyAsync(function () {
                $scope.circleProp.coords = thisPlacemark.geometry.getCoordinates();
                console.log($scope.circleProp.coords);
            });
            // и вывод их при щелчке на объект (метка/круг)
            //thisPlacemark.properties.set('balloonContent', coords);
        });

        //Без setTimeout срабатывает раньше инициализации карты
        setTimeout(function () {
            ymapsLoader.map.geoObjects.add($scope.myCircle);
        }, 0);

        //$scope.$watch('circleGeometry.radius', function () {
        //    $scope.$applyAsync(function () {
        //        $scope.myCircle.geometry.setRadius(serviceForYmapsCircle.properties.radius);
        //    });
        //});
        //$scope.$watch('circleGeometry.coords', function () {
        //    $scope.$applyAsync(function () {
        //        $scope.myCircle.geometry.setCoordinates(serviceForYmapsCircle.properties.coords);
        //    });
        //});
        //-------------------
        /// ----  конец блока для добавления и работы с кругом ------

        //console.log($cookies.get('myFavorite'));
        //// Retrieving a cookie
        //var favoriteCookie = $cookies.get('myFavorite');
        //// Setting a cookie
        //$cookies.put('myFavorite', 'oatmeal');
    });
    

    // жмем кнопку поиска
    $scope.searchVk = function () {
        console.log($scope.center);
        console.log(ymapsLoader.map);
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