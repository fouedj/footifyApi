const { model, Schema } = require("mongoose");
const playerSchema = new Schema({
  id: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  post: String,
  profile: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Player", playerSchema);
