const jwt               = require('jsonwebtoken');


function encode_token(userId, expiresIn = '5m'){
    const secret    = process.env.SECRET_STRING
    if(!userId && !secret) return false
    const token     = jwt.sign({userId}, secret, { expiresIn: expiresIn });
    return token
}

function decode_token(token){
    const secret    = process.env.SECRET_STRING
    if(!token && !secret) return {
        status: false,
        message: "Token Not provided",
        userId : null
    }
    
    const {userId} = jwt.verify(token, secret)
    return userId
}

module.exports = {encode_token, decode_token}