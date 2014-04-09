angular.module('dystopia-tracker.filters')
    .filter('getTranslated', ['$rootScope', function($rootScope) {
        return function(item, fieldname) {
            var oppositeLang = {'E':'D', 'D':'E'};
            // check if translation is available
            if (item[fieldname + '_' + $rootScope._lang] != null && item[fieldname + '_' + $rootScope._lang] != "") {
                return item[fieldname + '_' + $rootScope._lang];
            }
            else {
                 // check if text is available in the other language
                 if (item[fieldname + '_' + oppositeLang[$rootScope._lang]] != null && item[fieldname + '_' + oppositeLang[$rootScope._lang]] != "") {
                     return item[fieldname + '_' + oppositeLang[$rootScope._lang]];
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