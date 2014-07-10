angular.module('dystopia-tracker').directive('sticktotop', function() {
    return {
        link : function(scope, element, attrs) {
            var initial_y = element[0].getBoundingClientRect().top;
            var initial_position = element.css('position');
            var initial_top = element.css('top');
            $(window).on("scroll", function() {
                var scroll = $(window).scrollTop();
                if (scroll > initial_y) {
                    element.css({
                        position : 'absolute',
                        top : scroll
                    });
                } else {
                    element.css({
                        position : initial_position,
                        top : initial_top
                    });
                }
            });
        }
    }
});