  'use strict';

angular.module('blablacar')
    .controller('UsersCtrl', ['$rootScope', '$scope', '$http', '$location', 'users', function($rootScope, $scope, $http, $location, users){
         $http.get("users/test").then(function(res){
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
        $scope.detour = "NONE";
        $scope.flexibility = "ON_TIME";
        $scope.luggage = "Medium";
        $scope.numOfSeat = 0;
        $scope.offer = function(){
            var date = moment($scope.date).add($scope.hours, 'hours').add($scope.mins, 'minutes');
            if (confirm("Are you want to offer this ride?") == true) {
               var data = {
                    src: $scope.src,
                    des: $scope.des,
                    date: date,
                    price: $scope.price,
                    numOfSeat: $scope.numOfSeat,
                    owner: $rootScope.user,
                    note: $scope.note,
                    detour: $scope.detour,
                    flexibility: $scope.flexibility,
                    luggage: $scope.luggage
                }

                $http({
                    method: "POST",
                    url: "rides/offer",
                    data: data
                }).success(function (data) {
                    $location.path('/view/'+data._id);
                    return data;
                }).error(function (err) {
                    alert("Unable to connect to the server.");
                });
                // $location.path('/');
            } else {
                alert("Okay!");
            }

        }

        var map;
        // initialize();
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


        // initialize();
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

        $scope.rides = [];
        $scope.prices = [];
        var prices = [];
        $scope.hb = 0;
        $scope.he = 24;
        $scope.searched = false;
        $scope.find = function(){
          $http.get("rides/find/"+$scope.src+"/"+$scope.des).then(function(res){
              $scope.rides = res.data;
              var rides = [];
              for(var i = 0; i < $scope.rides.length; i++)
                if(moment().diff($scope.rides[i].date) < 0)
                  rides.push($scope.rides[i]);
              $scope.rides = rides;
              for(var i = 0; i < $scope.rides.length; i++){
                  prices.push($scope.rides[i].price);
                  $scope.rides[i].showdate = moment($scope.rides[i].date).format("HH:mm DD/MM/YYYY");
                }
              $scope.rides = rides;
              $scope.pmin = Math.min.apply(null, prices);
              $scope.pmax = Math.max.apply(null, prices);

              $scope.prices = [];
              for(var i = $scope.pmin; i <= $scope.pmax; i++)
                $scope.prices.push(i);
           });
           $scope.searched = true;
           console.log($scope.rides)
        }

        $scope.orderBy = function(x){
          $scope.myOrderBy = x;
        }

        $scope.filterFunction = function(ride){
          if(ride.price>=$scope.pmin && ride.price<=$scope.pmax){
             if($scope.date==undefined || moment(ride.date).isSame($scope.date, 'day'))
              if(moment(ride.date).hour() >= $scope.hb && moment(ride.date).hour() <= $scope.he )
                return true;
          }
          return false;
        }
    }])
    .controller('viewCtrl', ['$scope', '$http', '$location', '$stateParams', '$rootScope', function($scope, $http, $location, $stateParams, $rootScope){
      $http.get("rides/find/"+$stateParams.id).then(function(res){
          $scope.ride = res.data;
          $scope.ride.showdate = moment($scope.ride.date).format("HH:mm DD/MM/YYYY");
          console.log($scope.ride);
       });

      $scope.book = function(){
        if(!$rootScope.user){
          $location.path('/login');
        } else if ($rootScope.user == $scope.ride.owner.name){
          alert("You cannot book a ride you offer!!");

        } else if($scope.ride.numOfSeat < 1){
          alert("The seat is full!");
        } else if(confirm("Are you want to offer this ride?") == true){
          var data = {
               rideid: $stateParams.id,
               passenger: $rootScope.user
           }
           $http({
               method: "POST",
               url: "rides/book",
               data: data
           }).success(function (data) {

               return data;
           }).error(function (err) {
               alert("Unable to connect to the server.");
           });
          $location.path('/offered');
        }
      }
    }])
    .controller('offeredCtrl', ['$scope', '$http', '$location', '$stateParams', '$rootScope', function($scope, $http, $location, $stateParams, $rootScope){
      $scope.history = [];
      $scope.current = [];
      $http.get("users/offered/"+$rootScope.user).then(function(res){
          $scope.rides = res.data;
          for(var i = 0; i < $scope.rides.length; i++){
            $scope.rides[i].showdate = moment($scope.rides[i].date).format("HH:mm DD/MM/YYYY");
            if(moment().diff($scope.rides[i].date) > 0)
              $scope.history.push($scope.rides[i]);
            else
              $scope.current.push($scope.rides[i]);
          }
          $scope.rides = $scope.current;
       });
       $scope.filterFunction = function(x){
         if(x=='history')
          $scope.rides = $scope.history;
         else
           $scope.rides = $scope.current;

       }
    }])
    .controller('bookedCtrl', ['$scope', '$http', '$location', '$stateParams', '$rootScope', function($scope, $http, $location, $stateParams, $rootScope){
      $scope.history = [];
      $scope.current = [];
      $http.get("users/booked/"+$rootScope.user).then(function(res){
          $scope.rides = res.data;
          for(var i = 0; i < $scope.rides.length; i++){
            $scope.rides[i].showdate = moment($scope.rides[i].date).format("HH:mm DD/MM/YYYY");
            if(moment().diff($scope.rides[i].date) > 0)
              $scope.history.push($scope.rides[i]);
            else
              $scope.current.push($scope.rides[i]);
          }
          $scope.rides = $scope.current;
       });
       $scope.filterFunction = function(x){
         if(x=='history')
          $scope.rides = $scope.history;
         else
           $scope.rides = $scope.current;

       }
    }]);
