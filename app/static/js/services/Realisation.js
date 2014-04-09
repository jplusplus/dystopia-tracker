var a = angular.module('dystopia-tracker.services').service('Realisation', ['$http', function($http) {
    var service = function() { };
    service.baseUrl = '/api/realisations/';

    service.post = function(data) {
        return $http.post(this.baseUrl, data);
    };

    service.patch = function(data) {
        var id = data.id;
        delete data.id;
        return $http({
            url : service.baseUrl + id,
            method : 'PATCH',
            data : data
        });
    }

    return service;
}]);