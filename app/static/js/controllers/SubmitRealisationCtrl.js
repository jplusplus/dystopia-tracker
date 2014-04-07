angular.module('dystopia-tracker').controller('SubmitRealisationCtrl', ['$scope', 'Prediction', 'Realisation', '$rootScope', '$location', '$routeParams',
                                                           function($scope, Prediction, Realisation, $rootScope, $location, $routeParams) {
    
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
         
    $scope.submit = function () {
	    Realisation.post($scope.realisation).success(function(data) {
		alert("posted!"); // TODO redirect to detail page of realisation.prediction, with submitted realisation visible
		});     
	};
	
	Prediction.get({id:$scope.prediction.id}).success(function(data) {
		$scope.prediction = data;
    });  
	 
}]); // it's the end of the code as we know it