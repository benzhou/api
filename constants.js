var constants = module.exports = {
    errTypes:{
        system : 1,
        client : 2
    },
    errCodes: {
        noError : {code:200, msg:"No error"},
        sysError : { code: 500 , msg : "System error."},
        missParam : { code: 501 , msg : "Missing required parameter."},
    }
};