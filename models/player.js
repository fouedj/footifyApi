const { model, Schema } = require("mongoose");
const { createdAt } = require("./preSave");
const playerSchema = new Schema({
  id: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  post: String,
  profile: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt:{
    type:Number
  }
});

createdAt(playerSchema)
module.exports = model("Player", playerSchema);
