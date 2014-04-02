angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', function($scope, Prediction, Categories, Sources) {
    $scope.categories = [];
    $scope.predictions = [];
    $scope.editorspicks = [];
    $scope.sources = [];
    $scope.filters = {category:null};

    // TODO use multiple datasets so different source types appear grouped in typeahead: http://twitter.github.io/typeahead.js/examples/#multiple-datasets
    var titles = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: []
    });
    titles.initialize();

    Prediction.get().success(function(data) {
        $scope.predictions = data.results;
    });

    Prediction.get({editors_pick:'True'}).success(function(data) {
        $scope.editorspicks = data.results;
    });

    Categories.get({}, function(data) {
        $scope.categories = data.results;
    });

    Sources.get().success(function(data) {
        $scope.sources = data.results;
        titles.add(data.results);
    });

    $scope.update = function() {

    	editorspick_filters = angular.copy($scope.filters);
    	editorspick_filters.editorspick = 'True'; 
		
		// get all predictions with selected filter applied
	    Prediction.get($scope.filters).success(function(data) {
        $scope.predictions = data.results;
      });

        // get all editor's pick with selected filter applied 
        Prediction.get(editorspick_filters).success(function(data) {
        $scope.editorspicks = data.results;
      });
    };

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
