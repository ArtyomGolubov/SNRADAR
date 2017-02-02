/// <reference path="modules/mainApp/views/photoAll.html" />
var mainApp = angular.module('mainApp', ['ymaps', 'ngCookies']);

mainApp.config(function (ymapsConfig) {
    //ymapsConfig.fitMarkers = false;
    //включим кластеризацию
    ymapsConfig.clusterize = true;
    //нужно сменить preset у карты на специальный текстовый
    ymapsConfig.markerOptions.preset = 'islands#darkgreenStretchyIcon';
});

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
// для пагинации списка пользователей
mainApp.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});





