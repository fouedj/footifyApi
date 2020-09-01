const { model, Schema } = require('mongoose');
const { createdAt } = require('./preSave');
const playerSchema = new Schema({
	id: String,
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	post: String,
	phoneNumber: {type:String},
	profile: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
	createdAt: {
		type: Number
	},
	pictureUrl:{type:String},
	
});

createdAt(playerSchema);
module.exports = model('Player', playerSchema);
