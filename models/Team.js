const { model, Schema } = require('mongoose');
const { createdAt } = require('./preSave');
const teamSchema = new Schema({
	id: { type: String },
	name: {
		type: String
	},
	description: { type: String },
	members: { type: [ Schema.Types.ObjectId ], ref: 'Player' },
	createdBy: {
		player: { type: Schema.Types.ObjectId, ref: 'Player' },
		role: {
			type: String,
			enum: [ 'PLAYER', 'ADMIN' ]
		}
	},
	createdAt: Number,
	pictureUrl: { type: String }
});
createdAt(teamSchema);
module.exports = model('Team', teamSchema);
