var a = angular.module('dystopia-tracker.services').service('Realisation', ['$http', function($http) {
    var service = function() { };
    service.baseUrl = '/api/realisations/';

    service.post = function(data) {
        return $http.post(this.baseUrl, data);
    }

    return service;
}]);