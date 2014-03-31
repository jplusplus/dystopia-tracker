class PageCtrl
    @$inject: ['$scope']

    constructor: (@scope) ->
        @scope.title = @title

        @title 'Dystopia Tracker'

    title: (newTitle) =>
        if newTitle?
            @_title = newTitle
        @_title