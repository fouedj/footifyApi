const { model, Schema } = require('mongoose');
const { createdAt } = require('./preSave');
const pointSchema = new Schema({
	type: {
		type: String,
		enum: [ 'Point' ]
	},
	coordinates: {
		type: [ Number ]
	}
},
{
	_id:false
});
const teamSchema = new Schema({
	id: { type: String },
	name: {
		type: String
	},
	description: { type: String },
	members: { type:  [Schema.Types.ObjectId ], ref: 'Player',autopopulate:true},
	
	createdBy: {
		player: { type: Schema.Types.ObjectId, ref: 'Player', autopopulate: true },
		role: {
			type: String,
			enum: [ 'PLAYER', 'ADMIN' ]
		}
	},
	address: {
		type: String
	},
	createdAt: Number,
	pictureUrl: { type: String },
	location: {
		type: pointSchema
	}
});
createdAt(teamSchema);
teamSchema.index({location: "2dsphere"});
module.exports = model('Team', teamSchema);
