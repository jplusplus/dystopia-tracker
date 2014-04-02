angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', function($scope, Prediction, Categories, Sources) {
    $scope.categories = [];
    $scope.predictions = [];
    $scope.editorspicks = [];
    $scope.sources = [];
    $scope.filters = {category:'', source__type:'', title:''};
    $scope.filters.page = 0;
    $scope.hideMoreButton = false;

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
    	editorspick_filters = angular.copy($scope.filters);
    	editorspick_filters.editors_pick = 'True'; 
		
		if(reset==true) {
			$scope.filters.page = 1;
			$scope.predictions = [];
            $scope.editorspicks = [];
        }
        
        // get all predictions with selected filter applied
		Prediction.get($scope.filters).success(function(data) {
		    $scope.predictions = $scope.predictions.concat(data.results);
		});
		
		// get all editor's pick with selected filter applied 
		Prediction.get(editorspick_filters).success(function(data) {
		    $scope.editorspicks = $scope.editorspicks.concat(data.results);
		});
		
		if (data.next==null) {
		    $scope.hideMoreButton = true;
		}
         
    };

    $scope.update();

    // Typeahead options object
    $scope.typeahedOptions = {
        highlight: true
    };

    // Typeahead data object
    $scope.typeaheadData = {
        displayKey: 'title',
        source: titles.ttAdapter()
    };
}]);
