
var TimelineCtrl = function($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies, $timeout) {
    angular.extend(this, new HomeCtrl($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies, $timeout));

    $scope.changeLanguage = function(lang) {
        $scope._lang = $scope.language = lang;
        $location.path('/' + $scope.language + '/timeline');
        $scope.translateTo($scope.language);
        $scope.update(false);
    };
};

angular.module('dystopia-tracker').controller('TimelineCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$filter', '$cookies', '$timeout', TimelineCtrl]);

// it's the end of the code as we know it