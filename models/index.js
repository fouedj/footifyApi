var UserModel =require("./User");
var PlayerModel= require("./player");
var TeamModel=require("./Team")
var InvitationModel =require("./Invitation");
const MatchModel=require("./match")
const ConversationModel = require("./conversations");
const MessageModel =require("./messages")
const AdminModel=require("./admin")
const bcrypt = require('bcryptjs');
function seedData(){
   AdminModel.countDocuments((err,count)=>{
if (count==0){
    bcrypt.hash("123456", 10, async function(err, hash) {
        new UserModel({
            email:"admin@gmail.com",
            password:hash
        }).save((err,user)=>{
            new AdminModel({
                profile:user.id
            }).save();
            console.log("data seed")
        });
        
    })

}
   })
}
seedData()
module.exports={
    UserModel,
    PlayerModel,
    TeamModel,
    InvitationModel,
    MatchModel,
    ConversationModel,
    MessageModel,
    AdminModel
}