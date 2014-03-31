class HomeCtrl
    @$inject: ['$scope', 'Prediction']

    constructor: (@$scope, Prediction) ->
        @$scope.predictions = []
        (do Prediction.get).success (data) =>
            @$scope.predictions = data.results
            console.debug @$scope.predictions