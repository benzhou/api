var crypto = require('crypto');
var data_account = require('../data/accounts.js');
var q = require('q');

var auth = module.exports = function(){

    var authApiCall = function(apiKey, methodName, timestamp, nonce, extra, sig){
        var deferred = q.defer();

        loadAccount(apiKey).then(function(data){
            console.log('auth biz -authApiCall: authApiCall then callback.');
            console.log('data returned from then');
            console.log(data);

            if(data == null){
                console.log('data == null, cannot find existing account, cannot verify');
                deferred.reject({
                    errType: constants.errTypes.client,
                    errCode: 1,
                    msg: util.format('Cannot find account info my provided apiKey: %s', apiKey),
                    errObj: null});
            }else{
                console.log('auth biz -authApiCall: data != null, now we have account data, start to calculate the hash.');
                console.log(data);
                var hash = crypto.createHmac('sha256', new Buffer(util.format("%s;%s;%s;%s;%s", apiKey, methodName, timestamp, nonce, extra), 'utf8')).update("text").digest('base64');
                console.log(util.format("result: %s", hash));
                console.log(util.format("sig: %s"),sig);
                var isSigMatchHash = (hash === sig);
                console.log(util.format("isSigMatchHash: %s"),isSigMatchHash);

                //When sig is matched, let's next to check if this API key is authorized to access the method
                !data.permissions || data.permissions.lengh
                deferred.resolve({
                    validSig: isSigMatchHash,
                    hash: hash,
                    sig : sig});
            }
        }, function(err){
            console.log('auth biz -authApiCall: authApiCall then fail callback.');
            deferred.reject(err);
        });

        return deferred.promise;
    };

    return {
        authApiCall:authApiCall
    };
}();