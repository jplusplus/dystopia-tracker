app = (angular.module 'dystopia-tracker', ['ngRoute']).config [
    '$interpolateProvider'
    '$locationProvider'
    '$routeProvider'
    ($interpolateProvider, $locationProvider, $routeProvider) =>
        $interpolateProvider.startSymbol '[['
        $interpolateProvider.endSymbol   ']]'

        $locationProvider.html5Mode true

        $routeProvider
            .when '/',
                controller: 'HomeCtrl'
                templateUrl: '/partial/home.html'
]