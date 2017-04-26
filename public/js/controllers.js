'use strict';

angular.module('blablacar')
    .controller('UsersCtrl', ['$rootScope', '$scope', '$http', '$location', 'users', function($rootScope, $scope, $http, $location, users){
         $http.get("users/test").then(function(res){
           console.log(res);
            if(res.data != "respond with a resource")
                $rootScope.user = res.data.local.email;
         });



        $scope.login = function () {
            users.login({
                email: $scope.email,
                password: $scope.password
            }).then(function (data) {
                // console.log(data);
                if(data.data.message == "No user found.") {
                    $scope.messageLogin = "No user found.";
                } else if (data.data.message == "Wrong password.") {
                    $scope.messageLogin = "Wrong password.";
                } else {
                    // console.log(data);
                    $rootScope.user = data.data.local.email;
                    $scope.messageLogin = "Login success"
                    $location.path('/');
                };
            })
        }

        $scope.register = function () {
            users.register({
                email: $scope.email,
                password: $scope.password
            }).then(function (data) {
                if(data.data.message == "That email is already in use.") {
                    $scope.messageRegister = "That email is already in use.";
                } else {
                    $rootScope.user = data.data.local.email;
                    // $scope.begin = "true";
                    $location.path('/');
                };
            })
        }
    }])
    .controller('offerCtrl', ['$rootScope', '$scope', '$http', '$location', 'users', function($rootScope, $scope, $http, $location){
        $http.get("users/test").then(function(res){
            // console.log(res.data);
            if(res.data != "respond with a resource")
                $rootScope.user = res.data.local.email;
         });

        $scope.offer = function(){
            if (confirm("Are you want to offer this ride?") == true) {
               var data = {
                    src: $scope.src,
                    des: $scope.des,
                    date: $scope.date,
                    price: $scope.price,
                    numOfSeat: $scope.numOfSeat,
                    owner: $rootScope.user
                }

                $http({
                    method: "POST",
                    url: "rides/offer",
                    data: data
                }).success(function (data) {
                    return data;
                }).error(function (err) {
                    alert("Unable to connect to the server.");
                });
                $location.path('/');
            } else {
                alert("I am an alert box!");
            }

        }

        var map;
        initialize();
        function initialize() {
            var autocompletesrc,autocompletedes;
            var lngSrc,latSrc,lngDes,latDes;

            map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 8,
                center: new google.maps.LatLng(21.027, 105.834)
            })

            autocompletesrc = new google.maps.places.Autocomplete(
                  /** @type {HTMLInputElement} */(document.getElementById('autocompletesrc')),
                  { types: ['geocode'] });
              google.maps.event.addListener(autocompletesrc, 'place_changed', function() {
                 var place = autocompletesrc.getPlace();
                 lngSrc = place.geometry.location.lng();
                 latSrc = place.geometry.location.lat();
                // console.log(lngSrc + " " +latSrc);
              });
              autocompletedes = new google.maps.places.Autocomplete(
                  /** @type {HTMLInputElement} */(document.getElementById('autocompletedes')),
                  { types: ['geocode'] });
              google.maps.event.addListener(autocompletedes, 'place_changed', function() {
                var place = autocompletedes.getPlace();
                 lngDes = place.geometry.location.lng();
                 latDes = place.geometry.location.lat();
                 drawPoint(lngSrc,latSrc,lngDes,latDes);
              });
        }

        function drawPoint(lngSrc,latSrc,lngDes,latDes){
            var pointA = new google.maps.LatLng(latSrc, lngSrc),
                pointB = new google.maps.LatLng(latDes, lngDes),
                myOptions = {
                    zoom: 8,
                    center: pointA
                },
                map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
                // Instantiate a directions service.
                directionsService = new google.maps.DirectionsService,
                directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map
                }),
                markerA = new google.maps.Marker({
                    position: pointA,
                    title: "point A",
                    label: "A",
                    map: map
                }),
                markerB = new google.maps.Marker({
                    position: pointB,
                    title: "point B",
                    label: "B",
                    map: map
                });
            // get route from A to B
            calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
            directionsService.route({
                origin: pointA,
                destination: pointB,
                avoidTolls: true,
                avoidHighways: false,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }

    }])
    .controller('findCtrl', ['$rootScope', '$scope', '$http', '$location', 'users', function($rootScope, $scope, $http, $location){
        $http.get("users/test").then(function(res){
            // console.log(res.data);
            if(res.data != "respond with a resource")
                $rootScope.user = res.data.local.email;
         });


        initialize();
        function initialize() {
            var autocompletesrc,autocompletedes;

            autocompletesrc = new google.maps.places.Autocomplete(
                  /** @type {HTMLInputElement} */(document.getElementById('autocompletesrc')),
                  { types: ['geocode'] });
              google.maps.event.addListener(autocompletesrc, 'place_changed', function() {
                 var place = autocompletesrc.getPlace();
              });
              autocompletedes = new google.maps.places.Autocomplete(
                  /** @type {HTMLInputElement} */(document.getElementById('autocompletedes')),
                  { types: ['geocode'] });
              google.maps.event.addListener(autocompletedes, 'place_changed', function() {
                var place = autocompletedes.getPlace();
              });
        }

        $scope.rides = [{
          "numOfSeat": 1,
          "price": 24,
          "date": "2016-12-30T17:00:00Z",
          "des": "Hà Nội, Việt Nam",
          "src": "Bắc Ninh, Việt Nam",
          "owner": {
            "name": "admin"
          }
        },{
          "numOfSeat": 1,
          "price": 24,
          "date": "2016-12-30T17:00:00Z",
          "des": "Hà Nội, Việt Nam",
          "src": "Bắc Ninh, Việt Nam",
          "owner": {
            "name": "admin"
          }
        },{
          "numOfSeat": 1,
          "price": 24,
          "date": "2016-12-30T17:00:00Z",
          "des": "Hà Nội, Việt Nam",
          "src": "Bắc Ninh, Việt Nam",
          "owner": {
            "name": "admin"
          }
        }];

        $scope.find = function(){
          $http.get("rides/find/"+$scope.src+"/"+$scope.des).then(function(res){
              $scope.rides = res.data;
              console.log(rides);
           });
        }

    }]);
