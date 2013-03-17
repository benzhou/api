HOST: http://api.benzhouonline.com/

--- API Demo v1 ---

--- 
Demo API design. Please contact Ben from Sino-Nova Technology, LLC. [Email](mailto:amailtoaben@gmail.com)

Error responses
===
General speaking, we will have two types of errors:

- System error
- Client error

System error is type of error that some unexpected thing happened during the API request. i.g. we had an un-caught exeption.
Or the database had a deadlock therefore the request timeouted, etc. When this type error happens, the API will return a 500
status code as well a 5XX error code in the returned object.

Client error is type of error that user had made a mistake. It is a expected outcome of the API call which caused by user's interaction.
i.g. Authentication of the user failed due to incorrect credentials.

General speaking that we will and should not show the actuall occurred error in the return object. It should always return a generic
mess let the caller know that a system error just occurred (and poentially logs the error at the server side error log). However, in the 
case of client error, the codeError would indicate the exact error just occurred, and what change of the input they user should make.
Login failure is a good example of the client error.

Return Object format 
===

Return object common format: each API call's "returned object" has a unified format. i.g.

        {
            success:true,
            errorCode:200,
            errorMsg:null,
            data:{
                token:"xyzabc",
                expired_on:"1234373636000",
                isAdmin:false
            }
        }

You always have a success property tell the caller that whether or not this call had error. 
If true, then the error code will be 200, which means the API call was success and errorMsg property will be null. 
If false, then the errorCode property will be corepsonding error code value, for example, errorCode:401 means invalid credentials.

---

-- 
User Authentication related End Points
Available methods:

- UserAuth
- InvalidateToken
- ResetPassword
--


User/Consumer Authentication End Points, use this method when a consumer tries to authentication via a username/password credential pair.

- Querystring parameter:    
    - apiKey *Required*
- POST payload:
    - userName *Required*
    - password *Required*
- Return object: 
    - 200, when authentication was successful. The data property will contain the access token and expired_on value.
    - 400, when authentication was un-successful. the sucess property will be fase. see the detailed return object in the return object definition below.
POST /User/auth/{?apiKey}
> Content-Type: application/json
{userName : "Bob", password:"password123"}
< 200
< Content-Type: application/json
{ 
    success:true,
    errorCode:200,
    errorMsg:null,
    data : {
        token : "xyaz",
        expired_on : "12348373",
        isAdmin:false
    }
}
+++++
< 400
< Content-Type: application/json
{ 
    success: false,
    errorCode: 401
    errorMsg: "invalid credentials.",
    data:null
}

Invalidate Access Token when user logs out.
POST /User/invalidateToken{?apiKey}
> Content-Type: application/json
{ 
    "token":"1AB23ORM"
}
< 200
< Content-Type: application/json
{ 
    success:true,
    errorCode:200,
    errorMsg:null,
    data : null
}
+++++
< 400
< Content-Type: appliation/json
{
    sucess:false,
    errorCode:501,
    errorMsg:"System error occurred.",
    data:null
}


-- 
Consumer/User Resources related End Points.
List of consumer/user resource methods:

+ LoadProfile
+ LoadBill
+ LoadOutageData
--

GET /Consumer/Profile/{?accessToken}
< 200
{ 
    success:true,
    errorCode:200,
    errorMsg:null,
    data : {
        userName:"bobjoe",
        email:"bobjoe@email.com",
        accountNumber:1234567890,
        address:{
            address1:"123 Main st.",
            address2:"APT 123",
            City:"Atlanta",
            State:"GA",
            Zip:"30339",
            Country:"US"
        }
    }
}
+++++
< 500
{
    success:true,
    errorCode:502,
    errorMsg:"System error occurred.",
    data :null
}
