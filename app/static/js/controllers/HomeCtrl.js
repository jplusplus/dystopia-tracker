angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', function($scope, Prediction, Categories, Sources) {
    $scope.categories = [];
    $scope.predictions = [];
    $scope.editorspicks = [];
    $scope.sources = [];
    $scope.filters = {category:'', source__type:'', title:''};
    $scope.filters.page = 0;
    $scope.hideMoreButton = false;
    // define number of predictions to load, set to 4 to test, will be higher for launch
    $scope.filters.page_size = 4;

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

    Sources.get().success(function(data) {
        $scope.sources = data.results;
        titles.add(data.results);
    });

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
    
    // currently unused
    function loadEditorsPicks(pageNo){
	    editorspick_filters = angular.copy($scope.filters);
    	editorspick_filters.editors_pick = 'True';
    	editorspick_filters.page = pageNo;
    	Prediction.get(editorspick_filters).success(function(data) {
		    $scope.editorspicks = $scope.editorspicks.concat(data.results);
		    if(data!=null) {
			pageNo++;
			loadEditorsPicks(pageNo);
		    } 
		});  
    }
    
    
}]);
