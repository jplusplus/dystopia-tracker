angular.module('dystopia-tracker').controller('SubmitRealisationCtrl', ['$scope', 'Prediction', 'Realisation', '$rootScope', '$location', '$routeParams', '$filter',
                                                           function($scope, Prediction, Realisation, $rootScope, $location, $routeParams, $filter) {

    $scope.language = $rootScope._lang;
    $scope.prediction = {},
    $scope.prediction.id = parseInt($location.search().p);
    $scope.realisation = {
	    "prediction" : $scope.prediction.id,
	    "description_E": "",
        "description_D": "",
        "description_F": "",
        "year_introduced": "",
        "more_info": "",
        "username": "",
        "published": true
    }

    $scope.changeLanguage = function(lang) {
	    $scope._lang = $scope.language = lang;
	    $location.path('/' + $scope.language + "/submit/realisation");
	    $scope.translateTo($scope.language);
        $scope.update(false);
    };

    // add active class to button of active language
    $scope.isActive = function(lang) {
        if (lang == $scope._lang) {
        return 'active';
        }
    };

    	Prediction.get({id:$scope.prediction.id}).success(function(data) {
		$scope.prediction = data;
    });

    $scope.submit = function () {
	    Realisation.post($scope.realisation).success(function(data) {
		    $location.path($scope.language + "/p/" + $filter('slugify')($scope.prediction.source.author) + "/" + $filter('slugify')($scope.prediction.source.title) + "/" + $scope.prediction.id);
		}).error(function(data) {
            if (data.year_introduced != null) {
                $scope.numbererror = 'help-block alert alert-warning alert-dismissable fade in';
            } else {
                $scope.numbererror = null;
            }
        });
	};

	$scope.back = function() {
	    window.history.back();
    };

}]); // it's the end of the code as we know it