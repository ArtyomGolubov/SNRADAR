mainApp.controller('MapCtrl', ['$scope', '$cookies', '$timeout', '$filter', 'ymapsLoader', 'serviceSearchVk', function ($scope, $cookies, $timeout, $filter, ymapsLoader, serviceSearchVk) {


    // cookies --------------------
    // получаем дату
    var now = new Date(),
    // this will set the expiration to 12 months
    exp = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

    $cookies.put('someToken', 'blabla', {
        expires: exp
    });
    // вынимаем куки
    var cookeis = $cookies.getObject('mapConfig');

    if (cookeis) {
        $scope.map = cookeis.map;
        $scope.circleProp = cookeis.circle;
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
                radius: 2
            }
        }
        $scope.map = cookeis.map;
        $scope.circleProp = cookeis.circle;
    }

    // пишем куки
    $scope.$watch('map', function () {
        $cookies.putObject('mapConfig', cookeis, {
            expires: exp
        });
    }, true);
    $scope.$watch('circleProp', function () {
        $cookies.putObject('mapConfig', cookeis, {
            expires: exp
        });
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
            radius: 2
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
        $scope.myCircle.geometry.setRadius($scope.radiuses[$scope.circleProp.radius].value);
        $scope.myCircle.properties.set("balloonContent", "Радиус круга - " + $scope.radiuses[$scope.circleProp.radius].name);
    }

    ymapsLoader.ready(function (ymaps) {
        // Создаем круг.
        $scope.myCircle = new ymaps.Circle([
            // Координаты центра круга.
            $scope.circleProp.coords,
            // Радиус круга в метрах.
            $scope.radiuses[$scope.circleProp.radius].value
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
            fillOpacity: 0.4,
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
                $scope.circleProp.coords[0] = $scope.circleProp.coords[0].toFixed(4);
                $scope.circleProp.coords[1] = $scope.circleProp.coords[1].toFixed(4);
                //console.log($scope.circleProp.coords);
            });
            // и вывод их при щелчке на объект (метка/круг)
            //thisPlacemark.properties.set('balloonContent', coords);
        });

        //Без setTimeout срабатывает раньше инициализации карты
        setTimeout(function () {
            ymapsLoader.map.geoObjects.add($scope.myCircle);
        }, 0);

        //-------------------
        /// ----  конец блока для добавления и работы с кругом ------
    });

    $scope.coordsVisible = true;

    // РАБОТА С ДАТОЙ --------------------------------------

    $scope.dateInit = function () {
        //Инициализация datetimepicker8 и datetimepicker9
        // без $timeout хрен работает
        $timeout(function () {

            $scope.dateStart = '';
            $scope.dateEnd = '';
            $scope.dateTmp = '';

            $scope.$watch('dateStart', function () {
                $scope.$applyAsync(function () {
                    console.log($scope.dateStart);
                });
            })

            console.log($scope.dateStart);

            $("#datetimepicker1").datetimepicker({
                locale: 'ru', defaultDate: new Date() - new Date(86400000), //new Date(2016, 1, 1, 00, 01),
                //sideBySide: true,
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down"
                }
            });
            $("#datetimepicker2").datetimepicker({
                locale: 'ru', defaultDate: new Date(),
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down"
                }
            });
            //При изменении даты в 1 datetimepicker, она устанавливается как минимальная для 2 datetimepicker
            $("#datetimepicker1").on("dp.change", function (e) {
                $("#datetimepicker2").datetimepicker({ MinDate: e.date });
            });
            //При изменении даты в 2 datetimepicker, она устанавливается как максимальная для 1 datetimepicker
            $("#datetimepicker2").on("dp.change", function (e) {
                $("#datetimepicker1").datetimepicker({ MaxDate: e.date });
            });

            //
            $scope.$applyAsync(function () {
                $scope.dateStart = $("#datetimepicker1 input").val();
                console.log($scope.dateStart);
                $scope.dateEnd = $("#datetimepicker2 input").val();
                //console.log($scope.dateEnd);
            });
        }, 1000);
    }

    // Привязка datepicker, ибо я уже заепался пытаться прикрутить через Angular
    jQuery(function ($) {
        $(document).mouseup(function (e) { // событие клика по веб-документу
            var div = $("#datetimepicker1 input, #datetimepicker2 input"); // тут указываем ID элемента
            if (!div.is(e.target) // если клик был не по нашему блоку
                && div.has(e.target).length === 0) { // и не по его дочерним элементам

                $scope.$applyAsync(function () {
                    if (div.is(("#datetimepicker1 input"))) {
                        $scope.dateStart = $("#datetimepicker1 input").val();
                        //console.log($scope.dateStart);
                    }
                    if (div.is(("#datetimepicker2 input"))) {
                        $scope.dateEnd = $("#datetimepicker2 input").val();
                        //console.log($scope.dateEnd);
                    }
                });
            }
        });
    });

    // КОНЕЦ С ДАТОЙ -------------------------------------------

    // работа с меню на карте
    $scope.menuInMapToggle = function () {
        var menu_btn = $('#menu_in_map');

        var menu = $('.search_opt_1.in_map').eq(0);
        if (menu.is(':hidden')) {
            menu_btn.css('border-top-left-radius', '0px');
            menu_btn.css('border-bottom-left-radius', '0px');
            menu.show(200);
        }
        else {
            menu_btn.css('border-top-left-radius', '3px');
            menu_btn.css('border-bottom-left-radius', '3px');
            menu.hide(200);
        }
    }
    //-----------------------

    ///////  ПОИСК ///////
    //---------------------------------------------------//

    $scope.resultList = {
        users: [],
        groups: [],
        photos: []
    };

    // <обновления>
    $scope.$watch('resultList.photos', function () {
        $scope.$applyAsync(function () {
            console.log('resultList.photos update', $scope.resultList.photos.length);
            if (($scope.resultList.photos !== undefined) && $scope.resultList.photos.length > 0) {
                $scope.searchVkCont = true;

                $scope.countOfPhotos = $scope.resultList.photos.length;

                //console.log('$scope.resultList.lastPhoto.date', $scope.resultList.lastPhoto.date);
                $scope.lastPhoto = $scope.resultList.lastPhoto;

                $scope.FirstAndLastPhotosDatesInPageInit();
            }
            else {
                $scope.searchVkCont = false;
            }
        });
    });

    $scope.$watch('resultList.users', function () {
        $scope.$applyAsync(function () {
            console.log('resultList.users update', $scope.resultList.users.length);
            $scope.countOfUsers = $scope.resultList.users.length;
        });
    });

    $scope.$watch('resultList.groups', function () {
        $scope.$applyAsync(function () {
            console.log('resultList.groups update', $scope.resultList.groups.length);
            $scope.countOfGroups = $scope.resultList.groups.length;
        });
    });

    $scope.$watch('currentPage', function () {
        $scope.FirstAndLastPhotosDatesInPageInit();
    });
    // </обновления>
    $scope.searchLoading = false;
    $scope.searchCounter = 0;
    $scope.photoTmpFirst = {};

    // жмем кнопку поиска
    $scope.searchVk = function () {
        console.info('------------ searchVk------------');

        // чистим блок найденных пользователей
        $('.photo_users, .photo_groups').children().remove().end().text($.trim($('#element_id').text()));

        $scope.searchLoading = true;
        $scope.searchCounter = 0;

        //$scope.dateTmp = Date.parse($("#datetimepicker1").find('input').eq(0).val()) / 1000;
        var dateStart = Date.parse($("#datetimepicker1").find('input').eq(0).val()) / 1000;
        var dateEnd = Date.parse($("#datetimepicker2").find('input').eq(0).val()) / 1000;

        console.info('dateStart: ', new Date(dateStart * 1000));
        console.info('dateEnd: ', new Date(dateEnd * 1000));

        $scope.response = serviceSearchVk.GetPhotos2({
            searchContinue: 0,
            count: 1000,
            offset: 0,
            start_time: dateStart,
            end_time: dateEnd,
            lat: $scope.circleProp.coords[0],
            long: $scope.circleProp.coords[1],
            radius: $scope.radiuses[$scope.circleProp.radius].value
        }, function (res) {
            $scope.searchLoading = false;
            $scope.$applyAsync(function () {
                $scope.resultList = serviceSearchVk.VKdata;
                console.log('result: ', $scope.resultList);
            });
        });
    }

    $scope.autoSearchTimeout = 20;
    $scope.autoSearch = false;
    //просто пиздец какой костыль
    $scope.autoSearchChanged = function () {
        $scope.autoSearch = !$scope.autoSearch;
        console.log('$scope.autoSearch = ', $scope.autoSearch)
    }

    // жмем кнопку продолжения поиска
    $scope.searchVkContinue = function () {
        console.info('------------ searchVkContinue------------');

        $scope.FirstAndLastPhotosDatesInPageInit();

        $scope.searchLoading = true;
        $scope.searchCounter++;

        $scope.dateTmp = moment($scope.resultList.lastPhoto.date * 1000).format('YYYY-MM-DD  HH:mm:ss');
        var dateStart = Date.parse($("#datetimepicker1").find('input').eq(0).val()) / 1000;
        var dateEnd = $scope.resultList.lastPhoto.date;

        //console.info('dateStart: ', new Date(dateStart * 1000));
        //console.info('dateEnd: ', new Date(dateEnd * 1000));

        $scope.response = serviceSearchVk.GetPhotos2({
            searchContinue: 1,
            count: 1000,
            offset: 0,
            start_time: dateStart,
            end_time: dateEnd,
            lat: $scope.circleProp.coords[0],
            long: $scope.circleProp.coords[1],
            radius: $scope.radiuses[$scope.circleProp.radius].value
        }, function (res) {
            $scope.searchLoading = false;
            $scope.$apply(function () {
                $scope.resultList = serviceSearchVk.VKdata;
                //console.log('result: ', $scope.resultList);
                // повторный, автоматический запрос, после истечения таймера
                if (serviceSearchVk.VKdata.photosTmp.length == 0) {
                    btnTimeout($('#search_continue'), 30, function() {
                        $scope.searchVkContinue();
                    });
                }
                else {
                    console.log($scope.autoSearch);
                    // чтобы получить вообще все фотки в афк режиме
                    if ($scope.autoSearch) {
                        setTimeout(function () {
                            
                            $scope.searchVkContinue();
                        }, $scope.autoSearchTimeout * 1000);
                    }
                }
            });
        });
    }
    //----------------- Жмем на фото -------------------//
    $scope.photoModal = function (photo) {
        console.info('counterErrorsForIMG = ', counterErrorsForIMG);
        //console.log(angular.element($event.target));
        //var elem = angular.element($event.target);
        var photoOrig = photo.photo_1280 || photo.photo_807 || photo.photo_604;
        var photoMax = photo.photo_2560 || photo.photo_1280 || photo.photo_807 || photo.photo_604;

        //this.preventDefault(); // выключaем стaндaртную рoль элементa
        $('#overlay').fadeIn(200, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
		 	function () { // пoсле выпoлнения предъидущей aнимaции

		 	    // Пишем имя хозяина фотографии и ссылку на его страницу
		 	    var photo_discription_top = $('.photo_discription_top').eq(0);
		 	    var owner_name = $('.owner_name').eq(0);
		 	    if (photo.user) {
		 	        owner_name.text(photo.user.first_name + ' ' + photo.user.last_name);
		 	        owner_name.attr('href', 'https://vk.com/id' + photo.user.id)
		 	    }
		 	    if (photo.group) {
		 	        owner_name.text(photo.group.name);
		 	        owner_name.attr('href', 'https://vk.com/public' + photo.group.id)
		 	    }
		 	    // Пишем дату фотографии
		 	    //var photo_date = $('.photo_date').eq(0);
		 	    //photo_date.text("Date: " + String(new Date(photo.date * 1000)).substr(0, 25));
		 	    $scope.$apply(function () {
		 	        $scope.photo_date = new Date(photo.date * 1000);
		 	    });

		 	    //показывпем блок с информацией
		 	    photo_discription_top.css('display', 'block')
		 	    .animate({ opacity: 1, left: '10%' }, 200, function () {
		 	        // добавляем ссылку на оригинальное фото в макс разрешении
		 	        $('#photo_orig_link').attr('href', photoMax);

		 	        //помещаем фото в #photo_modal и показываем его
		 	        $('#photo_modal')
                        .attr('src', photoOrig)
                        .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                        .animate({ opacity: 1 }, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
		 	    });
		 	});
    }

    // для пагинации общего списка фотографий
    //--- Для пагинации и поиска по фильтру ---//
    $scope.currentPage = 0;
    $scope.pageSize = 50;
    $scope.q = '';

    $scope.getData = function () {
        // needed for the pagination calc
        // https://docs.angularjs.org/api/ng/filter/filter
        // в эту функцию 100500 заходов. Хз должно ли столько быть
        //console.log('$scope.getData');

        //return $filter('filter')($scope.resultList.photos, $scope.q);;
        return $scope.resultList.photos; // без поиска по фильру эта вся фигня не нужна)
    }

    $scope.numberOfPages = function () {
        //return Math.ceil($scope.getData().length / $scope.pageSize);
        return Math.ceil($scope.resultList.photos.length / $scope.pageSize);
    }
    //--//

    $scope.firstPhotoInPageDate;
    $scope.lastPhotoInPageDate;

    $scope.FirstAndLastPhotosDatesInPageInit = function () {
        var currentPage = parseInt($scope.currentPage, 10);
        var pageSize = parseInt($scope.pageSize, 10);
        var firstPhotoInPage;
        var lastPhotoInPage;
        if (serviceSearchVk.VKdata.photosTmp.length > 0) {
            firstPhotoInPage = $scope.resultList.photos[currentPage * pageSize];
            if ((currentPage * pageSize + pageSize) < $scope.resultList.photos.length) {
                lastPhotoInPage = $scope.resultList.photos[currentPage * pageSize + pageSize];
            }
            else {
                lastPhotoInPage = $scope.resultList.photos[$scope.resultList.photos.length - 1];
            }
        }
        if (firstPhotoInPage != undefined)
            $scope.firstPhotoInPageDate = moment(firstPhotoInPage.date * 1000).format('YYYY-MM-DD  HH:mm:ss');
        if (lastPhotoInPage != undefined)
            $scope.lastPhotoInPageDate = moment(lastPhotoInPage.date * 1000).format('YYYY-MM-DD  HH:mm:ss');
    }
}]);
