angular.module('dystopia-tracker.services').factory('AuthHttpInterceptor', [ '$q', '$cookies', function ($q, $cookies) {
    return {
        request: function(config) {
            config = config || $q.when(config);
            if ($cookies.csrftoken != null) {
                config.headers = config.headers || {};
                config.headers['X-CSRFToken'] = $cookies.csrftoken;
            }
            return config;
        }
    };
}]);