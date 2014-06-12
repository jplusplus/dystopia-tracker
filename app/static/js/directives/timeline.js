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

            this.d3_base_y = this.d3_svg_padding.top;
            this.d3_line_height = 20;
            this.d3_node_size = 10;

            this.init = function(predictions) {
                this._i = 0;

                var height = this.d3_base_y + this.d3_svg_padding.bottom + this.d3_line_height * predictions.length + 200;

                this.d3_size = {
                    width : element.width(),
                    height : height
                };

                // Creating the axis <svg> tag
                this.d3_axis_svg = d3.select(element[0]).append('svg').attr({
                    width : this.d3_size.width,
                    height : 30
                });

                // Creating the main <svg> tag
                this.d3_svg = d3.select(element[0]).append('svg').attr(this.d3_size);

                // Create an empty <rect> which will catch clicks outside nodes
                this.d3_background = this.d3_svg.append('svg:rect').attr({
                    x : 0,
                    y : 0,
                    width : this.d3_size.width,
                    height : this.d3_size.height,
                    fill : 'rgba(0,0,0,0)'
                });
                this.d3_background.on('click', angular.bind(this, this.hide_all));

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
                    var d3_axis_container = this.d3_axis_svg.append('svg:g')
                    d3_axis_container.attr({
                        class : 'axis axis-' + i,
                        transform: 'translate(0, 1)'
                    });

                    var axis = new d3.svg.axis().tickFormat(function(d) { return d; });
                    axis.scale(this.d3_scales[i]);
                    if (i != 1) {
                        axis.tickValues(this.d3_scales[i].domain())
                    }

                    d3_axis_container.call(axis);
                    this.d3_axis[i] = axis;
                }

                this.d3_tooltip_path_container = this.d3_svg.append('svg:g').classed({'last' : true, 'tooltips_path' : true});
                this.d3_tooltip_body_container = this.d3_svg.append('svg:g').classed({'last' : true, 'tooltips_body' : true});

                // Create all the nodes
                this._line = 0;
                this.createAllNodes(predictions);
            };

            this.createAllNodes = function(predictions) {

                for (var i in predictions) if (predictions.hasOwnProperty(i)) {
                    var prediction = predictions[i];
                    this.placeLine(prediction, this._line);
                    ++this._line;
                }
            };

            this.placeLine = function(prediction, line) {
                var d3_line_container = this.d3_svg.insert("svg:g", 'g.last');
                d3_line_container.attr({class : 'line color-' + prediction.category.color});
                var xs = [];
                xs.push(this.placePoint(prediction, line, d3_line_container));
                xs.push(this.placePoint(prediction.source, line, d3_line_container));
                for (var i in prediction.realisations) if (prediction.realisations.hasOwnProperty(i)) {
                    xs.push(this.placePoint(prediction.realisations[i], line, d3_line_container));
                }
                var x1 = _.min(xs);
                var x2 = _.max(xs);
                var y = this.d3_base_y + line * this.d3_line_height;
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
                var text = datum['description_' + $scope.language];
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
                    }).classed('node-' + this._i, true);
                } else {
                    point = d3_container.append('svg:rect').attr({
                        x : x - this.d3_node_size / 2,
                        y : y - this.d3_node_size / 2,
                        width : this.d3_node_size,
                        height : this.d3_node_size
                    }).classed('node-' + this._i, true);
                    if (datum.year_predicted != null) text = datum['headline_' + $scope.language] || datum['description_' + $scope.language];
                }

                if (text != null && text.length > 0) {
                    this.appendTooltip(text, x, y);
                }

                point.on('click', function(that) {
                    return function() {
                        that.select(this);
                    };
                }(this));

                ++this._i;

                return x;
            };

            this.appendTooltip = function(text, x, y) {
                var actual_x = (x > (this.d3_size.width / 3) * 2) ? x - 200 : x;
                // Insert text
                // We set the foreignobject height to 100% and will change its size to the actual content size afterward
                d3_foreign_body = this.d3_tooltip_body_container.append('svg:foreignObject').attr({
                    width : '200px',
                    height : '100%',
                    x : actual_x,
                    y : y + 15
                }).classed('node-' + this._i, true).append('xhtml:body').html("<p>" + text + "</p>");
                this.d3_tooltip_body_container.select('.node-' + this._i).attr('height', d3_foreign_body[0][0].scrollHeight);

                var h = d3_foreign_body[0][0].scrollHeight + 15;

                var d;
                if (x === actual_x) {
                    d = 'M' + (x - 5) + ',' + (y + 10) +
                        'l 5, -8' +
                        'l 5, 8' +
                        'l 205, 0 ' +
                        'l 0, '+ h +' ' +
                        'l -220, 0 ' +
                        'l 0, -' + h + '' +
                        'l 5, 0';
                } else {
                    d = 'M' + (x + 5) + ',' + (y + 10) +
                        'l -5, -8' +
                        'l -5, 8' +
                        'l -205, 0 ' +
                        'l 0, '+ h +' ' +
                        'l 220, 0 ' +
                        'l 0, -' + h + '' +
                        'l -5, 0';
                };

                // Insert the path
                this.d3_tooltip_path_container.append('svg:path').attr({
                    d : d,
                }).classed('node-' + this._i, true);
            };

            this.select = function(target) {
                var target_g = d3.select(target.parentNode);
                target = d3.select(target);
                var target_line = target_g.select('line');
                var gs = this.d3_svg.selectAll('g.line');

                this.d3_tooltip_path_container.selectAll('*').classed('visible', false);
                this.d3_tooltip_body_container.selectAll('*').classed('visible', false);

                var was_visible = target.classed('visible');

                this.hide_all();

                if (!was_visible) {
                    target.classed('visible', true);
                    gs.classed('faded', true);
                    target_g.classed('faded', false);
                    target_line.classed('visible', true);
                    var classes = target.attr('class').split(' ');
                    for (var i in classes) if (classes.hasOwnProperty(i)) {
                        if (classes[i].indexOf('node-') === 0) {
                            this.d3_tooltip_path_container.select('.' + classes[i]).classed('visible', true);
                            this.d3_tooltip_body_container.select('.' + classes[i]).classed('visible', true);
                            break;
                        }
                    }
                }
            };

            this.hide_all = function() {
                var gs = this.d3_svg.selectAll('g.line');
                // Hide eveything
                this.d3_svg.selectAll('.visible').classed('visible', false);
                gs.classed('faded', false);
            };

            this.on_resize = function() {
                var ret = function() {
                    this.on_data_changed();
                };
                ret.timer = undefined;
                return ret;
            }();

            this.delete = function() {
                this.d3_axis_svg.remove();
                this.d3_svg.remove();
            };

            this.on_data_changed = function() {
                var predictions = $scope.predictions || [];
                if (this.d3_svg != null) {
                    this.delete();
                }
                // Must flatten the predictions
                this.init(_.flatten(predictions));
            }

            $scope.$watch(function() { return $scope.predictions }, angular.bind(this, this.on_data_changed), true);

            angular.element($window).bind('resize', angular.bind(this, function() {
                $timeout.cancel(this.on_resize.timer);
                this.on_resize.timer = $timeout(angular.bind(this, this.on_resize), 200);
            }));
        })
    };
}]);