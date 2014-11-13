angular.module('dystopia-tracker.filters')
    .filter('getTranslated', ['$rootScope', function($rootScope) {
        return function(item, fieldname) {
            if (item == null) {
                return '';
            }

            // check if translation is available
            if (item[fieldname + '_' + $rootScope._lang] != null && item[fieldname + '_' + $rootScope._lang] != "") {
                return item[fieldname + '_' + $rootScope._lang];
            }
            else {
                // check if text is available in English
                if (item[fieldname + '_E'] != null && item[fieldname + '_E']  != "") {
                    return item[fieldname + '_E'];
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
		    if(!string) {return string}
		    return string.split(',').reverse().join(' ');
	   }
   }]);