const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  password: { type: String },
  post: { type: String },
  email: { type: String },
  createdAt: { type: String },
});
//change
module.exports = model("User", userSchema);
