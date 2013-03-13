var express = require('express');
var app = express();
var accountBiz = require('./business/accounts.js'),
    adminFacade = require('./facade/admin.js');

// Config
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname, "public"));
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(function(err, req, res, next){
        console.log("=====================================================");
        console.log(util.format("Error captured by err handler *Middleware* -- %s:", (new Date()).toUTCString()));
        console.log("=====================================================");
        console.error(err.stack);
        console.log("=====================================================");
        var resData = {
            success : false,
            errCode : 500,
            errMsg : 'Unknown system error.'
        };
        res.send(500, JSON.stringify(resData));
    });
});

/*
* Description: Admin API section
* */
app.get('/api/admin/account/:key?', adminFacade.loadAccount);
app.post('/api/admin/account', adminFacade.upsertAccount);

/////////////////////////////////////////
//Node process Error Handling functions//
/////////////////////////////////////////
process.on('uncaughtException', function (err) {
    console.log("=====================================================");
    console.log(util.format("Error captured by err handler *process uncaughtException* -- %s:", (new Date()).toUTCString()));
    console.log("=====================================================");
    console.error(err.stack);
    console.log("=====================================================");
});

app.listen(3000);
console.log('Listening on port 3000');