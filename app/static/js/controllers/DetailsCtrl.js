angular.module('dystopia-tracker').controller('DetailsCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', 'Realisation', '$rootScope', '$location', '$routeParams', '$cookies', '$filter',
                                                           function($scope, Prediction, Categories, Sources, Realisation, $rootScope, $location, $routeParams, $cookies, $filter) {
    
    
    // check if user has visited the site before
    if ($cookies.alreadyVisited) {
        $scope.returningVisitor = true;
    };
    // set cookie
    $cookies.alreadyVisited = 'true';
    
    // define variables for later
    $scope.prediction = [];
    $scope.realisations = [];
    $scope.category = [];
    $scope.shareurls = [];
    $scope.more = [];
    $scope.translationArray = [];
    $scope.filters = {exclude : $routeParams.id, title : '', author : '', category : ''};
    $scope.language = $rootScope._lang;
    
    $scope.changeLanguage = function(lang) {
	    $scope._lang = $scope.language = lang;
	    $location.path('/' + $scope.language + "/p/" + $filter('slugify')($filter('reverse')($scope.prediction.source.author)) + "/" + $filter('slugify')($scope.prediction.source.title) + "/" + $scope.prediction.id);
	    $scope.translateTo($scope.language);
	    $scope.update(false);
    };
    
    // add active class to button of active language 
    $scope.isActive = function(lang) {
        if (lang == $scope._lang) {
        return 'active';
        } 
    };
    
    /* create array to store year_published of source, year_predicted of prediction, and year_introduced of all realisations
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
   
    // create an array for the timeline so we can order by year   
    function createYearsArray(prediction,realisations) {
        
        // push the publish year
        $scope.alldates.push({"year":prediction.source.year_published, "img":prediction.source.image, "credit": "", "type": "published", "link": prediction.source.more_info, "amzn": prediction.amzn});
        
        // push the predicted year
        if (prediction.year_predicted != 0) {
            $scope.alldates.push({"year":prediction.year_predicted, "type":"predicted","link": prediction.more_info});
        }
        
        // push all realisations and save info for translations
        for (var i=0;i<realisations.length;i++) {
            if (realisations[i].description_E && realisations[i].description_D) {
                realisations[i].isTranslated = true;
            }
            else {
	            realisations[i].isTranslated = false;
	            if (realisations[i].description_D) {
                    realisations[i].translateToE = true;
                }
                else {
	                realisations[i].translateToE = false;
                }
            }
    	    $scope.alldates.push({"id": realisations[i].id, "year":realisations[i].year_introduced, "text_E": realisations[i].description_E, "text_D": realisations[i].description_D, "img":realisations[i].image, "credit": realisations[i].username, "type":"introduced", "link": realisations[i].more_info, "isTranslated" : realisations[i].isTranslated, "translateToE":realisations[i].translateToE});    
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
    $scope.translate = function(real) {
        // find the realisation object with the given id
        for (i=0;i<$scope.realisations.length;i++) {
	        if ($scope.realisations[i].id == real.id) {
		        var realisation = $scope.realisations[i];
	        }
        };
        var fieldToUpdate = "";
        if (realisation.description_E === '') {
            fieldToUpdate = 'description_E';
        } else {
            fieldToUpdate = 'description_D';
        }
        var updatedata = { id : real.id };
        updatedata[fieldToUpdate] = $scope.translationArray[real.id];

	    Realisation.patch(updatedata).success(function(data) {
	        // update scope with the translation
	        for (i=0;i<$scope.realisations.length;i++) {
    	            if ($scope.realisations[i].id == data.id) {
    		        $scope.realisations[i] = data;
    				if (real['text_' + $scope.language] == "") {
    				    real['text_' + $scope.language] = data[fieldToUpdate];
    				}
	            }
            };
            // close form and show thankyou message
            real.isTranslating = false;
            real.isTranslated = true;
            real.thanks = true;
            setTimeout(function(){real.thanks=false}, 3000);
		    });
    };
    
    
}]); // it's the end of the code as we know it
