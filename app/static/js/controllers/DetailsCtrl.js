angular.module('dystopia-tracker').controller('DetailsCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$routeParams',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location,$routeParams) {
    
    $scope.prediction = [];
    $scope.realisations = [];
    $scope.category = [];
    $scope.shareurls = [];
    $scope.more = [];
    $scope.filters = {exclude : $routeParams.id, title : '', author : '', category : ''};
    
    Prediction.get({id:$routeParams.id}).success(function(data) {
		$scope.prediction = data;
		$scope.realisations = $scope.prediction.realisations;
		getCategoryTitle($scope.prediction.category);
		getMore("title",$scope.prediction.source.title);
        getMore("author",$scope.prediction.source.author);
        getMore("category",$scope.prediction.category);
    });	
    
    function getCategoryTitle(id) {
        Categories.get({id:id}, function(data) {
        $scope.category = data;
        });
    };
   
    // TODO function to find correct vertical position of various realisations
    
    // TODO load "more" cards (same title, same author, same category)
    
    
    
    function getMore(param,value) {
        filters = {exclude : $routeParams.id} 
        filters[param] = value;
        console.log(filters);
	    Prediction.get(filters).success(function(data) {
		    $scope.more[param] = data.results;
		    console.log(data.results);
	    });    
    }
    
    
    
    
    // create specific sharer urls for social media
    $scope.shareurls.fb = "http://www.facebook.com/sharer.php?u=" + $location.absUrl();
    
}]); // it's the end of the code as we know it
