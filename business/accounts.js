var data_account = require('../data/accounts.js');

var accountBiz = module.exports = function(){

    var addNewAccount = function(apiKey, apiSecret, permissions){
        console.log("add new account biz called.");
        var q = require('q');
            deferred = q.defer();

            data_account.loadAccount(apiKey).then(function(data){
                console.log('account biz -addNewAccount: loadAccount then callback.');
                console.log('data returned from then');
                console.log(data);

                if(data == null){
                    console.log('data == null, cannot find existing account, continue to add it.');
                    data_account.addNewAccount(apiKey, apiSecret, permissions).then(function(data){
                        console.log('account biz -addNewAccount: successfully added the new account.');
                        console.log(data);
                        deferred.resolve(data);
                    }).fail(function(err){
                        console.log('account biz -addNewAccount: fail to add the new account');
                        console.log(err);
                        deferred.reject(err);
                    });
                }else{
                    console.log('account biz -addNewAccount: data != null, same apiKey already exits in account collection.');
                    deferred.reject(deferred.reject({
                        errType: constants.errTypes.client,
                        errCode: constants.errCodes.accountAlreadyExists.code,
                        msg: util.format('Cannot find account info my provided apiKey: %s', apiKey),
                        errObj: null}));
                }
            });

        return deferred.promise;
    },
        loadAccount = function(apiKey){
            console.log("account biz : load account method called.");
            var q = require('q');
                deferred = q.defer();

            data_account.loadAccount(apiKey).then(function(data){
                if(data === null){
                    deferred.reject({
                        errType: constants.errTypes.client,
                        errCode: constants.errCodes.invalidApiAcct.code,
                        msg: util.format('Cannot find account info my provided apiKey: %s', apiKey),
                        errObj: null});
                }else{
                    deferred.resolve(data);
                }
            },function(err){
                deferred.reject(err);
            });

            return deferred.promise;
        };

    return {
        addNewAccount : addNewAccount,
        loadAccount : loadAccount
    }
}();
