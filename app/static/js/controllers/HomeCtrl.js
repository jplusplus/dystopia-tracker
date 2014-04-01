angular.module('dystopia-tracker').controller('HomeCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', function($scope, Prediction, Categories, Sources) {
    $scope.categories = [];
    $scope.predictions = [];
    $scope.sources = [];

    Prediction.get({}, function(data) {
        $scope.predictions = data.results;
    });

    Categories.get({}, function(data) {
        $scope.categories = data.results;
    });
    
    Sources.get({}, function(data) {
        $scope.sources = data.results;
        titles.add(data.results);
    });
    
    // constructs the suggestion engine
    var titles = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    // `states` is an array of state names defined in "The Basics"
    local: []
});
 
    // kicks off the loading/processing of `local` and `prefetch`
    titles.initialize();
    
    // Typeahead options object
    $scope.exampleOptions = {
    highlight: true
    };

    // Single dataset example
    $scope.exampleData = {
    displayKey: 'title',
    source: titles.ttAdapter()
  };
 
    $('#bloodhound .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
     },
    {
        name: 'titles',
        displayKey: 'title',
        source: titles.ttAdapter()
    });
    
}]);
