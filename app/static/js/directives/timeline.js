angular.module('dystopia-tracker').directive('timeline', ['$window', '$timeout', '$filter', '$location',
                                                          function($window, $timeout, $filter, $location) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class=\'timeline\'><svg class="axis" stickToTop></svg><svg class="content"></svg></div>',
        link: angular.bind({}, function($scope, element, attrs) {
            // Helper to change url
            $scope.go_to = function(url) {
                $scope.$apply(function() {
                    $location.url(url);
                });
            };

            this.d3_svg_padding = {
                left : 50,
                top : 10,
                right : 50,
                bottom : 10
            };

            this.d3_node_size = 3;
            this.d3_base_y = this.d3_svg_padding.top + (this.d3_node_size / 2);
            this.d3_line_height = this.d3_node_size * 1.5;

            this.init = function(predictions) {
                this._i = 0;

                this.d3_node_size = _.max([3, 30 / _.max([1, predictions.length / 10])]);
                this.d3_base_y = this.d3_svg_padding.top + (this.d3_node_size / 2);
                this.d3_line_height = this.d3_node_size * 1.5;

                var height = this.d3_base_y + this.d3_svg_padding.bottom + this.d3_line_height * predictions.length + 193;

                this.d3_size = {
                    width : element.width(),
                    height : height
                };

                // Creating the axis <svg> tag
                this.d3_axis_svg = d3.select(angular.element(element[0]).find('svg.axis')[0]).attr({
                    width : this.d3_size.width,
                    height : 30
                });

                // Creating the main <svg> tag
                this.d3_svg = d3.select(angular.element(element[0]).find('svg.content')[0]).attr(this.d3_size).style('margin-top', '-6px');

                // Create an empty <rect> which will catch clicks outside nodes
                this.d3_background = this.d3_svg.append('svg:rect').attr({
                    x : 0,
                    y : 0,
                    width : this.d3_size.width,
                    height : this.d3_size.height,
                    fill : 'rgba(0,0,0,0)'
                });
                this.d3_background.on('click', angular.bind(this, this.hide_all));

                // Reorder array by category, editor's picks first in each category
                predictions = _.sortBy(predictions, function(o) { return (o.editors_pick) ? 0 : 1; });
                predictions = _.sortBy(predictions, function(o) { return o.category.id; });

                // Create the 3 scales we need
                var min, max, nodisplay = 0;
                var all_categories = [];
                for (var i in predictions) if (predictions.hasOwnProperty(i)) {
                    var prediction = predictions[i];

                    all_categories[prediction.category.color] = prediction.category['title_' + $scope.language];

                    if (prediction.year_predicted === 0 && prediction.realisations.length === 0) {
                        prediction.nodisplay = true;
                        ++nodisplay;
                        continue;
                    }
                    var realisation_years = _.pluck(prediction.realisations, 'year_introduced');
                    // Check if there is the min or the max year
                    min = _.min(_.reject([min, prediction.source.year_published, prediction.year_predicted].concat(realisation_years), _.partial(_.isEqual, 0)));
                    max = _.max(_.reject([max, prediction.source.year_published, prediction.year_predicted].concat(realisation_years), _.partial(_.isEqual, 0)));
                }

                this.d3_size.height -= nodisplay * this.d3_line_height;
                this.d3_svg.attr('height', this.d3_size.height);

                if (predictions.length - nodisplay > 0) {
                    $scope.noContent = false;
                } else {
                    $scope.noContent = true;
                }

                this.d3_scales = [undefined, undefined, undefined];
                var linear_range = [this.d3_svg_padding.left, this.d3_size.width - this.d3_svg_padding.right];
                var linear_domain = [1900, 2100];

                var ten_percent = (linear_range[1] - linear_range[0]) * 5 / 100;
                // If there are dates < 1900, we need a log scale before that
                if (min < linear_domain[0]) {
                    this.d3_scales[0] = new d3.scale.sqrt();
                    this.d3_scales[0].domain([min, 1900]);
                    this.d3_scales[0].range([linear_range[0], linear_range[0] + ten_percent]);
                    linear_range[0] += ten_percent;
                } else {
                    linear_domain[0] = min - 10 || linear_domain[0];
                }

                // If there are dates > 2100, we need a log scale after that
                if (max > linear_domain[1]) {
                    this.d3_scales[2] = new d3.scale.pow();
                    this.d3_scales[2].domain([2100, max]);
                    this.d3_scales[2].range([linear_range[1] - ten_percent, linear_range[1]]);
                    linear_range[1] -= ten_percent;
                } else {
                    linear_domain[1] = max + 10 || linear_domain[1];
                }

                // The middle scale is linear from 1900 to 2100
                this.d3_scales[1] = new d3.scale.linear();
                this.d3_scales[1].domain(linear_domain);
                this.d3_scales[1].range(linear_range);

                // Create the axis
                this.d3_axis = [undefined, undefined, undefined];
                for (var i in this.d3_scales) if (this.d3_scales.hasOwnProperty(i) && this.d3_scales[i] != null) {
                    var d3_axis_container = this.d3_axis_svg.append('svg:g');
                    d3_axis_container.attr({
                        class : 'axis axis-' + i,
                        transform: 'translate(0, 29)'
                    });

                    var axis = new d3.svg.axis().tickFormat(function(d) { return d; }).orient('top');
                    axis.scale(this.d3_scales[i]);
                    if (i != 1) {
                        axis.tickValues((linear_range[1] - linear_range[0] <= 300) ? [] : this.d3_scales[i].domain());
                    } else {
                        if (linear_range[1] - linear_range[0] <= 300) {
                            axis.ticks(5);
                        }
                    }

                    d3_axis_container.call(axis);
                    this.d3_axis[i] = axis;
                }

                this.d3_tooltip_path_container = this.d3_svg.append('svg:g').classed({'last' : true, 'tooltips_path' : true});
                this.d3_tooltip_body_container = this.d3_svg.append('svg:g').classed({'last' : true, 'tooltips_body' : true});

                // Create all the nodes
                this._line = 0;
                this.createAllNodes(predictions);

                // Create all the category icons
                // (Remove the if to always show the icons)
                if ($scope.filters.category === '' && $scope.filters.source__type === '' &&
                    $scope.filters.title === '') {
                    this.createAllIcons(all_categories);
                }

                // Create something highlighting the current year
                this.d3_svg.insert('svg:rect', ':first-child').attr({
                    width: 6,
                    height: (this.d3_size.height - 193) + 'px',
                    y: -6,
                    x: this.d3_scales[1](new Date().getFullYear()) - 3
                }).classed('current-year', true);

                $scope.spinner = false;
            };

            this.createAllNodes = function(predictions) {
                for (var i in predictions) if (predictions.hasOwnProperty(i)) {
                    var prediction = predictions[i];
                    if (prediction.nodisplay) continue;
                    this.placeLine(prediction, this._line);
                    ++this._line;
                }
            };

            this.createAllIcons = function(all_categories) {
                var icon_size = 30;
                _.each(_.range(1, 9), angular.bind(this, function(category_id) {
                    var category_classname = 'color-' + category_id
                    var category_lines = this.d3_svg.selectAll('g.line.' + category_classname)[0];
                    if (category_lines.length > 0) {
                        var first_y = d3.select(_.first(category_lines)).select('line').attr('y1');
                        var last_y = d3.select(_.last(category_lines)).select('line').attr('y1');
                        var center_y = last_y - ((last_y - first_y) / 2);
                        var group = this.d3_svg.append('svg:g').classed('category-icon', true);
                        var x = parseInt((this.d3_svg_padding.left / 2) - (icon_size / 2));
                        var y = parseInt(center_y - (icon_size / 2));
                        group.append('svg:rect').attr({
                            width : icon_size,
                            height : icon_size,
                            x : x,
                            y : y,
                            'class' : category_classname + ' category-icon category-button'
                        });
                        var ratio = 20;
                        group.append('svg:image').attr({
                            width : icon_size - (icon_size / ratio),
                            height : icon_size - (icon_size / ratio),
                            x : x + (icon_size / ratio) / 2,
                            y : y + (icon_size / ratio) / 2,
                            'xlink:href' : window.STATIC_URL + 'img/category-icon-' + category_id + '.svg'
                        }).on('click', function() {
                            var visible = d3.select(this.parentNode).select('rect.category-icon-text').classed('visible');
                            d3.selectAll('.category-icon-text.visible').classed('visible', false);
                            if (!visible) {
                                d3.select(this.parentNode).selectAll('.category-icon-text').classed('visible', true);
                            }
                        });
                        var text = group.append('svg:text').attr({
                            x : x + icon_size + 5,
                            y : y + (icon_size / 2) + 6,
                            'class' : 'category-icon-text'
                        }).text(all_categories[category_id]);
                        group.insert('svg:rect', 'text').attr({
                            x : x + icon_size,
                            y : y,
                            height : icon_size,
                            width: 10 + (text[0][0].getBBox().width),
                            'class': category_classname + ' category-icon category-icon-text'
                        });
                    }
                }));
            };

            this.placeLine = function(prediction, line) {
                var d3_line_container = this.d3_svg.insert("svg:g", 'g.last');
                d3_line_container.attr({class : 'line color-' + prediction.category.color});
                var xs = [];
                var url = '/' + [$scope.language, 'p', $filter('slugify')(prediction.source.author),
                                 $filter('slugify')($filter('getTranslated')(prediction.source, 'title')), prediction.id].join('/');
                prediction.source.category = prediction.category;
                xs.push(this.placePoint(prediction, line, d3_line_container, this.create_prediction_tooltip_content(prediction)));
                xs.push(this.placePoint(prediction.source, line, d3_line_container, this.create_source_tooltip_content(prediction, url)));
                for (var i in prediction.realisations) if (prediction.realisations.hasOwnProperty(i)) {
                    var realisation = prediction.realisations[i]
                    xs.push(this.placePoint(realisation, line, d3_line_container, this.create_realisation_tooltip_content(realisation, url)));
                }
                var x1 = _.min(xs);
                var x2 = _.max(xs);
                var y = this.d3_base_y + line * this.d3_line_height;
                d3_line_container.insert('svg:line', ':first-child').attr({
                    x1 : x1,
                    x2 : x2,
                    y1 : y,
                    y2 : y
                });
            };

            this.placePoint = function(datum, line, d3_container, tooltip_content) {
                var x, y, year, point, text;
                var square = (datum.year_published != null) ? true : false;
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

                var _point;
                if (square) {
                    point = d3_container.append('svg:rect').attr({
                        x : x - this.d3_node_size / 2,
                        y : y - this.d3_node_size / 2,
                        width : this.d3_node_size,
                        height : this.d3_node_size
                    }).classed('node-' + this._i, true);

                    if (this.d3_node_size > 10) {
                        _point = point;
                        point = d3_container.append('svg:image').attr({
                            width : this.d3_node_size,
                            height : this.d3_node_size,
                            x : x - this.d3_node_size / 2,
                            y : y - this.d3_node_size / 2,
                            'xlink:href' : window.STATIC_URL + 'img/category-icon-' + datum.category.color + '.svg'
                        });
                    }

                    text = datum['title_' + $scope.language] + ' - ' + datum['author'];
                } else {
                    point = d3_container.append('svg:circle').attr({
                        cx : x,
                        cy : y,
                        r : this.d3_node_size / 2
                    }).classed('node-' + this._i, true);
                }

                _point = (_point != null) ? _point : point;

                if (tooltip_content != null) {
                    this.appendTooltip(tooltip_content, x, y);
                }

                point.on('click', function(that) {
                    return function() {
                        that.select(_point[0][0]);
                    };
                }(this));

                point.on('mouseenter', function() {
                    d3.select(_point[0][0]).classed('hover', true);
                });

                point.on('mouseleave', function() {
                    d3.select(_point[0][0]).classed('hover', false);
                });

                ++this._i;

                return x;
            };

            this.appendTooltip = function(tooltip_content, x, y) {
                var actual_x = (x > (this.d3_size.width / 3) * 2) ? x - 200 : x;
                // Insert text
                // We set the foreignobject height to 100% and will change its size to the actual content size afterward
                d3_foreign_body = this.d3_tooltip_body_container.append('svg:foreignObject').attr({
                    width : '200px',
                    height : '100%',
                    x : actual_x,
                    y : y + 15
                }).classed('node-' + this._i, true).append('xhtml:body').html("<p>" + tooltip_content.text + "</p>");

                if (tooltip_content.url != null) {
                    var a = d3_foreign_body.append('xhtml:a').text($filter('translate')('more on DT'));
                    a.on('click', function() {
                        $scope.go_to(tooltip_content.url);
                    });
                }

                this.d3_tooltip_body_container.select('.node-' + this._i).attr('height', d3_foreign_body[0][0].clientHeight);

                var h = d3_foreign_body[0][0].clientHeight + 15;

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

            this.create_tooltip_content = function(text, url) {
                return { text : text, url : url };
            };

            this.create_source_tooltip_content = function(datum, url) {
                var other_language = ($scope.language === 'E') ? 'D' : 'E';
                var text = '<small>' + datum.source.year_published + '</small><br />';
                if (datum['headline_' + $scope.language].length > 0) {
                    text += datum['headline_' + $scope.language];
                } else {
                    var desc = (datum['description_' + $scope.language] !== '') ? datum['description_' + $scope.language]
                                                                                : datum['description_' + other_language];
                    if (desc.length > 100) {
                        text += $filter('limitTo')(desc, 100) + '...';
                    } else {
                        text += desc;
                    }
                }
                text += '<br /><small>' + datum.source['title_' + $scope.language] + ' ' + $filter('translate')('by') +
                        ' ' + datum.source.author + '</small>';
                return this.create_tooltip_content(text, url);
            };

            this.create_prediction_tooltip_content = function(datum) {
                text = '<small>' + datum.year_predicted + '</small><br />' +
                       $filter('translate')("Predicted year of realisation in the story") + '.';
                return this.create_tooltip_content(text);
            };

            this.create_realisation_tooltip_content = function(datum, url) {
                var other_language = ($scope.language === 'E') ? 'D' : 'E';
                var text = '<small>' + datum.year_introduced + '</small>';
                text += '<br />';
                var desc = (datum['description_' + $scope.language] !== '') ? datum['description_' + $scope.language]
                                                                            : datum['description_' + other_language];
                if (desc.length > 100) {
                    text += $filter('limitTo')(desc, 100) + '...';
                } else {
                    text += desc;
                }
                return this.create_tooltip_content(text, url);
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
                if (this.d3_axis_svg != null) this.d3_axis_svg.selectAll('*').remove();
                if (this.d3_svg != null) this.d3_svg.selectAll('*').remove();
            };

            this.on_data_changed = function() {
                var predictions = $scope.predictions || [];
                if (!$scope.hideMoreButton && predictions.length > 0) return
                this.delete();
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