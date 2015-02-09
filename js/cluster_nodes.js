(function(root, factory) {
    "use strict";

    // start with AMD.
    // 

    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'exports', 'IntervalTree'], function(_, exports) {

            root.positionEvents = factory(root, exports, _);

        });

    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var IntervalTree = require("./interval_tree");
        factory(root, exports, _, IntervalTree);

    } else {
        root.positionEvents = factory(root, {}, root._, root.IntervalTree);
    }


}(this, function(root, global, _, IntervalTree) {
    "use strict";

    var positionEvents = function(events, totalWidth) {



        totalWidth || (totalWidth = 600);

        events = _.map(events, function(event, indx) {
            event.id = indx + 1;
            return event;
        });



        var iTree = new IntervalTree(events);

        // Find overlapping events and add it to children attribute
        function findOverlappingEvent(event) {
            event.children = iTree.rangeSearch(event.start + 1, event.end - 1);
            return event;
        }

        function init() {

            // Add children;
            events = _.map(events, findOverlappingEvent);

            _.each(events, positionEvent);
            return events;
        }

        function positionEvent(event) {

            // find max overlapping event for a given event;
            // 
            // Example:
            // start point ____________             
            //             |           |___________  
            //  end point  |___________|           | 
            //                         |___________|
            //
            // at starting point overlaping is none and end point there is.
            //                

            var itemsAtStartingPoint = iTree.pointSearch(event.start + 1);
            var itemsAtEndPoint = iTree.pointSearch(event.end - 1);

            var overLappingEvents = itemsAtStartingPoint.length > itemsAtEndPoint.length ? itemsAtStartingPoint : itemsAtEndPoint;

            overLappingEvents = _.sortBy(overLappingEvents, function(event) {
                return event.id;
            });

            var width = getWidth(event, overLappingEvents);

            _.each(overLappingEvents, function(event) {
                if (!event.rendered) {
                    event.left = findHole(overLappingEvents, 0, 0);
                    event.width = width;
                    event.right = event.left + width;
                    event.rendered = true;
                }
            });

            return event;
        }

        function getWidth(event, overLappingEvents) {

            // to use the max width divide available space and split it across 
            // overlapping events.

            var renderedEvents = _.filter(overLappingEvents, {
                rendered: true
            });

            var renderedWidth = _.reduce(renderedEvents, function(memo, event) {
                return memo + event.width;
            }, 0);


            var width;

            // There are already some events in the level
            if (overLappingEvents.length && renderedEvents.length) {
                width = Math.floor((totalWidth - renderedWidth) / (overLappingEvents.length - renderedEvents.length));

            } else {
                // nothing is rendered yet;
                width = Math.floor(totalWidth / event.children.length);
            }

            return width;
        }

        function findHole(overLappingEvents, position, index) {
            // recursively scan from left 0 and find the next available free space. 

            position || (position = 0);
            index || (index = 0);

            var foundHole = true;

            _.some(overLappingEvents, function(oevent) {
                if (position === oevent.left) {
                    foundHole = false;
                    return false;
                }
            });

            if (position === totalWidth) {
                position = 0;
                foundHole = false;
            }

            if (foundHole) {
                return position;
            }

            return findHole(overLappingEvents, overLappingEvents[index].right, index + 1);
        }

        return {
            init: init,
            _findHole: findHole,
            _getWidth: getWidth,
            _positionEvent: positionEvent,
            _findOverlappingEvent: findOverlappingEvent
        };
    };

    global.positionEvents = positionEvents;
    return positionEvents;

}));