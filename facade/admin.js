var accountBiz = require('../business/accounts.js'),
    authBiz = require('../business/auth.js');
    constants = require('../constants.js');


var adminFacade = module.exports = (function(){

    var q = require('q');
    /*
    * Description: This is a private method that meant to be facilitate the auth call to the biz logic.
    * */
    var _authCaller = function(apiKey, methodName, timestamp, nonce, extra, sig){
        var deferred = q.defer();

        authBiz.authApiCall(apiKey, methodName, timestamp, nonce, extra, sig).then(function(data){
            deferred.resolve(data);
        }, function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var loadAccount = function(req, res){
        var resData = {
                success : false,
                errCode : constants.errCodes.noError.code,
                errMsg : '',
                data : {}
            },
            key = req.params.key,
            apiKey = req.query.apiKey,
            timestamp = req.query.ts,
            nonce = req.query.nonce,
            sig = req.query.sig;

        if(!key || !apiKey || !timestamp || !nonce || !sig){
            resData.errCode = constants.errCodes.missParam.code;
            resData.errMeg = constants.errCodes.missParam.msg;
        }

        if(resData.errCode !== constants.errCodes.noError.code){
            res.send(JSON.stringify(resData));
            return;
        }

        //Verify permission here:
        //put the plainText together.
        var extra = utils.format("%s",key);
        var authPromise =_authCaller(apiKey, 'loadAccount', timestamp, nonce, extra, sig);

        q.when(authPromise, function(data){
            accountBiz.loadAccount(key).then(function(data){
                console.log('app js, app.get => /api/LoadAccount, loadAccount successful.');
                console.log(data);
                resData.success = true;
                resData.data = data;
            },function(err){
                console.log('app js, app.get => /api/LoadAccount, loadAccount failed.');
                console.log(err);
                resData.errCode = constants.errCodes.sysError.code;
                resData.errMeg = constants.errCodes.sysError.msg;;
                resData.errObj = err;
            }).then(function(){
                    var strResData = JSON.stringify(resData);
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Content-Length', strResData.length);
                    res.end(strResData);
                });
        }, function(err){

        });
    };

    return {
        loadAccount : loadAccount
    };
})();