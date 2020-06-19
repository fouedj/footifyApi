
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateLoginInput, validateRegisterInput } = require("../util/validators");
//const { UserInputError } = require("apollo-server-express");
const User = require("../models/User");
const { SECRET_KEY } = require("../config");
const { Router } = require('express');
const AuthRouter =Router()

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userName: user.userName
    },
    SECRET_KEY,
   
  );
}
AuthRouter.post('/login', async function(req,res,next){
      const {email,password}=req.body;

   //console.log(req.body)
   const { errors, valid } = validateLoginInput(email, password);
  
    if (!!!valid) {
     return res.send({
       success:false,
       errors
     })
   
    }
    const user = await User.findOne({ email });
    if (!!!user) {
      
      
      return res.send({
        errors:{
          email:"Votre email est incorrecte!!!"
        },
        success:false,        
      })
    }
      const match = await bcrypt.compare(password, user.password);
    if (!!!match) {
       return res.send({
      errors:{
        password:"Votre mot de passe est incorrecte!!!"
      },
       success:false,
       })
    }

      const token = generateToken(user);
    return res.send ({
      ...user._doc,
      user:user,
      id: user._id,
      token,
      success:true,
           
    });
})
AuthRouter.post('/register',async (req,res)=>{
  const{firstName,lastName,email,password,confirmPassword,phoneNumber,post}=req.body
  
  const {errors,valid}=validateRegisterInput(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    post
    
    )

    if(!!!valid){
     return res.send({
        success:false,
        errors
      })
    }
  
      const user=await User.findOne({userName})
      const Email=await User.findOne({email})
      if(user){
        return res.send({
          success:false,
          errors:{
            userName:"Cet utilisateur est déjà utilisé"
          }
        })
      }
      if(Email){
      return  res.send({
          success:false,
          errors:{
            email:"Cette adresse email est déjà utilisée"
          }
        })
      }

      bcrypt.hash(password,10,async function(err,hash){
        if(err){
          res.send({
            success:false,
            message:"error"
          })
        }
        if(hash){
          const newUser =new User({
            firstName,
            lastName,
            userName,
            email,
            age,
            password:hash,
            phoneNumber,
            createdAt:new Date().toISOString()
        })
       const userAdded = await newUser.save()
       const token = generateToken(userAdded)  
   return res.send({
   ...userAdded._doc,
   userAdded:userAdded,
       id:userAdded._id,
     success:true,
     token
   } )
      }
      
    })
   
    
    /*  const newUser =new User({
        firstName,
        lastName,
        userName,
        email,
        age,
        password1,
        phoneNumber,
        createdAt:new Date().toISOString()
      })
      //console.log(newUser)
      const userAdded = await newUser.save()
   const token = generateToken(userAdded)  
   return res.send({
   ...userAdded._doc,
   userAdded:userAdded,
       id:userAdded._id,
     success:true,
     token
   } )
      
        
      */
     
  
})

module.exports = AuthRouter;