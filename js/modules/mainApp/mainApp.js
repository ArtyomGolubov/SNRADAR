/// <reference path="modules/mainApp/views/photoAll.html" />
var mainApp = angular.module('mainApp', ['ymaps', 'ngCookies']);

mainApp.config(function (ymapsConfig) {
    //ymapsConfig.fitMarkers = false;
    //включим кластеризацию
    ymapsConfig.clusterize = true;
    //нужно сменить preset у карты на специальный текстовый
    ymapsConfig.markerOptions.preset = 'islands#darkgreenStretchyIcon';
});




