angular.module('dystopia-tracker').controller('PageCtrl', ['$scope', '$location', '$rootScope', '$translate', function($scope, $location, $rootScope, $translate) {
    var _title = 'Dystopia Tracker';

    $scope.translateTo = function(lang) {
        $rootScope._lang = lang;
        $translate.use($rootScope._lang);
    };

    // Handle languages
    var re = /^\/([A-Z]{1})\/?/
    var matches = re.exec($location.path());
    if (matches != null) {
        $scope.translateTo(matches[1]);
    }

    $scope.title = function(newTitle) {
        if (newTitle != null) {
            _title = newTitle;
        }
        return _title;
    };
}]);
