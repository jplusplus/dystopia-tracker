angular.module('dystopia-tracker.services', ['ngResource','dystopiaFilters']);

var app = angular.module('dystopia-tracker', [
        'ngRoute',
        'siyfion.sfTypeahead',
        'dystopia-tracker.services']).config([
            '$interpolateProvider',
            '$locationProvider',
            '$routeProvider',
            function ($interpolateProvider, $locationProvider, $routeProvider) {
                $interpolateProvider.startSymbol('[[');
                $interpolateProvider.endSymbol(']]');

                $locationProvider.html5Mode(true);

                $routeProvider.when('/', {
                    controller: 'HomeCtrl',
                    templateUrl: '/partial/home.html'});
            }]);