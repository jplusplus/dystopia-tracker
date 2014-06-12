angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$filter', '$cookies', '$timeout', 'Filters',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies, $timeout, FiltersReset) {

    // check if user has visited the site before
    if ($cookies.alreadyVisited) {
        $scope.returningVisitor = true;
    };
    // set cookie
    $cookies.alreadyVisited = 'true';

    // define variables for later
    $scope.categories = [];
    $scope.sources = {
        "literature": "Literature",
        "movies": "Movies",
        "tv_series": "TV",
        "games": "Games",
        "other": "Others",
    };

    // To preserve sources order
    // @see http://stackoverflow.com/a/18124833/797941
    $scope.sourcesKey = ["literature", "movies", "tv_series", "games", "other"]

    $scope.predictions;
    $scope.editorspicks;
    $scope.filters = { category : '', source__type : '', title : '' };
    $scope.filters.page = 0;
    $scope.hideMoreButton = false;

    // tell facebook it's the home page
    $scope.pagetype('website');

    // reset page info
    $scope.title("Dystopia Tracker");
    $scope.description("Explore and contribute predictions about the future and their realisations.");
    $scope.image("http://www.dystopiatracker.com/static/img/screenshot.png");

    // define number of predictions to load
    $scope.filters.page_size = 20;
    $scope.language = $rootScope._lang;
    var i = 0;

    readUrlParams();

    $scope.$watch(function() { return FiltersReset[0]; }, function(new_value, old_value) {
        if (new_value && !old_value) {
            $scope.filters.category = '';
            $scope.filters.source__type = '';
            $scope.filters.title = '';
            $scope.filters.page = 0;
            $scope.update(true);
            FiltersReset[0] = false;
        }
    }, true);

    $scope.$watch('filters', function(new_value, old_value) {
        if (typeof($scope.filters.title) === 'object') {
            $scope.update(true);
        }
    }, true);

    // Typeahead data object
    $scope.typeaheadData = [];

    var titles = {};
    for (var i in $scope.sourcesKey) if ($scope.sourcesKey.hasOwnProperty(i)) {
        titles[$scope.sourcesKey[i]] = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title_' + $scope.language),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: []
        });
        titles[$scope.sourcesKey[i]].initialize();

        $scope.typeaheadData.push({
            displayKey: 'title_' + $scope.language,
            source: titles[$scope.sourcesKey[i]].ttAdapter(),
            templates: {
                header: '<h3 class="typeahead_category">' + $filter("translate")($scope.sources[$scope.sourcesKey[i]]) + '</h3>'
            }
        });
    }

    Categories.get({}, function(data) {
        $scope.categories = data.results;
    });

    loadTitles(1);

    $scope.update = function(reset) {
        
        $scope.filters.lang = $scope._lang;
        $scope.noContent = false;
        $scope.spinner = true;
        
        // increment to the next page of the API
        $scope.filters.page++;
        
        if (typeof($scope.filters.title) === 'object') {
            $scope.filters.title = $scope.filters.title['title_' + $scope.language];
        }
        
        updateUrl($scope.filters);
		
		if(reset==true) {
			$scope.filters.page = 1;
			$scope.predictions = [];
            $scope.editorspicks = [];
            $scope.hideMoreButton = false;
            
            
            // get all editors picks with selected filter applied 
		    editorspick_filters = angular.copy($scope.filters);
    	    editorspick_filters.editors_pick = 'True';
    	    // define number of editors picks to show
    	    editorspick_filters.page_size = 6;
		    Prediction.get(editorspick_filters).success(function(data) {
		        $scope.spinner = false;
		        for (var i=0;i<data.results.length;i++) {
                    var index = i % 3;
                    if ($scope.editorspicks[index] == null) { $scope.editorspicks[index] = []; }
                    $scope.editorspicks[index].push(data.results[i]);
		        }
			});
		}
        
        // get all predictions with selected filter applied
		Prediction.get($scope.filters).success(function(data) {
		    for (var i=0;i<data.results.length;i++) {
                // 4 columns, +1 to add first element to second column
                var index = (i+1) % 4;
                if ($scope.predictions[index] == null) { $scope.predictions[index] = []; }
                $scope.predictions[index].push(data.results[i]);
		    }
		
		    if (data.next==null) {
		    $scope.hideMoreButton = true;
		    }

            $scope.spinner = false;

            $timeout(function(){
                if ($scope.predictions.length == 0) {
                    $scope.noContent = true;
                }
            }, 500);
        });     
    };

    // load content for the first time
    $scope.update(true);

    // Typeahead options object
    $scope.typeahedOptions = {
        highlight: true
    };
    
    // get list of all titles for search field
    function loadTitles(pageNo){
        Sources.get({page: pageNo}).success(function(data) {
            var results = _.groupBy(data.results, 'type');
            for (var type in results) if (results.hasOwnProperty(type)) {
                titles[type].add(results[type]);
            }
            if(data.next!=null) {
                pageNo++;
                loadTitles(pageNo);
            }
        });
    }
    
    $scope.changeLanguage = function(lang) {
	    $scope._lang = $scope.language = lang;
	    $location.path('/' + $scope.language);
	    $scope.translateTo($scope.language);
        $scope.update(false);
    };
    
    // add active class to button of active language 
    $scope.isActive = function(lang) {
        if (lang == $scope._lang) {
            return 'active';
        } 
    };
    
    function updateUrl(filter) {
	    if (filter.category && filter.category !== "") {
		    $location.search('c', filter.category);
	    } else {
            $location.search('c', null);
        }
	    if (filter.source__type && filter.source__type !== "") {
		    $location.search('s', filter.source__type);
        } else {
            $location.search('s', null);
	    }
	    if (filter.title && filter.title !== "") {
		    $location.search('t', filter.title);
        } else {
            $location.search('t', null);
	    }
	 };
	 
	 function readUrlParams() {
		urlparams = $location.search();
        if (urlparams.c) {
	        $scope.filters.category = parseInt(urlparams.c);
        }
        if (urlparams.s) {
	        $scope.filters.source__type = urlparams.s;
        }
        if (urlparams.t) {
	        $scope.filters.title = urlparams.t;
            Sources.get({title:$scope.filters.title}).success(function(data) {
                if (data.count > 0) {
                    $scope.filters.title = data.results[0]['title_' + $scope.language];
                    updateUrl($scope.filters);
                }
            });
        }
	 };

     $scope.getCategoryTitle = function(category) {
        return $filter('getTranslated')(category, "title");
     };

     $scope.getCategory = function(id) {
        return _.findWhere($scope.categories, {id:id});
     };
}]); // it's the end of the code as we know it
