angular.module('dystopia-tracker').controller('PageCtrl', ['$scope', '$location', '$rootScope', '$translate', 'Filters',
                                                           function($scope, $location, $rootScope, $translate, FiltersReset) {
    var _title = 'Dystopia Tracker';
    var _description = 'Explore and contribute predictions about the future and their realisations.'
    var _image = 'http://www.dystopiatracker.com/static/img/screenshot.png';
    var _pagetype = 'article';

    var defaultLang;
    if (navigator.language.indexOf("de") == 0) {
        defaultLang = "D";
    }
    else {
        defaultLang = "E";
    };

    $rootScope._lang = defaultLang;

    $scope.translateTo = function(lang) {
        $rootScope._lang = lang;
        $translate.use($rootScope._lang);
    };
    
    $scope.spinner = false;
    
    // add active class to view switch
    $rootScope.activeView = function(view) {
        if (view == "cards" && $location.path() == '/' + $rootScope._lang) {
        return 'active';
        }
        if (view == "timeline" && $location.path() == '/' + $rootScope._lang + '/timeline') {
	        return 'active';
        } 
    };

    // Handle languages
    var re = /^\/([A-Z]{1})\/?/;
    var matches = re.exec($location.path());
    if (matches != null) {
        $scope.translateTo(matches[1]);
    }

    $scope.title = function(newTitle) {
        if (newTitle != null) {
            _title = newTitle;
        }
        return _title;
    };

    $scope.description = function(newDescription) {
        if (newDescription != null) {
            _description = newDescription;
        }
        return _description;
    };

    $scope.image = function(newImage) {
        if (newImage != null) {
            _image = newImage;
        }
        return _image;
    }; 

    $scope.pagetype = function(newPagetype) {
        if (newPagetype != null) {
            _pagetype = newPagetype;
        }
        return _pagetype;
    };

    $scope.reset = function() {
        FiltersReset[0] = true;
    };

}]);
