const { Schema, model } = require("mongoose");
const { createdAt } = require("./preSave");

const messageSchema= new Schema({
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
    conversation:{
        type:Schema.Types.ObjectId,
        ref:"conversations",
        autopopulate:true,
    },
    body:String,
    seenAt:Number,
    isSeen:{
        type:Boolean
    },
    createdAt:Number,
    updatedAt:Number
})

createdAt(messageSchema);

module.exports= model("messages",messageSchema);