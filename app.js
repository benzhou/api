var express = require('express');
var app = express();
var accountBiz = require('./business/accounts.js');

// Config

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname, "public"));
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, 'Something broke!');
    });
});

app.get('/api/LoadAccount', function(req, res){
    var resData = {
        success : 0,
        errCode : 0,
        errMsg : '',
        data : {}
    };

    accountBiz.loadAccount('XYZ').then(function(data){
        console.log('app js, app.get => /api/LoadAccount, loadAccount successful.');
        console.log(data);
        resData.success = 1;
        resData.data = data;
    }).fail(function(err){
        console.log('app js, app.get => /api/LoadAccount, loadAccount failed.');
        console.log(err);
        resData.errCode = 501;
        resData.errMeg = 'Some error happened';
        data.errObj = err;
    });

    var strResData = JSON.stringify(resData);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', strResData.length);
    res.end(strResData);
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