const { model, Schema } = require('mongoose');
const { createdAt } = require('./preSave');

const userSchema = new Schema({
	id:{type:String},
	role: {
		type: String,
		default: 'PLAYER',
		enum: [ 'PLAYER', 'ADMIN' ]
	},
	password: { type: String },
	post: { type: String },
	email: {
		type: String,
		unique: true
	},
	createdAt:{
		type:Number
	}
});
createdAt(userSchema);

//change
module.exports = model('User', userSchema);
