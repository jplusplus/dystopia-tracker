angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$filter', '$cookies',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location, $filter, $cookies) {

    // check if user has visited the site before
    if ($cookies.alreadyVisited) {
        $scope.returningVisitor = true;
    };
    // set cookie
    $cookies.alreadyVisited = 'true';
    $scope.categories = [];
    $scope.predictions;
    $scope.editorspicks;
    $scope.sources = [];
    $scope.filters = {category:'', source__type:'', title:''};
    $scope.filters.page = 0;
    $scope.hideMoreButton = false;
    // define number of predictions to load, set to 10 to test, will be higher for launch
    $scope.filters.page_size = 10;
    $scope.language = $rootScope._lang;
    var i = 0;

    readUrlParams();

    // TODO use multiple datasets so different source types appear grouped in typeahead: http://twitter.github.io/typeahead.js/examples/#multiple-datasets
    var titles = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: []
    });
    titles.initialize();

    Categories.get({}, function(data) {
        $scope.categories = data.results;
    });

    loadTitles(1);

    $scope.update = function(reset) {
        
        $scope.filters.lang = $scope._lang;
        
        // increment to the next page of the API
        $scope.filters.page++;
        
        if (typeof($scope.filters.title) === 'object') {
            $scope.filters.title = $scope.filters.title.title;
        }
        
        updateUrl($scope.filters);
		
		if(reset==true) {
			$scope.filters.page = 1;
			$scope.predictions = [];
            $scope.editorspicks = [];
            $scope.hideMoreButton = false;
            
            
            // get all editor's picks with selected filter applied 
		    editorspick_filters = angular.copy($scope.filters);
    	    editorspick_filters.editors_pick = 'True';
    	    // define number of editors picks to show -- set to 2 to test, will be higher for launch
    	    editorspick_filters.page_size = 6;
		    Prediction.get(editorspick_filters).success(function(data) {
		    
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
        });
        
         
    };

    $scope.update(true);

    // Typeahead options object
    $scope.typeahedOptions = {
        highlight: true
    };

    // Typeahead data object
    $scope.typeaheadData = {
        displayKey: 'title',
        source: titles.ttAdapter()
    };
    
    // get list of all titles for search field
    function loadTitles(pageNo){
        Sources.get({page: pageNo}).success(function(data) {
            titles = titles.add(data.results);
            if(data.next!=null) {
                pageNo++;
                loadTitles(pageNo);
            }
        });
    }
    
    $scope.changeLanguage = function() {
	    $scope._lang = $scope.language;
	    $location.path('/' + $scope.language);
	    $scope.translateTo($scope.language);
	    $scope.update(false);
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
        }
	 };

     $scope.getCategoryTitle = function(category) {
        return $filter('getTranslated')(category, "title");
     }
}]); // it's the end of the code as we know it
