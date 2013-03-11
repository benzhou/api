var data_account = require('../data/accounts.js');

var accountBiz = function(){

    var addNewAccount = function(apiKey, apiSecret, permissions){
        var promise = data_account.addNewAccount(apiKey, apiSecret, permissions);
        return promise;
    };

    return {
        addNewAccount : addNewAccount
    }
}();

module.exports.biz = accountBiz;