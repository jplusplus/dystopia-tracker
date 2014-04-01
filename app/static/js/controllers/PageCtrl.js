angular.module('dystopia-tracker').controller('PageCtrl', function($scope) {
    var _title = 'Dystopia Tracker';

    $scope.title = function(newTitle) {
        if (newTitle != null) {
            _title = newTitle;
        }
        return _title;
    }
});
