angular.module('dystopia-tracker.services', ['ngResource','dystopia-tracker.filters', 'ngCookies']);
angular.module('dystopia-tracker.filters', []);
angular.module('dystopia-tracker.animations', ['ngAnimate']);

var app = angular.module('dystopia-tracker', [
        'ngRoute',
        'dystopia-tracker.animations',
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

                var STATIC_URL = window.STATIC_URL || "/";
                $translateProvider.useStaticFilesLoader({
                    prefix: STATIC_URL + 'locale/',
                    suffix: '.json'
                });
                var defaultLang;
                if (navigator.language.indexOf("de") == 0) {
                    defaultLang = "D";
                }
                else {
                    defaultLang = "E";
                }; 
                $translateProvider.preferredLanguage(defaultLang);

                $routeProvider.when('/:lang', {
                    controller: 'HomeCtrl',
                    templateUrl: '/partial/home.html',
                    reloadOnSearch: false
                }).when('/:lang/p/:author/:title/:id', {
                    controller: 'DetailsCtrl',
                    templateUrl: '/partial/details.html',
                    reloadOnSearch: false
                }).when('/:lang/p//:title/:id', {
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
                }).when('/:lang/p/:author/:title/:id/embed', {
                    controller: 'EmbedCtrl',
                    templateUrl: '/partial/embed.html',
                    reloadOnSearch: false
                }).when('/:lang/timeline', {
                    controller: 'TimelineCtrl',
                    templateUrl: '/partial/timeline.html',
                    reloadOnSearch: false
                }).otherwise({
                    redirectTo: '/' + defaultLang
                });
            }]);