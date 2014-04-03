angular.module('dystopia-tracker').controller('DetailsCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$routeParams',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location,$routeParams) {
    
    $scope.prediction = [];
    $scope.realisations = [];
    $scope.category = [];
    $scope.shareurls = [];
    
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
   
    // TODO function to find correct vertical position of various realisations
    
    // TODO load "more" cards (same title, same author, same category)
    
    // create specific sharer urls for social media
    $scope.shareurls.fb = "http://www.facebook.com/sharer.php?u=" + $location.absUrl();
    
}]); // it's the end of the code as we know it
