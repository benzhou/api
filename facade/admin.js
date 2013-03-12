var accountBiz = require('../business/accounts.js'),
    authBiz = require('../business/auth.js'),
    constants = require('../constants.js'),
    utils = require('utils');


var adminFacade = module.exports = (function(){

    var q = require('q');
    /*
    * Description: This is a private method that meant to be facilitate the auth call to the biz logic.
    * */
    var _authCaller = function(apiKey, methodName, tenantId, timestamp, nonce, extra, sig, debug){
        var deferred = q.defer();

        if(debug){
            deferred.resolve({
                validSig: true,
                hash: "debugging",
                sig : "debugging"});
        }else{
            authBiz.authApiCall(apiKey, methodName, tenantId, timestamp, nonce, extra, sig).then(function(data){
                deferred.resolve(data);
            }, function(err){
                deferred.reject(err);
            });
        }

        return deferred.promise;
    };

    var loadAccount = function(req, res){
        var resData = {
                success : false,
                errCode : constants.errCodes.noError.code,
                errMsg : '',
                data : {}
            },
            apiKey = req.query.apiKey,
            key = req.params.key,
            tenantId = req.query.tid,
            timestamp = req.query.ts,
            nonce = req.query.nonce,
            sig = req.query.sig,
            debug = true;

        //Check if required params presented in the request.
        if(!debug && (!key || !apiKey || !tenantId || !timestamp || !nonce || !sig)){
            resData.errCode = constants.errCodes.missParam.code;
            resData.errMeg = constants.errCodes.missParam.msg;
        }

        //if any error codes already been assigned, then return the error response directly.
        if(resData.errCode !== constants.errCodes.noError.code){
            res.send(JSON.stringify(resData));
            return;
        }

        //Verify permission here:
        //put the extra plain text together.
        var extra = utils.format("%s",key);
        var authPromise =_authCaller(apiKey, 'loadAccount', tenantId, timestamp, nonce, extra, sig, debug);

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
            resData.errCode = (err.errType === constants.errTypes.system? constants.errCodes.sysError.code:err.errCode);
            resData.errMeg = (err.errType === constants.errTypes.system? constants.errCodes.sysError.msg:err.errMeg);

            var strResData = JSON.stringify(resData);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Length', strResData.length);
            res.end(strResData);
        });
    };

    return {
        loadAccount : loadAccount
    };
})();