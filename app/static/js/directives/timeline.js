angular.module('dystopia-tracker').directive('timeline', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class=\'timeline\'></div>',
        scope: {
            predictions : '='
        },
        link: angular.bind({}, function(scope, element, attrs) {
            this.init = function(predictions) {
                console.debug('INIT');
                this.d3_size = {
                    width : element.width(),
                    height : element.height()
                };

                // Creating the <svg> tag
                this.d3_svg = d3.select(element[0]).append('svg')
                this.d3_svg.attr(this.d3_size);

                // Create the 3 scales we need
                var min;
                var max;
                for (var i in predictions) if (predictions.hasOwnProperty(i)) {
                    var prediction = predictions[i];
                    var realisation_years = _.pluck(prediction.realisations, 'year_introduced');
                    // Check if there is the min or the max year
                    min = _.min([min, prediction.source.year_published, prediction.year_predicted].concat(realisation_years));
                    max = _.max([max, prediction.source.year_published, prediction.year_predicted].concat(realisation_years));
                }

                this.scales = [undefined, undefined, undefined];

                // If there are dates < 1900, we need a log scale before that
                if (min < 1900) {
                    this.scales[0] = new d3.scale.log();
                    this.scales[0].domain([min, 1900]);
                }

                // If there are dates > 2100, we need a log scale after that
                if (max > 2100) {
                    this.scales[2] = new d3.scale.log();
                    this.scales[2].domain([2100, max]);
                }

                // The middle scale is linear from 1900 to 2100
                this.scales[1] = new d3.scale.linear();
                this.scales[1].domain([1900, 2100]);
                this.scales[1].range([0, this.d3_size.width]);
            }

            scope.$watch('predictions', angular.bind(this, function(old_value, new_value) {
                if (new_value.length > 0) {
                    // Must flatten the array
                    var predictions = _.flatten(new_value);
                    this.init(predictions);
                }
            }));
        })
    }
});