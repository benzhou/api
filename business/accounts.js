var data_account = require('../data/accounts.js');

var accountBiz = module.exports = function(){

    var addNewAccount = function(apiKey, apiSecret, permissions){
        var promise = data_account.addNewAccount(apiKey, apiSecret, permissions);
        return promise;
    };

    return {
        addNewAccount : addNewAccount
    }
}();
