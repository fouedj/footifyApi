var jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
module.exports.ensureToken = function(token) {

    return new Promise((resolve,reject)=>{
     
        if(!token) return reject("token not found***");
      
        jwt.verify(token, SECRET_KEY, (err, result) => {
            if(err) return reject(err);
            return resolve(result)
    })
    })
}