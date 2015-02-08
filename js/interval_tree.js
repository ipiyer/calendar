(function(root, factory) {
    "use strict";

    // Set up interval tree appropriately for the environment. Start with AMD.
    // 
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'exports'], function(_, exports) {

            root.IntervalTree = factory(root, exports, _);

        });

    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        factory(root, exports, _);

    } else {
        root.IntervalTree = factory(root, {}, root._);
    }


}(this, function(root, global, _) {
    "use strict";
    var IntervalTree;

    IntervalTree = function(intervals) {
        var midPoint = this.midPoint = this._median(intervals.map(function(i) {
            return i.end;
        }));
        this.nodes = intervals.filter(function(i) {
            return i.start <= midPoint && i.end >= midPoint;
        });
        this.min = Math.min.apply(Math, this.nodes.map(function(i) {
            return i.start;
        }));
        this.max = Math.max.apply(Math, this.nodes.map(function(i) {
            return i.end;
        }));
        this.subMin = Math.min.apply(Math, intervals.map(function(i) {
            return i.start;
        }));
        this.subMax = Math.max.apply(Math, intervals.map(function(i) {
            return i.end;
        }));
        var leftNodes = intervals.filter(function(i) {
            return i.end < midPoint;
        });
        var rightNodes = intervals.filter(function(i) {
            return i.start > midPoint;
        });

        if (leftNodes.length) this.left = new IntervalTree(leftNodes);
        if (rightNodes.length) this.right = new IntervalTree(rightNodes);
    };

    IntervalTree.prototype = {
        constructor: IntervalTree,
        pointSearch: function(point, intervals) {
            intervals || (intervals = []);

            if (point === this.midPoint) {

                intervals = _.union(intervals, this.nodes);

            } else if (point > this.midPoint) {

                intervals = _.union(intervals, _.filter(this.nodes, function(i) {
                    return i.end >= point;
                }));

                if (this.right) {
                    intervals = this.right.pointSearch(point, intervals);
                }

            } else if (point < this.midPoint) {

                this.nodes.forEach(function(i) {
                    if (i.start <= point) intervals.unshift(i);
                });

                if (this.left) {
                    intervals = this.left.pointSearch(point, intervals);
                }
            }

            return intervals;
        },
        _doesItIntersect: function(node, lo, hi) {
            // If any of the below case match its considered intersecting:
            // if node in between lo and hi or 
            // lo in between node or 
            // hi in between node

            return ((lo < node.start && node.start <= hi) || (lo < node.end && node.end <= hi) || (node.start < lo & lo < node.end) || (node.start < hi & hi < node.end));
        },
        rangeSearch: function(lo, hi, intervals) {
            intervals || (intervals = []);
            var that = this;

            var intersectWrap = function(node) {
                return that._doesItIntersect(node, lo, hi);
            };

            if (lo <= this.midPoint && this.midPoint <= hi) {
                intervals = _.union(intervals, _.filter(this.nodes, intersectWrap));

                if (this.right) {
                    intervals = this.right.rangeSearch(lo, hi, intervals);
                }

                if (this.left) {
                    intervals = this.left.rangeSearch(lo, hi, intervals);
                }

            } else if (hi === this.midPoint) {

                intervals = _.union(intervals, _.filter(this.nodes, intersectWrap));

            } else if (hi > this.midPoint) {

                intervals = _.union(intervals, _.filter(this.nodes, intersectWrap));

                if (this.right) intervals = this.right.rangeSearch(lo, hi, intervals);

            } else if (hi < this.midPoint) {
                intervals = _.union(intervals, _.filter(this.nodes, intersectWrap));

                if (this.left) intervals = this.left.rangeSearch(lo, hi, intervals);
            }

            return intervals;
        },
        _median: function(values) {
            var half = Math.floor(values.length / 2);

            values.sort(function(left, right) {
                return left - right;
            });

            if (values.length % 2) {
                return values[half];
            } else {
                return (values[half - 1] + values[half]) / 2.0;
            }
        }
    };

    global.IntervalTree = IntervalTree;

    return IntervalTree;
}));