angular.module('dystopia-tracker').controller('SubmitPredictionCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$routeParams',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location, $routeParams) {
    
    $scope.sources = [];
    $scope.language = $rootScope._lang;

    // TODO use multiple datasets so different source types appear grouped in typeahead: http://twitter.github.io/typeahead.js/examples/#multiple-datasets
    var titles = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: []
    });
    titles.initialize();
    
    loadTitles(1);

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
    
}]); // it's the end of the code as we know it
