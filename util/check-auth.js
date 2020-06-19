const jwt= require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { AuthenticationError } = require('apollo-server');

module.exports=(context)=>{
   const authHeader=context.req.headers.authorization;
   if(authHeader){
       const token= authHeader.split('Bearer ')[1];
       if(token){
       try{
            const user=jwt.verify(token,SECRET_KEY)
            return user

           }catch(err){
               throw new AuthenticationError('Votre Token est invalide')

           }
       }
       throw new Error('Authentification  doit etre sous forme \'Bearer [token]')
   }
   throw new Error('Authorization header must be provided')
}