$(function() {
    "use strict";

    function hereDoc(f) {
        return f.toString().
        replace(/^[^\/]+\/\*!?/, '').
        replace(/\*\/[^\/]+$/, '');
    }

    var eventModel = Backbone.Model.extend({
        getStyles: function() {
            var that = this;

            return {
                id: that.get("id"),
                width: that.get("width") + "px",
                left: that.get("left") + "px",
                top: that.get("start"),
                height: that.get("end") - that.get("start")
            };
        }
    });

    var eventsCollection = Backbone.Collection.extend({
        model: eventModel
    });

    var eventTemplate = _.template(hereDoc(function() {
        /*<div class="wrap"> 
             <div class="title">Sample Item</div> 
              <div class="location">Sample Location</div> 
              <div class="desc">id:<%= id %>start:<%= start %>end:<%= end %></div>
           </div>
        */
    }));

    var eventView = Backbone.View.extend({
        tagName: "div",
        className: "event",
        template: eventTemplate,
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON())).css(this.model.getStyles());
            return this;
        }
    });

    var eventsView = Backbone.View.extend({
        tagName: "div",
        className: "events",
        render: function() {
            this.collection.each(function(item) {
                var view = new eventView({
                    model: item
                });

                this.$el.append(view.render().el);

            }, this);

            return this;
        }
    });



    var data = [{
        "id": 1,
        "start": 0,
        "end": 720
    }, {
        "id": 2,
        "start": 30,
        "end": 150
    }, {
        "id": 3,
        "start": 540,
        "end": 600
    }, {
        "id": 4,
        "start": 560,
        "end": 620
    }, {
        "id": 5,
        "start": 610,
        "end": 670
    }];

    var eventsColInst = new eventsCollection();

    var appView = Backbone.View.extend({
        collection: eventsColInst,
        el: $("body"),
        events: {
            "click #btn-render": "getData"
        },
        processData: function(data) {
            return positionEvents(data).init();
        },
        getData: function(data) {
            data = _.isArray(data) ? data : $("#input-data").val();

            if (_.isString(data)) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    window.alert("Input only strict JSON");
                }
            }

            data = this.processData(data);
            this.render(data);
        },

        render: function(data) {
            var that = this;
            this.collection.reset(data);

            var view = new eventsView({
                collection: that.collection
            });

            $("#events-list").html(view.render().el);
        }
    });

    var app = new appView();

    window.layOutDay = function(events) {
        app.getData(events);
    }

    window.layOutDay([{
        "start": 0,
        "end": 150
    }, {
        "start": 540,
        "end": 600
    }, {
        "start": 560,
        "end": 620
    }, {
        "start": 610,
        "end": 670
    }]);

});