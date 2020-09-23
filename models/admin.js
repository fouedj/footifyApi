const { model, Schema } = require('mongoose');
const { createdAt } = require('./preSave');

const adminSchema = new Schema({
	id:{type:String},
	profile: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
	
	createdAt:{
		type:Number
	}
});
createdAt(adminSchema);
//change
module.exports = model('Admins', adminSchema);
