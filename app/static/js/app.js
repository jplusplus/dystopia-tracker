angular.module('dystopia-tracker.services', ['ngResource','dystopia-tracker.filters']);
angular.module('dystopia-tracker.filters', []);

var app = angular.module('dystopia-tracker', [
        'ngRoute',
        'siyfion.sfTypeahead',
        'pascalprecht.translate',
        'slugifier',
        'dystopia-tracker.services']).config([
            '$interpolateProvider',
            '$locationProvider',
            '$routeProvider',
            '$translateProvider',
            function ($interpolateProvider, $locationProvider, $routeProvider,
                      $translateProvider) {
                $interpolateProvider.startSymbol('[[');
                $interpolateProvider.endSymbol(']]');

                $locationProvider.html5Mode(true);

                $translateProvider.useStaticFilesLoader({
                    prefix: '/static/locale/',
                    suffix: '.json'
                });
                $translateProvider.preferredLanguage('E');

                $routeProvider.when('/:lang', {
                    controller: 'HomeCtrl',
                    templateUrl: '/partial/home.html',
                    reloadOnSearch: false
                }).when('/:lang/p/:author/:title/:id', {
                    controller: 'DetailsCtrl',
                    templateUrl: '/partial/details.html',
                    reloadOnSearch: false
                }).otherwise({
                    redirectTo: '/E'
                });
            }]);