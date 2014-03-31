class PredictionService
    @$inject: ['$http']

    constructor: (@$http) ->
        @base_url = '/api/predictions'

    get: (params) =>
        if params?
            return
        else
            @$http.get @base_url

(angular.module 'dystopia-tracker.services').service 'Prediction', PredictionService