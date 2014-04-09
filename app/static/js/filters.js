angular.module('dystopia-tracker.filters')
    .filter('getTranslated', ['$rootScope', function($rootScope) {
        return function(prediction, fieldname) {
            if (prediction[fieldname + '_' + $rootScope._lang] != "") {
                return prediction[fieldname + '_' + $rootScope._lang];
            }
            else if (false) {
                 // if field is empty, use other language
            }
            else {
	            // if both fields are empty, return ""
	            return "";
            }
        }
}])
    .filter('reverse',[function(){
	    return function (string) {
		    return string.split(',').reverse().join(' ');
	   }
   }]);