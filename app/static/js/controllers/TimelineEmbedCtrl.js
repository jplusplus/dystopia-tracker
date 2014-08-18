
var TimelineEmbedCtrl = function($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies, $timeout, FiltersReset) {
    $scope.filters = { page_size : 200 };
    angular.extend(this, new HomeCtrl($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies, $timeout, FiltersReset));

    $scope.changeLanguage = function(lang) {
        $scope._lang = $scope.language = lang;
        $location.path('/' + $scope.language + '/timeline/embed');
        $scope.translateTo($scope.language);
        $scope.update(false);
    };

    $scope.spinner = true;

    $scope.$watch(function() { return $scope.predictions }, function() {
        if ($scope.predictions.length > 0 && !$scope.hideMoreButton) {
            $scope.spinner = true;
            $scope.update(false);
        }
    }, true);
};

angular.module('dystopia-tracker').controller('TimelineEmbedCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$filter', '$cookies', '$timeout', 'Filters', TimelineCtrl]);

// it's the end of the code as we know it