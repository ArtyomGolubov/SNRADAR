mainApp.directive('photoUsers', function () {
    return {
        replace: true,
        restrict: 'AE',
        link: function (scope, element, attrs) {

        },

        templateUrl: "js/modules/mainApp/views/photoUsers.html"
    }
});

function ViewPhotoUsers(VKdata) {
    setTimeout(function () {
        console.log('ViewPhotoUsers ', VKdata);
        // блок со всемми юзерами
        var div = $('.photo_users').eq(0);

        console.log('ViewPhotoUsers ', div);
        // перебираем все новые фото
        for (var i = 0; i < VKdata.photosTmp.length; i++) {
            var userFinded = false;
            // перебираем всех имеющихся пользователей
            var divsUsers = $('.user_div').each(function (index, element) {
                // если такой юзер есть, то добавляем в разметку его фото
                if (VKdata.photosTmp[i].owner_id == $(element).attr('id')) {
                    var divPhotos = $(element).find('.user_photos').eq(0);
                    var img = $('<img>').attr('src', VKdata.photosTmp[i].photo_130);
                    divPhotos.append(img);
                    userFinded = true;
                }
            });
            // если такого пользователя еще нет, то добавляем его в разметку
            if (!userFinded) {
                var divUser = $('<div>').addClass('user_div').attr('id', VKdata.photosTmp[i].owner_id);
                var divAvatar = $('<div>').addClass('user_avatar_div');
                divPhotos = $('<div>').addClass('user_photos');
                for (var k = 0; k < VKdata.users.length; k++) {
                    if (VKdata.users[k].id === VKdata.photosTmp[i].owner_id) {
                        img = $('<img>').attr('src', VKdata.users[k].photo_max_orig);
                        divAvatar.append(img);
                        divUser.append(divAvatar);
                        img = $('<img>').attr('src', VKdata.photosTmp[i].photo_130);
                        divPhotos.append(img);
                        divUser.append(divPhotos);
                        div.append(divUser);
                    }
                }
            }
        }
    }, 3000);
}