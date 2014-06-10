angular.module('dystopia-tracker').directive('timeline', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class=\'timeline\'></div>',
        scope: {
            predictions : '='
        },
        link: angular.bind({}, function(scope, element, attrs) {
            this.d3_svg_padding = {
                left : 50,
                top : 10,
                right : 50,
                bottom : 10
            };

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
                var min, max;
                for (var i in predictions) if (predictions.hasOwnProperty(i)) {
                    var prediction = predictions[i];
                    var realisation_years = _.pluck(prediction.realisations, 'year_introduced');
                    // Check if there is the min or the max year
                    min = _.min([min, prediction.source.year_published, prediction.year_predicted].concat(realisation_years));
                    max = _.max([max, prediction.source.year_published, prediction.year_predicted].concat(realisation_years));
                }
                console.debug(min, max);

                this.d3_scales = [undefined, undefined, undefined];
                var linear_range = [this.d3_svg_padding.left, this.d3_size.width - this.d3_svg_padding.right];

                // If there are dates < 1900, we need a log scale before that
                if (min < 1900) {
                    this.d3_scales[0] = new d3.scale.sqrt();
                    this.d3_scales[0].domain([min, 1900]);
                    this.d3_scales[0].range([linear_range[0], linear_range[0] + 100]);
                    linear_range[0] += 100;
                }

                // If there are dates > 2100, we need a log scale after that
                if (max > 2100) {
                    this.d3_scales[2] = new d3.scale.pow();
                    this.d3_scales[2].domain([2100, max]);
                    this.d3_scales[2].range([linear_range[1] - 100, linear_range[1]]);
                    linear_range[1] -= 100;
                }

                // The middle scale is linear from 1900 to 2100
                this.d3_scales[1] = new d3.scale.linear();
                this.d3_scales[1].domain([1900, 2100]);
                this.d3_scales[1].range(linear_range);

                // Create the axis
                this.d3_axis = [undefined, undefined, undefined];
                for (var i in this.d3_scales) if (this.d3_scales.hasOwnProperty(i) && this.d3_scales[i] != null) {
                    var d3_axis_container = this.d3_svg.append('svg:g')
                    d3_axis_container.attr({
                        class : 'axis',
                        transform: 'translate(0, 1)'
                    });

                    var axis = new d3.svg.axis();
                    axis.scale(this.d3_scales[i]);
                    if (i != 1) {
                        axis.tickValues(this.d3_scales[i].domain())
                    }

                    d3_axis_container.call(axis);
                    this.d3_axis[i] = axis;
                }
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