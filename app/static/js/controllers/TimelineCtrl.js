
var TimelineCtrl = function($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies, $timeout) {
    console.debug('TIMELINE');

    angular.extend(this, new HomeCtrl($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies, $timeout));
};

angular.module('dystopia-tracker').controller('TimelineCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$filter', '$cookies', '$timeout', TimelineCtrl]);

// it's the end of the code as we know it