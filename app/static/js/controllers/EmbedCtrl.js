angular.module('dystopia-tracker').controller('EmbedCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', 'Realisation', '$rootScope', '$location', '$routeParams', '$cookies', '$filter', '$timeout',
                                                           function($scope, Prediction, Categories, Sources, Realisation, $rootScope, $location, $routeParams, $cookies, $filter,$timeout) {
    
    // define variables for later
    $rootScope.isEmbed = true;
    $scope.prediction = [];
    $scope.realisations = [];
    $scope.category = [];
    $scope.filters = {exclude : $routeParams.id, title : '', author : '', category : ''};
    $scope.language = $rootScope._lang;
    $scope.url = "";

    Prediction.get({id:$routeParams.id}).success(function(data) {
        $scope.prediction = data;
        $scope.prediction.amzn = "http://www.amazon.de/s/?url=search-alias=aps&field-keywords=" + data.source.title + "&tag=davidbauerch-21&link_code=wql&_encoding=UTF-8";
        $scope.realisations = $scope.prediction.realisations;
        $scope.url = $scope.language + "/p/" + $filter('slugify')($scope.prediction.source.author) + "/" + $filter('slugify')($scope.prediction.source['title_' + $rootScope._lang]) + "/" + $scope.prediction.id;
    }); 
        
    function getCategoryDetails(id) {
        Categories.get({id:id}, function(data) {
        $scope.category = data;
        });
    };  
    
}]); // it's the end of the code as we know it
