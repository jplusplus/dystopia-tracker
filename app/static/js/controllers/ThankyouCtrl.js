angular.module('dystopia-tracker').controller('ThankyouCtrl', ['$scope', 'Prediction', '$rootScope', '$location', '$routeParams', '$filter',
                                                           function($scope, Prediction, $rootScope, $location, $routeParams, $filter) {
    
    $scope.prediction = {},
    $scope.prediction.id = parseInt($location.search().p), 
    $scope.shareurls = [],
    $scope.language = $rootScope._lang;

    Prediction.get({id:$scope.prediction.id}).success(function(data) {
		$scope.prediction = data;
		createSharingUrls($scope.prediction);
    });  

    function createSharingUrls(prediction) {
        // TODO: add text and images to optimise sharing: http://ar.zu.my/how-to-really-customize-the-deprecated-facebook-sharer-dot-php/
        var url = "http://www.dystopiatracker.com/" + $scope.language + "/p/" + [[prediction.source.author | reverse | slugify]] + "/" + [[prediction.source.title | slugify]] + "/" + [[prediction.id]];
        $scope.shareurls.fb = "http://www.facebook.com/sharer.php?u=" + url;
        $scope.shareurls.twi = "http://twitter.com/share?url=" + url;
        $scope.shareurls.mail = "mailto:?Subject=Dystopia Tracker&Body=" + url;
    }
    
}]); // it's the end of the code as we know it
