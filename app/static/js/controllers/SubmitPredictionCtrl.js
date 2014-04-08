angular.module('dystopia-tracker').controller('SubmitPredictionCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$routeParams','$cookies', '$filter',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location, $routeParams, $cookies, $filter) {
    
    
    // check if user has visited the site before
    if ($cookies.alreadyVisited) {
        $scope.returningVisitor = true;
    };
    // set cookie
    $cookies.alreadyVisited = 'true';
    $scope.sources = [];
    $scope.categories = [];
    $scope.language = $rootScope._lang;
    $scope.prediction = {
         "source": {type: "literature"}, 
         "category": "", 
         "description_E": "", 
         "description_D": "", 
         "year_predicted": "", 
         "more_info": "", 
         "username": "",
         "published": true 
     }

    $scope.foo = function() { alert('here'); }

    $scope.showSourceDetails = false;

    $scope.updateSourceDetailsShow = function() {
        $scope.showSourceDetails = (typeof $scope.prediction.source.title === "string");
    }
    
    Categories.get({}, function(data) {
        $scope.categories = data.results;
    });
    
    $scope.getCategoryTitle = function(category) {
        return $filter('getTranslated')(category, "title");
     }
    
    $scope.submit = function () {
	    
	    $scope.fieldsMissing = false;
	    
	    if ($scope.prediction.source.title == "" || ($scope.prediction.description_E == "" && $scope.prediction.description_D == "")) {
		    $scope.fieldsMissing = true;
		    return;
	    }
	    
	    if (typeof $scope.prediction.source.title === "string") {
		    // create the source retrieve the newly created `id` and set it in the object
		    Sources.post($scope.prediction.source).success(function(data) {
			    $scope.prediction.source = data.id;
			    postPrediction($scope.prediction);
		    });
	    }
	    else if (typeof $scope.prediction.source.title === "object") {
		    $scope.prediction.source = $scope.prediction.source.title.id;
		    postPrediction($scope.prediction);    
	    }   
    };
    
    function postPrediction(prediction) {
	    Prediction.post($scope.prediction).success(function(data) {
			    alert("posted!"); // TODO redirect to thankyou paged);
			    $location.url($scope.language + "/" + "thankyou" + "?p=" + data.id);
		    });    
    }

    // TODO only titles with matching source_type based on users selection before
    $scope.titles = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: []
    });
    $scope.titles.initialize();
    
    loadTitles(1);

    // Typeahead options object
    $scope.typeahedOptions = {
        highlight: true
    };

    // Typeahead data object
    $scope.typeaheadData = {
        displayKey: 'title',
        source: $scope.titles.ttAdapter()
    };
    
    // get list of all titles for search field
    function loadTitles(pageNo){
        Sources.get({page: pageNo,type: $scope.prediction.source.type}).success(function(data) {
            $scope.titles.add(data.results);
            if(data.next!=null) {
                pageNo++;
                loadTitles(pageNo);
            }
        });
    }
    
    $scope.updateTitles = function() {
	    $scope.titles.clear();
	    loadTitles(1);
    };
    
}]); // it's the end of the code as we know it
