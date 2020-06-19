const {model,Schema}=require('mongoose')
const playerSchema=new Schema({
_id:Schema.Types.ObjectId,
firstName:String,
lastName:String,
post:String,
profile:{type:Schema.Types.ObjectId,ref:'User'}

})

module.exports = model('Player',playerSchema)