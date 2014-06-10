angular.module('dystopia-tracker').directive('timeline', ['$window', '$timeout', function($window, $timeout) {
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

            this.d3_base_y = this.d3_svg_padding.top + 40;
            this.d3_line_height = 20;
            this.d3_node_size = 10;

            this.init = function(editorspicks, predictions) {
                var height = this.d3_base_y + this.d3_svg_padding.bottom + this.d3_line_height * (editorspicks.length + predictions.length);

                this.d3_size = {
                    width : element.width(),
                    height : height
                };

                // Reorder both arrays by Category
                editorspicks = _.sortBy(editorspicks, function(o) { return o.category.id; });
                predictions = _.sortBy(predictions, function(o) { return o.category.id; });

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
                d3_line_container.attr({class : 'line color-' + prediction.category.color});
                var xs = [];
                xs.push(this.placePoint(prediction, line, d3_line_container));
                xs.push(this.placePoint(prediction.source, line, d3_line_container));
                for (var i in prediction.realisations) if (prediction.realisations.hasOwnProperty(i)) {
                    xs.push(this.placePoint(prediction.realisations[i], line, d3_line_container));
                }
                var x1 = _.min(xs);
                var x2 = _.max(xs);
                var y = this.d3_svg_padding.top + 40 + line * this.d3_line_height;
                d3_line_container.append('svg:line').attr({
                    x1 : x1,
                    x2 : x2,
                    y1 : y,
                    y2 : y
                });
            };

            this.placePoint = function(datum, line, d3_container) {
                var x, y, year, point;
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
                y = this.d3_base_y + line * this.d3_line_height;

                if (circle) {
                    point = d3_container.append('svg:circle').attr({
                        cx : x,
                        cy : y,
                        r : this.d3_node_size / 2
                    });
                } else {
                    point = d3_container.append('svg:rect').attr({
                        x : x - this.d3_node_size / 2,
                        y : y - this.d3_node_size / 2,
                        width : this.d3_node_size,
                        height : this.d3_node_size
                    });
                }

                point.on('click', function(that) {
                    return function() {
                        that.select(this);
                    };
                }(this));

                return x;
            };

            this.select = function(target) {
                var target_g = d3.select(target.parentNode);
                var target_line = target_g.select('line');
                var gs = this.d3_svg.selectAll('g.line');
                var lines = this.d3_svg.selectAll('line');

                if (target_line.classed('visible')) {
                    gs.classed('faded', false);
                    target_line.classed('visible', false);
                } else {
                    gs.classed('faded', true);
                    target_g.classed('faded', false);
                    lines.classed('visible', false);
                    target_line.classed('visible', true);
                }
            };

            this.on_resize = function() {
                var ret = function() {
                    this.on_data_changed();
                };
                ret.timer = undefined;
                return ret;
            }();

            this.on_data_changed = function() {
                var editorspicks = $scope.editorspicks || [];
                var predictions = $scope.predictions || [];
                if (predictions.length > 0 || editorspicks.length > 0) {
                    if (this.d3_svg != null) {
                        this.d3_svg.remove();
                    }
                    // Must flatten the predictions
                    this.init(editorspicks, _.flatten(predictions));
                }
            }

            $scope.$watch(function() { return $scope.predictions }, angular.bind(this, this.on_data_changed), true);

            angular.element($window).bind('resize', angular.bind(this, function() {
                $timeout.cancel(this.on_resize.timer);
                this.on_resize.timer = $timeout(angular.bind(this, this.on_resize), 200);
            }));
        })
    };
}]);