var express = require('express');
var app = express();
var accountBiz = require('./business/accounts.js');

// Config

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname, "public"));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function(req, res){
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

app.post('/api/AddNewAccount', function(req, res){
//    var body = 'Hello World';
//    res.setHeader('Content-Type', 'text/plain');
//    res.setHeader('Content-Length', body.length);
//    res.end(body);
    accountBiz.addNewAccount("XYZ", "XYZSECRET", []);
});

app.listen(3000);
console.log('Listening on port 3000');