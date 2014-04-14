angular.module('dystopia-tracker').controller('TimelineCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', 'Realisation', '$rootScope', '$location', '$routeParams',
                                                           function($scope, Prediction, Categories, Sources, Realisation, $rootScope, $location, $routeParams) {
    
    $scope.changeLanguage = function(lang) {
	    $scope._lang = $scope.language = lang;
	    $location.path('/' + $scope.language);
	    $scope.translateTo($scope.language);
        $scope.update(false);
    };
    
    // add active class to button of active language 
    $scope.isActive = function(lang) {
        if (lang == $scope._lang) {
        return 'active';
        } 
    };
    
        
    
}]); // it's the end of the code as we know it
