/// <reference path="modules/mainApp/views/photoAll.html" />
var mainApp = angular.module('mainApp', ['ymaps', 'ngCookies']);

mainApp.config(function (ymapsConfig) {
    //ymapsConfig.fitMarkers = false;
    //включим кластеризацию
    ymapsConfig.clusterize = true;
    //нужно сменить preset у карты на специальный текстовый
    ymapsConfig.markerOptions.preset = 'islands#darkgreenStretchyIcon';
});

mainApp.controller('MapCtrl', function ($scope, $cookies, $timeout, ymapsLoader, serviceSearchVk) {


    // cookies --------------------
    // вынимаем куки
    var cookeis = $cookies.getObject('mapConfig');

    if (cookeis)
    {
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
                    console.log($scope.dateEnd);
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
        users: [{ first_name: 'dsdsd', last_name: 'mama', photos: [] }, { first_name: 'gggg', last_name: 'papa', photos: [] }],
        groups: [],
        photos: []
    };
    
    $scope.$watch('resultList', function () {
        // нихрена не обновляет без таймаута
        //setTimeout(function () {
            $scope.$applyAsync(function () {
                console.log('resultList update', $scope.resultList.photos.length);
                if (($scope.resultList.photos !== undefined) && $scope.resultList.photos.length > 0) {
                    $scope.searchVkCont = true;

                    $scope.countOfPhotos = $scope.resultList.photos.length;
                    $scope.countOfUsers = $scope.resultList.users.length;
                    $scope.countOfGroups = $scope.resultList.groups.length;
                    console.log('$scope.resultList.lastPhoto.date', $scope.resultList.lastPhoto.date);
                    $scope.lastPhoto = $scope.resultList.lastPhoto;
                }
                else {
                    $scope.searchVkCont = false;
                }
            });
        //}, 2000);
    }, true);

    $scope.searchLoading = false;
    $scope.searchCounter = 0;
    $scope.photoTmpFirst = {};

    // жмем кнопку поиска
    $scope.searchVk = function () {
        console.info('------------ searchVk------------');
        $scope.searchLoading = true;
        $scope.searchCounter = 0;

        //$scope.dateTmp = Date.parse($("#datetimepicker1").find('input').eq(0).val()) / 1000;
        var dateStart = Date.parse($("#datetimepicker1").find('input').eq(0).val()) / 1000;
        var dateEnd = Date.parse($("#datetimepicker2").find('input').eq(0).val()) / 1000;

        console.info('dateStart: ', new Date(dateStart * 1000));
        console.info('dateEnd: ', new Date(dateEnd * 1000));

        $scope.response = serviceSearchVk.GetPhotos2({
            searchContinue: 0,
            count: 200,
            offset: 0,
            start_time: dateStart,
            end_time: dateEnd,
            lat: $scope.circleProp.coords[0],
            long: $scope.circleProp.coords[1],
            radius: $scope.radiuses[$scope.circleProp.radius].value
        }, function (res) {
            console.log('pista: ', res);
            $scope.searchLoading = false;
            $scope.$apply(function () {
                $scope.resultList = serviceSearchVk.VKdata;
                console.log('result: ', $scope.resultList);
            });
        });
    }

    // жмем кнопку продолжения поиска
    $scope.searchVkContinue = function () {
        console.info('------------ searchVkContinue------------');
        $scope.searchLoading = true;
        $scope.searchCounter++;

        $scope.dateTmp = moment($scope.resultList.lastPhoto.date * 1000).format('YYYY-MM-DD  HH:mm:ss');
        var dateStart = Date.parse($("#datetimepicker1").find('input').eq(0).val()) / 1000;
        var dateEnd = $scope.resultList.lastPhoto.date;

        console.info('dateStart: ', new Date(dateStart * 1000));
        console.info('dateEnd: ', new Date(dateEnd * 1000));

        $scope.response = serviceSearchVk.GetPhotos2({
            searchContinue: 1,
            count: 200,
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
                console.log('result: ', $scope.resultList);
            });
        });
    }
    //----------------- Жмем на фото -------------------//
    $scope.photoModal = function ($event, photo) {
        //console.log(angular.element($event.target));
        var elem = angular.element($event.target);
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
});

mainApp.service('serviceSearchVk', function () {

    /// counter
    this.counter = 0;

    this.usersIds = [];
    this.groupsIds = [];

    this.users = [];
    this.groups = [];
    this.photos = [];

    this.VKdata = {
        lastPhoto: {},
        users: new Array(),
        groups: new Array(),
        photos: new Array(),
        photosTmp: new Array(),
        ids: {
            usersIds: new Array(),
            groupsIds: new Array()
        }
    };

    var self = this;

    getUniqueArr = function (arr) {
        var i = 0,
        current,
        length = arr.length,
        unique = [];
        for (; i < length; i++) {
            current = arr[i];
            if (!~unique.indexOf(current)) {
                unique.push(current);
            }
        }
        return unique;
    };

    function packingPhotosInUsers(users, photos) {
        var i, k;
        for (i = 0; i < users.length; i++) {
            users[i].photos = [];
            for (k = 0; k < photos.length; k++) {
                if (photos[k].owner_id == users[i].id) {
                    users[i].photos.push(photos[k]);
                }
            }
        }
        //console.log(users);
        return users;
    }

    function packingPhotosInGroups(groups, photos) {
        var i, k;
        for (i = 0; i < groups.length; i++) {
            groups[i].photos = [];
            for (k = 0; k < photos.length; k++) {
                if (Math.abs(photos[k].owner_id) === groups[i].id) {
                    groups[i].photos.push(photos[k]);
                }
            }
        }
        //console.log(groups);
        return groups;
    }

    function packingUsersInPhotos(photos, users) {
        var i, k;
        for (i = 0; i < photos.length; i++) {
            if (photos[i].owner_id > 0) {
                for (k = 0; k < users.length; k++) {
                    if (photos[i].owner_id == users[k].id) {
                        photos[i].user = users[k];
                        photos[i].group = null;
                    }
                }
            }
        }
    }

    function packingGroupsInPhotos(photos, groups) {
        var i, k;
        for (i = 0; i < photos.length; i++) {
            if (photos[i].owner_id < 0) {
                for (k = 0; k < groups.length; k++) {
                    if (Math.abs(photos[i].owner_id) == groups[k].id) {
                        photos[i].group = groups[k];
                        photos[i].user = null;
                    }
                }
            }
        }
    }

    // разбивка массива на части
    function chunkArray(arr, chunk) {
        var i, j, tmp = [];
        for (i = 0, j = arr.length; i < j; i += chunk) {
            tmp.push(arr.slice(i, i + chunk));
        }
        return tmp;
    }

    // --------- GetOhotos2 ---------------------
    // Использование публичных методов
    this.GetPhotos2 = function (parameters, succes, error) {
        if (parameters.searchContinue == 0) {
            
            self.VKdata = {
                users: [],
                groups: [],
                photos: []
            };
            console.info('self.VKdata searchContinue: ', self.VKdata);
        }
        console.info('self.VKdata search: ', self.VKdata);

        self.usersIds = [];
        self.groupsIds = [];

        self.users = [];
        self.groups = [];
        self.VKdata.photosTmp = [];

        console.info('self.counter: ', self.counter++);

        $.ajax({
            url: "https://api.vk.com/method/photos.search",
            data: {
                count: parameters.count,
                start_time: parameters.start_time,
                end_time: parameters.end_time,
                lat: parameters.lat,
                long: parameters.long,
                radius: parameters.radius,
                fields: 'owner_id,photo_130,date',
                v: "5.26",
            },
            dataType: "jsonp",
            error: function(data) {
                console.warn('error data', data);
            },
            success: function (data) {
                console.warn('success data', data);

                var i;

                if (!data || !data.response || !data.response.items) {
                    console.error("VK returned some crap 1:", data);
                    succes(self.VKdata);
                    return;
                }
                else {

                    if (data.response.items.length === 0) {
                        succes(self.VKdata);
                    }

                    self.VKdata.photosTmp = data.response.items;
                    console.log('data.response.count = ' + data.response.count);
                    console.log('data.response.items.length = ' + data.response.items.length);
                    self.VKdata.photos = self.VKdata.photos.concat(self.VKdata.photosTmp);
                    //console.log(self.VKdata.photosTmp[self.VKdata.photosTmp.length - 1].date);
                    //console.log(self.VKdata);
                    if (self.VKdata.photosTmp.length > 0) {
                        self.VKdata.lastPhoto = self.VKdata.photosTmp[self.VKdata.photosTmp.length - 1];
                    }
                    self.VKdata.countPhotosVK = data.response.count;
                    self.VKdata.countPhotosRES = data.response.items.length;
                }
                for (i = 0; i < data.response.items.length; i++) {
                    if (data.response.items[i].owner_id > 0) {
                        self.usersIds.push(data.response.items[i].owner_id);
                    } else {
                        self.groupsIds.push(Math.abs(data.response.items[i].owner_id));
                    }
                }
                self.usersIds = getUniqueArr(self.usersIds);
                self.groupsIds = getUniqueArr(self.groupsIds);
                //console.log('usersIds : ', usersIds);
                //console.log('groupsIds : ', groupsIds);

                var usersIdsSplitArr = [];
                if (self.usersIds.length > 0) {
                    // делим массив на части
                    // хз чего, но когда примерно usersIds.length больше 100, то запрос не проходит
                    if (self.usersIds.length > 100) {
                        usersIdsSplitArr = chunkArray(self.usersIds, 100);
                    }
                    else {
                        usersIdsSplitArr = [self.usersIds];
                    }

                    //console.log('usersIdsSplitArr : ', usersIdsSplitArr)

                    for (var j = 0; j < usersIdsSplitArr.length; j++) {
                        $.ajax({
                            url: "https://api.vk.com/method/users.get",
                            data: {
                                user_ids: usersIdsSplitArr[j],
                                fields: 'nickname,photo_max_orig,screen_name,maiden_name',
                                v: "5.26",
                            },
                            dataType: "jsonp",
                            success: function (data) {
                                var i;

                                if (!data || !data.response) {
                                    console.error("VK returned some crap 2:", data);
                                    return;
                                }
                                for (i = 0; i < data.response.length; i++) {
                                    self.users.push(data.response[i]);
                                }
                                self.VKdata.users = self.VKdata.users.concat(self.users);
                                //packingPhotosInUsers(self.VKdata.users, self.VKdata.photosTmp);
                                packingUsersInPhotos(self.VKdata.photosTmp, self.VKdata.users);
                                if (self.groupsIds.length === 0) {
                                    succes(self.VKdata);
                                }
                                self.users = [];
                            }
                        });
                    }
                }

                if (self.groupsIds.length > 0) {
                    $.ajax({
                        url: "https://api.vk.com/method/groups.getById",
                        data: {
                            group_ids: self.groupsIds,
                            fields: 'description',
                            v: "5.26",
                        },
                        dataType: "jsonp",
                        success: function (data) {
                            var i;

                            if (!data || !data.response) {
                                console.error("VK returned some crap 3:", data);
                                return;
                            }
                            for (i = 0; i < data.response.length; i++) {
                                self.groups.push(data.response[i]);
                            }
                            self.VKdata.groups = self.VKdata.groups.concat(self.groups);
                            //packingPhotosInGroups(self.VKdata.groups, self.VKdata.photosTmp);
                            packingGroupsInPhotos(self.VKdata.photosTmp, self.VKdata.groups);
                            succes(self.VKdata);
                            self.groups = [];
                        }
                    });
                }
            }
        });

        //return self.VKdata;
    }

    // --------- GetPhotos4 ------------------
    // получаем первые 3000 фотографий. Реально это предел при использовании execute
    // ВАЖНО!!! Работает только при авторизации приложения!
    this.GetPhotos4 = function (parameters, succes) {
        // обнуляем коллекцию
        VKdata = {
            users: [],
            groups: [],
            photos: [],
            ids: {
                usersIds: [],
                groupsIds: []
            }
        };

        var code = 'var inc = 0;'
            + 'var part = 25;'
            + 'var offset = ' + parameters.offset + ';'
            + 'var StartTime = ' + parameters.start_time + ';'
            + 'var EndTime = ' + parameters.end_time + ';'
            + 'var ResultArray = [];'
            + 'var Radius = ' + parameters.radius + ';'
            + 'while (inc < part) {'
            + 'var a = API.photos.search({ "offset": offset, "count": 1000, "start_time": StartTime, "end_time": EndTime, "lat": ' + parameters.lat + ', "long": ' + parameters.long + ', "radius": Radius, "v": "5.52" });'
            + 'var len = a.items.length;'
            + 'if (len < 2) inc = part;'
            + 'offset = offset + len;'
            + 'if (inc < part) ResultArray.push(a);'
            + 'inc = inc + 1;'
            + '}'
            + 'return ResultArray;';

        VK.Api.call("execute", { code: code }, function (data) {
            if (!data || !data.response) {
                console.error("VK returned some crap 1:", data);
                return;
            } else {
                for (var i = 0; i < data.response.length; i++) {
                    for (var k = 0; k < data.response[i].items.length; k++) {
                        VKdata.photos.push(data.response[i].items[k]);
                    }
                    VKdata.countPhotosVK += data.response[i].count;
                }

                //console.log("data:", data);

                if (VKdata.photos.length > 1) {

                    DateLastPhoto = VKdata.photos[VKdata.photos.length - 1].date;
                    //console.log("DateLastPhoto:", DateLastPhoto);

                    //console.log("VKdata.photos.length:", VKdata.photos.length);

                    GetUsersAndGroupsIds();
                    GetUsers(VKdata.ids, succes);

                    //succes(VKdata);
                } else {
                    //console.log("VKdata:", VKdata);
                    //console.log("Date last photo: ", String(new Date(DateLastPhoto * 1000)).substr(0, 25));
                    //succes(VKdata);
                    VKdata.photos = [];
                }
            }
        });
    }

    function GetUsersAndGroupsIds() {
        //console.log("GetUsersAndGroupsIds");
        //console.log("VKdata.photos[0].owner_id:", VKdata.photos[0].owner_id);
        for (var i = 0; i < VKdata.photos.length; i++) {
            if (VKdata.photos[i].owner_id > 0) {
                VKdata.ids.usersIds.push(VKdata.photos[i].owner_id);
                //console.log("VKdata.ids for user:", VKdata.photos[i].owner_id);
            } else {
                VKdata.ids.groupsIds.push(Math.abs(VKdata.photos[i].owner_id));
                //console.log("VKdata.ids for group:", VKdata.photos[i].owner_id);
            }
        }
        //console.log("VKdata.ids:", VKdata.ids);
        VKdata.ids.usersIds = getUniqueArr(VKdata.ids.usersIds);
        VKdata.ids.groupsIds = getUniqueArr(VKdata.ids.groupsIds);
    }

    function GetUsers(parameters, succes) {
        //console.log("GetUsers");
        //console.log("parameters", parameters);
        var code = 'var inc = 0;'
            + 'var part = 25;'
            + 'var offset = 0;'
            + 'var ids = "' + parameters.usersIds + '";'
            + 'var ResultArray = [];'
            //+ 'while(inc < part)'
            //+ '{'
            + 'var a = API.users.get({"offset": offset, "user_ids": ids, "fields": "nickname,photo_max_orig,screen_name,maiden_name", "v": "5.52"});'
            //+ 'var len = a.length;'
            //+ 'if(len == ids.length) inc = part;'
            //+ 'offset = offset + 500;'
            + 'ResultArray.push(a);'
            //+ 'inc = inc + 1;'
            //+ '}'
            + 'return ResultArray;';
        if (parameters.usersIds.length > 0) {
            VK.Api.call("execute", { code: code }, function (data) {
                if (!data || !data.response) {
                    console.error("VK returned some crap execute GetUsers:", data);
                    return;
                } else {
                    for (var i = 0; i < data.response.length; i++) {
                        for (var k = 0; k < data.response[i].length; k++) {
                            VKdata.users.push(data.response[i][k]);
                        }
                    }
                    //usersReady = true;
                    packingPhotosInUsers(VKdata.users, VKdata.photos);
                    //console.log("VKdata:", VKdata);
                    succes(VKdata);
                }
            });
        }
    }
});


// --- simple functions ----------------
// ------------ call me -----------------------
$(document).ready(function () { // вся мaгия пoсле зaгрузки стрaницы
    //$('.photo_in_result').click(function (event) { // лoвим клик пo ссылки с id="go"
    //    event.preventDefault(); // выключaем стaндaртную рoль элементa
    //    $('#overlay').fadeIn(200, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
	//	 	function () { // пoсле выпoлнения предъидущей aнимaции
	//	 	    $('#call_me')
	//				.css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
	//				.animate({ opacity: 1 }, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
	//	 	});
    //});
    /* Зaкрытие мoдaльнoгo oкнa, тут делaем тo же сaмoе нo в oбрaтнoм пoрядке */
    $('#overlay, .close_btn').click(function () { // лoвим клик пo крестику или пoдлoжке
        $('#photo_modal')
			.animate({ opacity: 0 }, 200,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
				function () { // пoсле aнимaции
				    $(this).css('display', 'none'); // делaем ему display: none;
				    $('.photo_discription_top').eq(0)
                        .animate({ opacity: 1, left: '210%' }, 200);
                        //.css('display', 'none');
				    $('#overlay').fadeOut(200); // скрывaем пoдлoжку
				}
			)
            .attr('src', '');
    });
});


$(document).ready(function () {
    //Menu "Hamburger" Icon Animations
    $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function () {
        $(this).toggleClass('open');
    });

    // .menu_tooltip
    //presentation
    setTimeout(function () {
    $('.menu_tooltip').show('slow')
        .animate({ color: '#3A4141' }, 3500)
        .animate({ color: '#fff', backgroundColor: '#3A4141' }, 3500)
        .hide('slow');
    }, 3000);
    //---
    $('#search_opt').hover(function () {
        //setTimeout(function () {
            $('.menu_tooltip').fadeOut(200);
        //}, 1000);
    });

    $('#search_opt').mouseover(function () {
        //setTimeout(function () {
            $('.menu_tooltip').fadeIn(200);
        //}, 1000);
    });

    $('.menu_tooltip').click(function () {
        $('.menu_tooltip').queue("fx", []).hide('fast');
    });
});

