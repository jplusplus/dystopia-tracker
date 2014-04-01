angular.module('dystopia-tracker').controller('HomeCtrl', function($scope, Prediction) {
    $scope.predictions = [];

    Prediction.get({}, function(data) {
        $scope.predictions = data.results;
    });
});
