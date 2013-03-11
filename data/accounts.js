
var accounts = (function(connStr){
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient
        , Server = mongodb.Server;

    var mongoClient = new MongoClient(new Server('localhost', 27017));

    /*
    * Description: adding new API accounts to the data repository.
    *
    * */
    var addNewAccount = function(apiKey, apiSecret, permissions){
        var q = require("q"),
            deferred = q.defer();

        mongoClient.open(function(err, mongoClient) {
            if(err){
                mongoClient.close();
                //throw err;
                deferred.reject(err);
            }
            var db = mongoClient.db("API"),
                acctCollection = db.collection('account'),
                account = {
                    apiKey: apiKey,
                    apiSecret : apiSecret,
                    permissions : permissions
                };

            acctCollection.insert(account,{w:1}, function(err, result){
                if(err){
                    console.dir(err);
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }

            });

            mongoClient.close();
        });

        return deferred.promise;
    }

    return {
        addNewAccount : addNewAccount
    }
})();

exports.data = accounts;