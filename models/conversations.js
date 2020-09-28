const { Schema, model } = require("mongoose");
const { createdAt } = require("./preSave");

const conversationSchema= new Schema({
    id:String,
    sender:{
        type:Schema.Types.ObjectId,
        ref:"Player",
        autopopulate:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"Player",
        autopopulate:true
    },
    createdAt:Number,
    updatedAt:Number
})

createdAt(conversationSchema);

module.exports= model("conversations",conversationSchema);