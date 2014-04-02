var a = angular.module('dystopia-tracker.services').service('Sources', ['$http', function($http) {
    var service = function() { };
    service.baseUrl = '/api/sources/';

    service.get = function(params) {
        params = params || {};
        var url = this.baseUrl;
        var paramString = '';
        if (params.id != null) {
            url += String(params.id) + '/'
            delete params.id;
        }
        for (var key in params) if (params.hasOwnProperty(key)) {
            if (params[key] != null) {
                var sep = (paramString === '') ? '?' : '&';
                paramString += sep + key + '=' + params[key];
            }
        }
        return $http.get(url + paramString);
    }

    service.post = function(data) {
        return $http.post(this.baseUrl, data);
    }

    return service;
}]);