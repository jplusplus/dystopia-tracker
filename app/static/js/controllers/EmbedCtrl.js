angular.module('dystopia-tracker').controller('EmbedCtrl', ['$scope', 'Prediction', 'Categories', 'Sources', 'Realisation', '$rootScope', '$location', '$routeParams', '$cookies', '$filter', '$timeout',
                                                           function($scope, Prediction, Categories, Sources, Realisation, $rootScope, $location, $routeParams, $cookies, $filter,$timeout) {
    
    // define variables for later
    $rootScope.isEmbed = true;
    $scope.prediction = [];
    $scope.realisations = [];
    $scope.category = [];
    $scope.filters = {exclude : $routeParams.id, title : '', author : '', category : ''};
    $scope.language = $rootScope._lang;
        
    /* create array to store year_published of source, year_predicted of prediction, and year_introduced of all realisations
    including the corresponding descriptions */
    $scope.alldates = [];
    $scope.sorting = 'year';
    
    Prediction.get({id:$routeParams.id}).success(function(data) {
        $scope.prediction = data;
        $scope.prediction.amzn = "http://www.amazon.de/s/?url=search-alias=aps&field-keywords=" + data.source.title + "&tag=davidbauerch-21&link_code=wql&_encoding=UTF-8";
        $scope.realisations = $scope.prediction.realisations;
        createYearsArray($scope.prediction,$scope.realisations);
    }); 
        
    function getCategoryDetails(id) {
        Categories.get({id:id}, function(data) {
        $scope.category = data;
        });
    };
   
    // create an array for the timeline so we can order by year   
    function createYearsArray(prediction,realisations) {
        
        // push the publish year
        $scope.alldates.push({"year":prediction.source.year_published, "img":prediction.source.image, "credit": "", "type": "published", "link": prediction.source.more_info, "amzn": prediction.amzn,"isTranslated" : prediction.source.isTranslated, "translateToE":prediction.source.translateToE, "isEmpty":prediction.source.isEmpty});
        
        // push the predicted year
        if (prediction.year_predicted != 0) {
            $scope.alldates.push({"year":prediction.year_predicted, "type":"predicted","link": prediction.more_info});
        }
        
        // push all realisations and save info for translations
        for (var i=0;i<realisations.length;i++) {
            $scope.alldates.push({"id": realisations[i].id, "year":realisations[i].year_introduced, "text_E": realisations[i].description_E, "text_D": realisations[i].description_D, "img":realisations[i].image, "credit": realisations[i].username, "type":"introduced", "link": realisations[i].more_info, "isTranslated" : realisations[i].isTranslated, "translateToE":realisations[i].translateToE});    
        };
    };   
    
}]); // it's the end of the code as we know it
