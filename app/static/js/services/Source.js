angular.module('dystopia-tracker.services').service('Sources', ['$resource', function($resource) {
    return $resource('api/sources/:id', {}, {
        query: {
            method: 'GET',
            params: {
                id: ''
            },
            isArray: true
        }
    });
}]);