angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$location', '$rootScope', function($scope, Prediction, Categories, Sources,$location,$rootScope) {

    $scope.categories = [];
    $scope.predictions = [];
    $scope.editorspicks = [];
    $scope.sources = [];
    $scope.filters = {category:'', source__type:'', title:''};
    $scope.filters.page = 0;
    $scope.hideMoreButton = false;
    // define number of predictions to load, set to 4 to test, will be higher for launch
    $scope.filters.page_size = 4;
    $scope.language = $rootScope._lang;
    

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
        
        // increment to the next page of the API
        $scope.filters.page++; 
        
        if (typeof($scope.filters.title) === 'object') {
            $scope.filters.title = $scope.filters.title.title;
        }
		
		if(reset==true) {
			$scope.filters.page = 1;
			$scope.predictions = [];
            $scope.editorspicks = [];
            
            // get all editor's picks with selected filter applied 
		    editorspick_filters = angular.copy($scope.filters);
    	    editorspick_filters.editors_pick = 'True';
    	    // define number of editors picks to show -- set to 2 to test, will be higher for launch
    	    editorspick_filters.page_size = 2;
		    Prediction.get(editorspick_filters).success(function(data) {
		    $scope.editorspicks = $scope.editorspicks.concat(data.results);
			});
		}
        
        // get all predictions with selected filter applied
		Prediction.get($scope.filters).success(function(data) {
		    $scope.predictions = $scope.predictions.concat(data.results);
		
		
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
    };
     
}]); // it's the end of the code as we know it