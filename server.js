    var express = require("express");
    var logfmt = require("logfmt");
    var app = express();
    var path = require("path");

    app.set('views', __dirname + '/views');

    app.use(logfmt.requestLogger());

    app.use(express.static(__dirname));
    app.get(/\/js/, express.static(__dirname + '/js'));
    app.get(/\/css/, express.static(__dirname + '/css'));
    app.get(/\/img/, express.static(__dirname + '/img'));



    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    var port = Number(process.env.PORT || 5000);
    app.listen(port, function() {
        console.log("Listening on " + port);
    });