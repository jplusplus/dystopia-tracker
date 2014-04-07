angular.module('dystopia-tracker.services', ['ngResource','dystopia-tracker.filters', 'ngCookies']);
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
            '$httpProvider',
            function ($interpolateProvider, $locationProvider, $routeProvider,
                      $translateProvider, $httpProvider) {
                $httpProvider.interceptors.push('AuthHttpInterceptor');
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
                }).when('/:lang/submit/prediction', {
                    controller: 'SubmitPredictionCtrl',
                    templateUrl: '/partial/submit-prediction.html',
                    reloadOnSearch: false
                }).when('/:lang/submit/realisation', {
                    controller: 'SubmitRealisationCtrl',
                    templateUrl: '/partial/submit-realisation.html',
                    reloadOnSearch: false
                }).when('/:lang/thankyou', {
                    controller: 'ThankyouCtrl',
                    templateUrl: '/partial/thankyou.html',
                    reloadOnSearch: false
                }).otherwise({
                    redirectTo: '/E'
                });
            }]);