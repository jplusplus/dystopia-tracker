var a = angular.module('dystopia-tracker.services').service('Prediction', ['$http', function($http) {
    var service = function() { };
    service.baseUrl = '/api/predictions/';

    service.get = function(params) {
        params = params || {};
        var url = this.baseUrl;
        var paramString = '';
        if (params.id != null) {
            url += String(params.id) + '/'
            delete params.id;
        }
        for (var key in params) if (params.hasOwnProperty(key)) {
            if (params[key] != null && params[key] != '') {
                var sep = (paramString === '') ? '?' : '&';
                paramString += sep + key + '=' + params[key];
            }
        }
        return $http.get(url + paramString);
    }

    service.post = function(data) {
        return $http.post(this.baseUrl, data);
    }
    
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