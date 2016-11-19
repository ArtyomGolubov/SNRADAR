// --- simple functions ----------------

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


// Часть для плавного скроллинга и для навигационного меню.
(function ($) {
    console.log('function ($)');

    /*---------------------------------------------------- */
    /* Smooth Scrolling
    ------------------------------------------------------ */
    $('.smoothscroll').on('click', function (e) {
        console.log('Smooth Scrolling 0');
        e.preventDefault();
        console.log('Smooth Scrolling 1');

        var target = this.hash,
            $target = $(target);
        console.log(e.hash);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 80
        }, 800, 'swing', function () {
            window.location.hash = target;
        });
        console.log('Smooth Scrolling 2');
    });

    /*-----------------------------------------------------*/
    /* Navigation Menu
   ------------------------------------------------------ */
    var toggleButton = $('.menu-toggle'),
        nav = $('.main-navigation');

    // toggle button
    toggleButton.on('click', function (e) {

        e.preventDefault();
        toggleButton.toggleClass('is-clicked');
        nav.slideToggle();

    });

    // nav items
    nav.find('li a').on("click", function () {

        // update the toggle button 		
        toggleButton.toggleClass('is-clicked');
        // fadeout the navigation panel
        nav.fadeOut();

    });


    /*---------------------------------------------------- */
    /* Highlight the current section in the navigation bar
  	------------------------------------------------------ */
    var sections = $("section"),
	navigation_links = $("#main-nav-wrap li a");


    sections.waypoint({

        handler: function (direction) {
            //console.log('Highlight the current section in the navigation bar');
            var active_section;

            active_section = $('section#' + this.element.id);

            if (direction === "up") active_section = active_section.prev();

            var active_link = $('#main-nav-wrap a[href="#' + active_section.attr("id") + '"]');

            navigation_links.parent().removeClass("current");
            active_link.parent().addClass("current");
            //console.log(active_section);
        },

        offset: '25%'
    });

    /*----------------------------------------------------- */
    /* Back to top
   ------------------------------------------------------- */
    var pxShow = 300; // height on which the button will show
    var fadeInTime = 400; // how slow/fast you want the button to show
    var fadeOutTime = 400; // how slow/fast you want the button to hide
    var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

    // Show or hide the sticky footer button
    jQuery(window).scroll(function () {

        if (!($("#header-search").hasClass('is-visible'))) {

            if (jQuery(window).scrollTop() >= pxShow) {
                jQuery("#go-top").fadeIn(fadeInTime);
            } else {
                jQuery("#go-top").fadeOut(fadeOutTime);
            }

        }

    });
})(jQuery);


function modalPhoto(event) {
    console.log('photo : ', event.data.photo);
    var photo = event.data.photo;
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

            var photoDate = $('.photo_date .date');
            photoDate.text(moment(photo.date * 1000).format('YYYY-MM-DD  HH:mm:ss')); // формат даты!

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
                    var img = $('<img>').attr('src', VKdata.photosTmp[i].photo_130)
                    .on('click', { photo: VKdata.photosTmp[i] }, modalPhoto); // эту строку надо запомнить :)
                    divPhotos.append(img);
                    userFinded = true;
                }
            });
            // если такого пользователя еще нет, то добавляем его в разметку
            if (!userFinded) {
                var ownerId = VKdata.photosTmp[i].owner_id;
                var a = $('<a>').attr('href', 'https://vk.com/id' + ownerId)
                .attr('target', '_blank');
                var divUser = $('<div>').addClass('user_div').attr('id', ownerId);
                var divAvatar = $('<div>').addClass('user_avatar_div');
                divPhotos = $('<div>').addClass('user_photos');
                for (var k = 0; k < VKdata.users.length; k++) {
                    if (VKdata.users[k].id === ownerId) {

                        img = $('<img>').attr('src', VKdata.users[k].photo_50);
                        divAvatar.append(img);

                        var span = $('<div>').text(VKdata.users[k].first_name);
                        divAvatar.append(span);
                        span = $('<div>').text(VKdata.users[k].last_name);
                        divAvatar.append(span);

                        a.append(divAvatar);
                        divUser.append(a);

                        img = $('<img>').attr('src', VKdata.photosTmp[i].photo_130)
                        .on('click', { photo: VKdata.photosTmp[i] }, modalPhoto); // эту строку надо запомнить :)
                        divPhotos.append(img);
                        divUser.append(divPhotos);

                        div.append(divUser);
                    }
                }
            }
        }
    }, 3000);
}

