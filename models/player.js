const { model, Schema } = require("mongoose");
const playerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  post: String,
  profile: { type: Schema.Types.ObjectId, ref: "User" },
});
//branch dev change
module.exports = model("Player", playerSchema);
