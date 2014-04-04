angular.module('dystopia-tracker').controller('SubmitPredictionCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', '$rootScope', '$location', '$routeParams', '$filter',
                                                           function($scope, Prediction, Categories, Sources, $rootScope, $location, $routeParams, $filter) {
    
    $scope.sources = [];
    $scope.categories = [];
    $scope.language = $rootScope._lang;
    $scope.prediction = {
         "source": {}, 
         "category": "", 
         "description_E": "", 
         "description_D": "", 
         "year_predicted": "", 
         "more_info": "", 
         "username": "", 
     }
    
    Categories.get({}, function(data) {
        $scope.categories = data.results;
    });
    
    $scope.getCategoryTitle = function(category) {
        return $filter('getTranslated')(category, "title");
     }
    
    
    
    

    // TODO only titles with matching source_type based on users selection before
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
