angular.module('dystopia-tracker').controller('SubmitRealisationCtrl', ['$scope', 'Prediction', 'Realisation', '$rootScope', '$location', '$routeParams', '$filter',
                                                           function($scope, Prediction, Realisation, $rootScope, $location, $routeParams, $filter) {
    
    $scope.language = $rootScope._lang;
    $scope.prediction = {},
    $scope.prediction.id = parseInt($location.search().p); 
    $scope.realisation = {
	    "prediction" : $scope.prediction.id,
	    "description_E": "", 
        "description_D": "", 
        "year_introduced": "",
        "more_info": "", 
        "username": "",
        "published": true 
    } 
    
    	Prediction.get({id:$scope.prediction.id}).success(function(data) {
		$scope.prediction = data;
    });  
         
    $scope.submit = function () {
	    Realisation.post($scope.realisation).success(function(data) {
		    $location.path($scope.language + "/p/" + $filter('slugify')($filter('reverse')($scope.prediction.source.author)) + "/" + $filter('slugify')($scope.prediction.source.title) + "/" + $scope.prediction.id);
		});     
	};
		 
}]); // it's the end of the code as we know it