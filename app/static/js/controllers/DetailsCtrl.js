angular.module('dystopia-tracker').controller('DetailsCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', 'Realisation', '$rootScope', '$location', '$routeParams', '$cookies',
                                                           function($scope, Prediction, Categories, Sources, Realisation, $rootScope, $location, $routeParams, $cookies) {
    
    
    // check if user has visited the site before
    if ($cookies.alreadyVisited) {
        $scope.returningVisitor = true;
    };
    // set cookie
    $cookies.alreadyVisited = 'true';
    $scope.prediction = [];
    $scope.realisations = [];
    $scope.category = [];
    $scope.shareurls = [];
    $scope.more = [];

    $scope.translationArray = [];

    $scope.filters = {exclude : $routeParams.id, title : '', author : '', category : ''};
    $scope.language = $rootScope._lang;
    /* create array to story year_published of source, year_predicted of prediction, and year_introduced of all realisations
    including the corresponding descriptions */
    $scope.alldates = [];
    $scope.sorting = 'year';
    $scope.isTranslating = false;
    
    Prediction.get({id:$routeParams.id}).success(function(data) {
		$scope.prediction = data;
		$scope.prediction.amzn = "http://www.amazon.de/s/?url=search-alias=aps&field-keywords=" + data.source.title + "&tag=davidbauerch-21&link_code=wql&_encoding=UTF-8";
        $scope.realisations = $scope.prediction.realisations;
		createYearsArray($scope.prediction,$scope.realisations);
	    getCategoryTitle($scope.prediction.category);
		getMore("title",$scope.prediction.source.title);
        getMore("author",$scope.prediction.source.author);
        getMore("category",$scope.prediction.category);
    });	
    
    function getCategoryTitle(id) {
        Categories.get({id:id}, function(data) {
        $scope.category = data;
        });
    };
   
    function createYearsArray(prediction,realisations) {
        // push all year values into the array
        $scope.alldates.push({"year":prediction.source.year_published, "img":prediction.source.image, "credit": "", "type": "published", "link": prediction.source.more_info, "amzn": prediction.amzn});
        
        if (prediction.year_predicted != 0) {
            $scope.alldates.push({"year":prediction.year_predicted, "type":"predicted","link": prediction.more_info});
        }
        
        for (var i=0;i<realisations.length;i++) {
            if (realisations[i].description_E && realisations[i].description_D) {
                realisations[i].isTranslated = true;
            }
            else {
	            realisations[i].isTranslated = false;
            }
    	    $scope.alldates.push({"id": realisations[i].id, "year":realisations[i].year_introduced, "text_E": realisations[i].description_E, "text_D": realisations[i].description_D, "img":realisations[i].image, "credit": realisations[i].username, "type":"introduced", "link": realisations[i].more_info, "isTranslated" : realisations[i].isTranslated});    
        };
    };
    
      
    function getMore(param,value) {
        filters = {exclude : $routeParams.id} 
        filters[param] = value;
	    Prediction.get(filters).success(function(data) {
		    $scope.more[param] = data.results;
		    $scope.more[param] = _.filter($scope.more[param], function(elem) {
            return elem['description_' + $scope._lang];
            });
	    });    
    }
    
    // TODO: add text and images to optimise sharing: http://ar.zu.my/how-to-really-customize-the-deprecated-facebook-sharer-dot-php/
    $scope.shareurls.fb = "http://www.facebook.com/sharer.php?u=" + $location.absUrl();
    $scope.shareurls.twi = "http://twitter.com/share?url=" + $location.absUrl();
    $scope.shareurls.mail = "mailto:?Subject=Dystopia Tracker&Body=" + $location.absUrl();
    
    // save translation
    $scope.translate = function(realisation_id) {
        // find the realisation object with the given id
        console.log("realisation id:" + realisation_id);
        console.log($scope.realisations);
        for (i=0;i<$scope.realisations.length;i++) {
	        if ($scope.realisations[i].id = realisation_id) {
		        var realisation = $scope.realisations[i];
	        }
        };
        console.log("realisation description: " + realisation.description_E);
        var fieldToUpdate = "";
        if (realisation.description_E === '') {
            fieldToUpdate = 'description_E';
        } else {
            fieldToUpdate = 'description_D';
        }
        var updatedata = { id : realisation_id, fieldToUpdate : $scope.translationArray[realisation_id] };

	    Realisation.patch(updatedata).success(function(data) {
	        // take return data and update scope
	        console.log("DATA: " + data);
            // TODO close form and show success message instead (ng-show="translated")
            isTranslating = false;
		    });
    };
    
    
}]); // it's the end of the code as we know it
