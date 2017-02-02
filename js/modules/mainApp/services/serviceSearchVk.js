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
            groupsIds: new Array(),
        }
    };

    var self = this;

    function addRange(OldArr, NewArr) {
        var OldArrSize = OldArr.length;
        var NewArrSize = NewArr.length;

        for (var j = 0; j < NewArrSize; j++) {
            OldArr.push(NewArr[j]);
        }
        return OldArr;
    }

    function getUniqueItemsInNewArr(OldArr, NewArr) {
        var OldArrSize = OldArr.length;
        var NewArrSize = NewArr.length;
        var indexOfArr = [];

        for (var j = 0; j < NewArrSize; j++) {
            // look for same thing in new array
            if (OldArr.indexOf(NewArr[j]) == -1) {
                indexOfArr.push(NewArr[j]);
            }
        }
        return indexOfArr;
    }

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

            self.VKdata.users.length = 0;
            self.VKdata.groups.length = 0;
            self.VKdata.photos.length = 0;
            self.VKdata.photosTmp.length = 0;

            self.VKdata.ids.usersIds.length = 0;
            self.VKdata.ids.groupsIds.length = 0;

            //console.info('self.VKdata searchContinue: ', self.VKdata);
        }
        //console.info('self.VKdata search: ', self.VKdata);

        self.usersIds.length = 0;
        self.groupsIds.length = 0;

        self.users.length = 0;
        self.groups.length = 0;
        self.VKdata.photosTmp.length = 0;
        self.photos.length = 0;

        //console.info('self.counter: ', self.counter++);

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
            error: function (data) {
                console.warn('error data', data);
            },
            success: function (data) {
                //console.warn('success data', data);

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

                    //-------------------------------------- test
                    //setTimeout(function () {
                        $(".photo_in_result")
                        .on('load', function () { console.log("image loaded correctly"); })
                        .on('error', function () { console.log("error loading image"); });
                        //.attr("src", $(originalImage).attr("src"));
                    //}, 5000);
                    //--------------------------------------

                    self.photos = data.response.items;
                    console.log('data.response.count = ' + data.response.count);
                    console.log('data.response.items.length = ' + data.response.items.length);
                    self.VKdata.photos = self.VKdata.photos.concat(self.photos);

                    self.VKdata.photosTmp = self.photos;

                    if (self.photos.length > 0) {
                        self.VKdata.lastPhoto = self.photos[self.photos.length - 1];
                    }
                    self.VKdata.countPhotosVK = data.response.count;
                    self.VKdata.countPhotosRES = data.response.items.length;
                }

                for (i = 0; i < self.photos.length; i++) {
                    if (self.photos[i].owner_id > 0) {
                        self.usersIds.push(self.photos[i].owner_id);
                    } else {
                        self.groupsIds.push(Math.abs(self.photos[i].owner_id));
                    }
                }
                self.usersIds = getUniqueArr(self.usersIds);
                self.groupsIds = getUniqueArr(self.groupsIds);

                // фильтрую элементы, которых еще нет в основных массивах
                // (отбираю айдишники новых пользователей и новых групп)
                if (self.usersIds.length != 1) { // проверка для того чтобы был вызван succes, а также для определения конца поиска
                    self.usersIds = getUniqueItemsInNewArr(self.VKdata.ids.usersIds, self.usersIds);
                }
                if (self.groupsIds.length != 1) { // проверка для того чтобы был вызван succes, а также для определения конца поиска
                    self.groupsIds = getUniqueItemsInNewArr(self.VKdata.ids.groupsIds, self.groupsIds);
                }

                // добавляю айдишники новых пользователей и новых групп в основные массивы айдшников
                self.VKdata.ids.usersIds = addRange(self.VKdata.ids.usersIds, self.usersIds);
                self.VKdata.ids.groupsIds = addRange(self.VKdata.ids.groupsIds, self.groupsIds);
                //console.log('usersIds : ', usersIds);
                //console.log('groupsIds : ', groupsIds);

                var usersIdsSplitArr = [];
                var groupsIdsSplitArr = [];

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
                                fields: 'nickname,photo_max_orig,photo_50,screen_name,maiden_name',
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
                                packingPhotosInUsers(self.VKdata.users, self.photos);
                                packingUsersInPhotos(self.VKdata.photos, self.users);
                                if (self.groupsIds.length === 0) {
                                    succes(self.VKdata);
                                    ViewPhotoUsers(self.VKdata);
                                }
                                self.users.length = 0;
                            }
                        });
                    }
                }

                if (self.groupsIds.length > 0) {
                    // делим массив на части
                    // хз чего, но когда примерно groupsIds.length больше 100, то запрос не проходит
                    if (self.groupsIds.length > 100) {
                        groupsIdsSplitArr = chunkArray(self.groupsIds, 100);
                    }
                    else {
                        groupsIdsSplitArr = [self.groupsIds];
                    }

                    //console.log('groupsIdsSplitArr : ', groupsIdsSplitArr)

                    for (var j = 0; j < groupsIdsSplitArr.length; j++) {
                        $.ajax({
                            url: "https://api.vk.com/method/groups.getById",
                            data: {
                                group_ids: groupsIdsSplitArr[j],
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
                                packingPhotosInGroups(self.VKdata.groups, self.photos);
                                packingGroupsInPhotos(self.VKdata.photos, self.groups);
                                succes(self.VKdata);
                                ViewPhotoUsers(self.VKdata);
                                ViewPhotoGroups(self.VKdata);
                                self.groups.length = 0;
                            }
                        });
                    }
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
