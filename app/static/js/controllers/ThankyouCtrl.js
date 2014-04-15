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
        var slugifyfilter = $filter('slugify');
        // TODO: add text and images to optimise sharing: http://ar.zu.my/how-to-really-customize-the-deprecated-facebook-sharer-dot-php/
        $scope.url = "http://www.dystopiatracker.com/" + $scope.language + "/p/" + $filter('slugify')($filter('reverse')(prediction.source.author)) + "/" + $filter('slugify')(prediction.source['title_' + $rootScope._lang]) + "/" + prediction.id;
       
       if ($rootScope._lang == "D") {
            $scope.shareurls.desc = "Ich habe gerade eine dystopische Vorhersage beim Dystopia Tracker erfasst: " + prediction.description_D;
            $scope.shareurls.shortdesc = "Ich habe gerade eine dystopische Vorhersage beim @dystopiatracker erfasst:"
        }
        else {
            $scope.shareurls.desc = "I just added a dystopian prediction to the Dystopia Tracker: " + prediction.description_E;
            $scope.shareurls.shortdesc = "I just added a dystopian prediction to the @dystopiatracker, check it out:";
          }

       $scope.shareurls.picture = "";
    
       $scope.shareurls.fb = "https://www.facebook.com/dialog/feed?app_id=624040751022885&redirect_uri=" + $scope.url + "&display=page&link=" + $scope.url + "&name=Dystopia%20Tracker&description=" + $scope.shareurls.desc + "&picture=" + $scope.shareurls.picture;
       $scope.shareurls.twi = "https://twitter.com/intent/tweet?text=" + $scope.shareurls.shortdesc + "&url=" + $scope.url;
       $scope.shareurls.mail = "mailto:?Subject=Dystopia Tracker&Body=" + $scope.shareurls.desc + " --> " + $scope.url;  
    };
}]); // it's the end of the code as we know it