angular.module('dystopia-tracker.filters').filter('getTranslated', ['$rootScope', function($rootScope) {
  return function(prediction, fieldname) {
    return prediction[fieldname + '_' + $rootScope._lang];
  };
}]);