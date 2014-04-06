angular.module('dystopia-tracker').controller('SubmitRealisationCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$routeParams', '$filter',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location, $routeParams, $filter) {
    
    $scope.language = $rootScope._lang;
    // TODO: realisation.prediction value must be saved when button "add realisation" is pressed
    $scope.realisation = {
	    "prediction" : $location.search()['p'],
	    "description_E": "", 
        "description_D": "", 
        "year_introduced": "",
        "more_info": "", 
        "username": "", 
    } 
         
    $scope.submit = function () {
	    Realisation.post($scope.realisation).success(function(data) {
		alert("posted!"); // TODO redirect to detail page of realisation.prediction, with submitted realisation visible
		});     
	};  
	 
}]); // it's the end of the code as we know it