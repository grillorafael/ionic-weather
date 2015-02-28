(function() {
    angular.module('weather', ['ionic', 'ngCordova'])
        .run(function($ionicPlatform) {
            $ionicPlatform.ready(function() {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })
        .factory('Weather', function($q, $http) {
            var deferred = $q.defer();

            function getCurrentWeather(lat, lng) {
                var url = 'https://api.forecast.io/forecast/API_KEY/' + lat + ',' + lng + '?callback=JSON_CALLBACK';
                $http.jsonp(url)
                    .success(deferred.resolve)
                    .error(deferred.reject);

                return deferred.promise;
            }

            return {
                getCurrentWeather: getCurrentWeather
            };
        })
        .controller('WeatherCtrl', function($scope, $cordovaGeolocation, Weather) {
            $scope.loading = true;

            $scope.toCelsius = function(temperature) {
                return ((temperature - 32) / 1.8).toFixed(1);
            };

            $cordovaGeolocation
                .getCurrentPosition({
                    timeout: 10000,
                    enableHighAccuracy: false
                })
                .then(function(position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;

                    Weather.getCurrentWeather(lat, long).then(function(data) {
                        $scope.weatherInfo = data;
                        $scope.loading = false;
                    }, function(error) {
                        //TODO Display error message
                    });
                }, function(err) {
                    //TODO Display error message
                });
        });
})();
