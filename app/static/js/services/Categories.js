angular.module('dystopia-tracker.services').service('Categories', ['$resource', function($resource) {
    return $resource('api/categories/:id', {}, {
        query: {
            method: 'GET',
            params: {
                id: ''
            },
            isArray: true
        }
    });
}]);