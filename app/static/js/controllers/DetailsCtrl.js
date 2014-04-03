angular.module('dystopia-tracker').controller('DetailsCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$routeParams',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location,$routeParams) {
    
    $scope.prediction = [];
    $scope.realisations = [];
    $scope.category = [];
    
    Prediction.get({id:$routeParams.id}).success(function(data) {
		$scope.prediction = data;
		console.log(data);
		$scope.realisations = $scope.prediction.realisations;
		getCategoryTitle($scope.prediction.category);
    });	
    
    function getCategoryTitle(id) {
        Categories.get({id:id}, function(data) {
        $scope.category = data;
        console.log($scope.category);
        });
    };
   
    
    
}]); // it's the end of the code as we know it
