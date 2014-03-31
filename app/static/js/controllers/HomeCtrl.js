angular.module('dystopia-tracker').controller('HomeCtrl', function($scope, Prediction) {
    $scope.predictions = [];

    Prediction.get().success(function(data) {
        $scope.predictions = data.results;
    });
});
