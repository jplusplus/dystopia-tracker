angular.module('dystopia-tracker.services').service('Prediction', ['$resource', function($resource) {
    return $resource('api/predictions/:id', {}, {
        query: {
            method: 'GET',
            params: {
                id: ''
            },
            isArray: true
        }
    });
}]);