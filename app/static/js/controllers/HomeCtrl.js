angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', function($scope, Prediction, Categories) {
    $scope.categories = [];
    $scope.predictions = [];

    Prediction.get({}, function(data) {
        $scope.predictions = data.results;
    });

    Categories.get({}, function(data) {
        $scope.categories = data.results;
    });
    
    Sources.get({}, function(data) {
        $scope.sources = data.results;
    });
}]);
