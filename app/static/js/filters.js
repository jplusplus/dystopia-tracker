var oppositeLang = {'E':'D', 'D':'E'};

angular.module('dystopia-tracker.filters')
    .filter('getTranslated', ['$rootScope', function($rootScope, oppositeLang) {
        return function(item, fieldname) {
            // check if translation is available
            if (item[fieldname + '_' + $rootScope._lang] != "") {
                return item[fieldname + '_' + $rootScope._lang];
            }
            else {
                 // check if text is available in the other language
                 if (item[fieldname + '_' + opppositeLang.$rootScope._lang] != "") {
                 return item[fieldname + '_' + opppositeLang.$rootScope._lang];
                 }
                 // if all fails, leave empty
                 else {
                     return "";
                 }
            }
        }
}])
    .filter('reverse',[function(){
	    return function (string) {
		    return string.split(',').reverse().join(' ');
	   }
   }]);