'use strict';

angular.module('blablacar',[
        'ngResource',
        'ui.router'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('index',{
                url:"/",
                templateUrl:'/views/start.html',
                controller:'UsersCtrl'
            })
            .state('login',{
                url:"/login",
                templateUrl:'/views/login.html',
                controller:'UsersCtrl'
            })
            .state('offer',{
                url:"/offer-seats",
                templateUrl:'/views/offer-seats.html',
                controller:'offerCtrl'
            })
            .state('find',{
                url:"/find-rides",
                templateUrl:'/views/find-rides.html',
                controller:'findCtrl'
            })
    }]);
