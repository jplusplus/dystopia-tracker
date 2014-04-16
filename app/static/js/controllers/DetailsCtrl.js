angular.module('dystopia-tracker').controller('DetailsCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', 'Realisation', '$rootScope', '$location', '$routeParams', '$cookies', '$filter', '$timeout',
                                                           function($scope, Prediction, Categories, Sources, Realisation, $rootScope, $location, $routeParams, $cookies, $filter,$timeout) {
    
    
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
	    $location.path('/' + $scope.language + "/p/" + $filter('slugify')($scope.prediction.source.author) + "/" + $filter('slugify')($scope.prediction.source['title_' + $rootScope._lang]) + "/" + $scope.prediction.id);
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
    
    Prediction.get({id:$routeParams.id}).success(function(data) {
		$scope.prediction = data;
        $scope.realisations = $scope.prediction.realisations;
		createYearsArray($scope.prediction,$scope.realisations);
		getMore("title",$scope.prediction.source.title);
        getMore("author",$scope.prediction.source.author);
        getMore("category",$scope.prediction.category);
        findTranslationStatus($scope.prediction);
        createShareUrls($scope.prediction);
        createAmznLink($scope.prediction);  
    });	

    function createAmznLink(prediction) {
        if (prediction.source.type == "literature") {
            amznType = "books";
        }
        else if (prediction.source.type == "movies" || prediction.source.type == "tv_series") {
            amznType = "dvd";
        }
        else if (prediction.source.type == "games") {
            amznType = "pc & video games";
        }
        else {
            amznType = "all products";
        }
        $scope.prediction.amzn = "http://www.amazon.de/s/?url=search-alias=aps&field-keywords=" + prediction.source['title_' + $scope.language] + "&category=" + amznType + "&tag=davidbauerch-21&link_code=wql&_encoding=UTF-8";
    };
    
    function findTranslationStatus(object) {
	    if (!object.description_E && !object.description_D) {
		    object.isEmpty = true;    
	    };
	    
	    if (object.description_E && object.description_D) {
                object.isTranslated = true;
            }
        else {
	            object.isTranslated = false;
	            if (object.description_D) {
                    object.translateToE = true;
                }
                else {
	                object.translateToE = false;
                }
            }
    };
    
    function getCategoryDetails(id) {
        Categories.get({id:id}, function(data) {
        $scope.category = data;
        });
    };
   
    // create an array for the timeline so we can order by year   
    function createYearsArray(prediction,realisations) {
        
        // push the publish year
        findTranslationStatus(prediction.source);
        $scope.alldates.push({"year":prediction.source.year_published, "img":prediction.source.image, "credit": "", "type": "published", "link": prediction.source.more_info, "amzn": prediction.amzn,"isTranslated" : prediction.source.isTranslated, "translateToE":prediction.source.translateToE, "isEmpty":prediction.source.isEmpty});
        
        // push the predicted year
        if (prediction.year_predicted != 0) {
            $scope.alldates.push({"year":prediction.year_predicted, "type":"predicted","link": prediction.more_info});
        }
        
        // push all realisations and save info for translations
        for (var i=0;i<realisations.length;i++) {
            findTranslationStatus(realisations[i]);
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
    
    // TODO: add image to optimise sharing
    function createShareUrls (prediction) {
        if ($rootScope._lang == "D") {
            $scope.shareurls.desc = "Erkunden Sie dystopische Vorhersagen und ihre Realisierungen – wie diese: " + prediction.description_D;
            $scope.shareurls.shortdesc = "Erkunde hunderte dystopische Vorhersagen und ihre Realisierungen @dystopiatracker:"
        }
        else {
            $scope.shareurls.desc = "Browse dystopian predictions and their realisations. Like this one: " + prediction.description_E};
            $scope.shareurls.shortdesc = "The @dystopiatracker lets you browse hundreds of dystopian predictions and their realisations:"

        $scope.shareurls.picture = "";
        $scope.shareurls.fb = "https://www.facebook.com/dialog/feed?app_id=624040751022885&redirect_uri=" + $location.absUrl() + "&display=page&link=" + $location.absUrl() + "&name=Dystopia%20Tracker&description=" + $scope.shareurls.desc + "&picture=" + $scope.shareurls.picture;
        $scope.shareurls.twi = "https://twitter.com/intent/tweet?text=" + $scope.shareurls.shortdesc + "&url=" + $location.absUrl();    
        $scope.shareurls.mail = "mailto:?Subject=Dystopia Tracker&Body=" + $scope.shareurls.desc + " --> " + $location.absUrl();
    }
    
    
    // save translation
    $scope.translate = function(item, type) {
        // find the realisation object with the given id
        if (type === "realisation") {
            for (i=0;i<$scope.realisations.length;i++) {
    	        if ($scope.realisations[i].id == item.id) {
    		        var realisation = $scope.realisations[i];
    	        }
            }
        };
        
        var fieldToUpdate = "";
        
        if (type === "realisation") {  
            if (realisation.description_E === '') {
                fieldToUpdate = 'description_E';
            } else {
                fieldToUpdate = 'description_D';
            }
            var updatedata = { id : item.id };
        }
        
        else if (type === "prediction") {  
            if ($scope.prediction.description_E === '') {
                fieldToUpdate = 'description_E';
            } else {
                fieldToUpdate = 'description_D';
            }
            var updatedata = { id : $scope.prediction.id };
        }
        
        else if (type === "source") {  
            if ($scope.prediction.source.description_E === '') {
                fieldToUpdate = 'description_E';
            } else {
                fieldToUpdate = 'description_D';
            }
        
            var updatedata = { id : $scope.prediction.source.id };
        }
        
        
        updatedata[fieldToUpdate] = $scope.translationArray[item.id];
        
	    if (type == "realisation") {
	      
	    Realisation.patch(updatedata).success(function(data) {
	        // update scope with the translation
	        for (i=0;i<$scope.realisations.length;i++) {
    	            if ($scope.realisations[i].id == data.id) {
    	            console.log("helo");
    		        $scope.realisations[i] = data;
    		        console.log($scope.realisations[i]);
       				if (item['text_' + $scope.language] == "") {
    				    item['text_' + $scope.language] = data[fieldToUpdate];
    				}
	                }
            };
            // close form and show thankyou message
            wrapupTranslation(item);
		})
		}
		
		else if (type === "prediction") {
	    Prediction.patch(updatedata).success(function(data) {
	       
	       // update scope with the translation
           $scope.prediction = data;
    		if (item['text_' + $scope.language] == "") {
    		    item['text_' + $scope.language] = data[fieldToUpdate];
    			}
            
            // close form and show thankyou message
            wrapupTranslation($scope.prediction);
		})

        }
        
        else if (type === "source") {
	    Sources.patch(updatedata).success(function(data) {
	       
	       // update scope with the translation
           $scope.prediction.source = data;
    		if (item['text_' + $scope.language] == "") {
    		    item['text_' + $scope.language] = data[fieldToUpdate];
    			}
            
            // close form and show thankyou message
            wrapupTranslation(item);
		})

        };
    
    };
    
    function wrapupTranslation(item) {
            item.isTranslating = false;
            item.isTranslated = true;
            item.thanks = true; 
            $timeout(function(){
                item.thanks = false;
                }, 3000);
		    };
    
    
}]); // it's the end of the code as we know it
