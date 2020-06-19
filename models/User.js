 
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  firstName:String,
  lastName:String,
  phoneNumber:String,
  password: String,
  post:String,
  email: String,
  createdAt: String
});

module.exports = model('User', userSchema);