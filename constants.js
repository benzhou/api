var constants = module.exports = {
    errTypes:{
        system : 1,
        client : 2
    },
    errCodes: {
        noError : {code:200, msg:"No error"},
        sysError : { code: 500 , msg : "System error."},
        missParam : { code: 501 , msg : "Missing required parameter."},

        //auth/account error codes, 51x
        invalidApiAcct: {code:511, msg: "invalid api key. Not able to find in accounts."},
        permissionNotGranted : {code:512, msg:"api key doesn't have permission granted."},
        accountAlreadyExists : {code:513, msg:"api Key already exists."}
    }
};