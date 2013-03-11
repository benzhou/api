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

app.get('/api/AddNewAccount', function(req, res){
    var body = 'You result is:',
        isSucess = false;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    console.log("add new account called!");
    accountBiz.addNewAccount("XYZ", "XYZSECRET", []).then(function(d){
        console.log("success!");
        isSucess = true;
        res.end(body + isSucess);
    }).fail(function(e){
            console.log("failed!");
            res.end(body + isSucess);
        });
});

app.listen(3000);
console.log('Listening on port 3000');