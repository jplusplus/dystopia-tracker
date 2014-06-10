angular.module('dystopia-tracker').directive('timeline', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class=\'timeline\'></div>',
        link: angular.bind({}, function($scope, element, attrs) {
            this.d3_svg_padding = {
                left : 50,
                top : 10,
                right : 50,
                bottom : 10
            };

            this.d3_line_height = 20;
            this.d3_node_size = 10;

            this.init = function(editorspicks, predictions) {
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

                // Create all the nodes
                this.createAllNodes(editorspicks, predictions);
            };

            this.createAllNodes = function(editorspicks, predictions) {
                var line = 0;

                for (var i in editorspicks) if (editorspicks.hasOwnProperty(i)) {
                    var editorspick = editorspicks[i];
                    this.placeLine(editorspick, line);
                    ++line;
                }

                for (var i in predictions) if (predictions.hasOwnProperty(i)) {
                    var prediction = predictions[i];
                    this.placeLine(prediction, line);
                    ++line;
                }
            };

            this.placeLine = function(prediction, line) {
                var d3_line_container = this.d3_svg.append("svg:g");
                d3_line_container.attr({class : 'color-' + prediction.category.color});
                this.placePoint(prediction, line, d3_line_container);
                this.placePoint(prediction.source, line, d3_line_container);
                for (var i in prediction.realisations) if (prediction.realisations.hasOwnProperty(i)) {
                    this.placePoint(prediction.realisations[i], line, d3_line_container);
                }
            };

            this.placePoint = function(datum, line, d3_container) {
                var x, y, year;
                var base_y = this.d3_svg_padding.top + 40;
                var circle = (datum.year_introduced != null) ? true : false;
                d3_container = d3_container || this.d3_svg;

                year = datum.year_predicted || datum.year_published || datum.year_introduced;
                if (year == null) return;
                if (year < 1900) {
                    x = this.d3_scales[0](year);
                } else if (year > 2100) {
                    x = this.d3_scales[2](year);
                } else {
                    x = this.d3_scales[1](year);
                }
                y = base_y + line * this.d3_line_height;

                if (circle) {
                    d3_container.append('svg:circle').attr({
                        cx : x,
                        cy : y,
                        r : this.d3_node_size / 2
                    });
                } else {
                    d3_container.append('svg:rect').attr({
                        x : x - (this.d3_node_size / 2),
                        y : y - (this.d3_node_size / 2),
                        width : this.d3_node_size,
                        height : this.d3_node_size
                    });
                }
            };

            $scope.$watch(function() { return $scope.predictions }, angular.bind(this, function(new_value, old_value) {
                var editorspicks = $scope.editorspicks || [];
                var predictions = $scope.predictions || [];
                if (predictions.length > 0 || editorspicks.length > 0) {
                    if (this.d3_svg != null) {
                        this.d3_svg.remove();
                    }
                    // Must flatten the predictions
                    this.init(editorspicks, _.flatten(predictions));
                }
            }), true);
        })
    }
});