constants = require('../constants.js');

var accounts = (function(connStr){
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient
        , Server = mongodb.Server;

    var mongoClient = new MongoClient(new Server('localhost', 27017));

    /*
    * Description: method used to load the API account document.
    * returns: promise object.
    * */
    var loadAccount = function(apiKey){
        console.log('data account: loadAccount');
        console.log('apiKey: ' + apiKey);

        var q = require('q'),
            deferred = q.defer();

        if(!apiKey || apiKey === undefined){
            deferred.reject({errType: 1, msg: 'API key cannot be empty'});
            return deferred;
        }

        mongoClient.open(function(err, mongoClient) {
            if(err){
                console.log("error when open the mongo client");
                mongoClient.close();
                deferred.reject({errType: constants.errTypes.system, msg: 'system error', errObj: err});
            }else{
                var db = mongoClient.db("api"),
                    acctCollection = db.collection('account');

                acctCollection.findOne({apiKey: apiKey}, function(err, item){
                    if(err){
                        console.log('data account: loadAccount: err when find an account.');
                        mongoClient.close();
                        deferred.reject({errType: constants.errTypes.system, msg: 'system error', errObj: err});
                    }else{
                        console.log('data account: loadAccount : find account doc.');
                        console.log(item);
                        mongoClient.close();
                        deferred.resolve(item);
                    }
                });
            }
        });

        return deferred.promise;
    };
    /*
    * Description: adding new API accounts to the data repository.
    *
    * */
    var addNewAccount = function(apiKey, apiSecret, permissions){
        console.log("data layer add New account called");
        var q = require("q"),
            deferred = q.defer();

        mongoClient.open(function(err, mongoClient) {
            if(err){
                console.log("error when open the mongo client");
                mongoClient.close();
                //throw err;
                deferred.reject({errType: constants.errTypes.system, msg: 'system error', errObj: err});
            }else{
                var db = mongoClient.db("api"),
                    acctCollection = db.collection('account'),
                    account = {
                        apiKey: apiKey,
                        apiSecret : apiSecret,
                        permissions : permissions
                    };

                acctCollection.insert(account,{w:1}, function(err, result){
                    if(err){
                        console.log("error when writes new accounts");
                        console.dir(err);
                        mongoClient.close();
                        deferred.reject({errType: constants.errTypes.system, msg: 'system error', errObj: err});
                    }else{
                        console.log("sucessfully added new accounts.");
                        mongoClient.close();
                        deferred.resolve(result);
                    }
                });
            }
        });

        return deferred.promise;
    }

    return {
        addNewAccount : addNewAccount,
        loadAccount : loadAccount
    }
})();

module.exports = accounts;