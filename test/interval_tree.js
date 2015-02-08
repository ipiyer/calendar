/* jslint node:true */
"use strict";


var chai = require("chai"),
    path = require("path"),
    _ = require("underscore");

var PROJECTROOT = "../",
    IntervalTree = require(path.join(PROJECTROOT, "js", "interval_tree")).IntervalTree;


var expect = chai.expect;

var testIntervals = [{
    "id": 1,
    "start": 0,
    "end": 720
}, {
    "id": 2,
    "start": 60,
    "end": 180
}, {
    "id": 3,
    "start": 80,
    "end": 720
}, {
    "id": 4,
    "start": 85,
    "end": 240
}, {
    "id": 5,
    "start": 90,
    "end": 240
}, {
    "id": 6,
    "start": 120,
    "end": 720
}, {
    "id": 7,
    "start": 240,
    "end": 320
}, {
    "id": 8,
    "start": 300,
    "end": 380
}, {
    "id": 9,
    "start": 400,
    "end": 580
}];

describe("IntervalTree ", function() {
    it("import should be a fn", function(done) {
        expect(IntervalTree).to.be.an('function');
        done();
    });

    it("instance should have search methods", function(done) {
        var iTree = new IntervalTree(testIntervals);
        var attributes = ["min", "max", "nodes", "subMax", "subMin", "left", "right", "pointSearch", "rangeSearch"];

        attributes.forEach(function(attribute) {
            expect(iTree).to.have.property(attribute);
        });

        done();
    });
});


describe("Test computed value", function() {
    it("should have the right values for attributes", function(done) {

        var iTree = new IntervalTree(testIntervals).right;
        expect(iTree.midPoint).to.equal(580);
        expect(iTree.min).to.equal(400);
        expect(iTree.max).to.equal(580);
        expect(iTree.nodes).to.deep.equal([{
            id: 9,
            start: 400,
            end: 580
        }]);

        done();

    });
});

describe("Median", function() {
    it("should find the midPoint of the interval", function(done) {

        var midPoint = IntervalTree.prototype._median(testIntervals);
        expect(midPoint).to.deep.equal({
            id: 5,
            start: 90,
            end: 240
        });

        done();

    });
});


describe("RangeSearch", function() {
    var iTree = new IntervalTree(testIntervals);

    it("should return intervals in given range", function(done) {
        var matchingIntervals = iTree.rangeSearch(60, 180);
        var correctIntervalIds = [1, 3, 6, 4, 5, 2];

        matchingIntervals = _.map(matchingIntervals, function(interval) {
            return interval.id;
        });

        expect(_.difference(correctIntervalIds, matchingIntervals)).to.have.length(0);
        done();
    });

    it("entire range should include all the intervals", function() {
        var matchingIntervals = _.sortBy(iTree.rangeSearch(0, 720), function(interval) {
            return interval.id
        });
        expect(matchingIntervals).to.deep.equal(testIntervals);
    });

    it("no intersecting range should return empty array", function() {
        var matchingIntervals = iTree.rangeSearch(720, 1000);
        expect(matchingIntervals).to.be.an.Array;
        expect(matchingIntervals).to.be.empty;
    });
});

describe("Intersection", function() {
    it("should intersect", function() {
        expect(IntervalTree.prototype._doesItIntersect({
            start: 0,
            end: 720
        }, 40, 200)).to.be.ok();
        expect(IntervalTree.prototype._doesItIntersect({
            start: 250,
            end: 360
        }, 0, 720)).to.be.ok();
        expect(IntervalTree.prototype._doesItIntersect({
            start: 250,
            end: 360
        }, 270, 400)).to.be.ok();
        expect(IntervalTree.prototype._doesItIntersect({
            start: 250,
            end: 360
        }, 200, 260)).to.be.ok();

    });

    it("shouldn't intersect", function() {
        expect(IntervalTree.prototype._doesItIntersect({
            start: 400,
            end: 500
        }, 500, 600)).to.not.be.ok();
        expect(IntervalTree.prototype._doesItIntersect({
            start: 400,
            end: 500
        }, 200, 300)).to.not.be.ok();
    });
});

describe("PointSearch", function() {
    var iTree = new IntervalTree(testIntervals);
    it("should match the intersecting points", function() {
        var matchingIntervals = iTree.pointSearch(120);
        var correctIntervalIds = [2, 5, 4, 6, 3, 1];

        matchingIntervals = _.map(matchingIntervals, function(interval) {
            return interval.id;
        });

        expect(_.difference(correctIntervalIds, matchingIntervals)).to.have.length(0);
    });
});