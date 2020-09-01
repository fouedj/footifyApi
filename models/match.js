const { Schema, model } = require('mongoose');
const { createdAt } = require('./preSave');
const pointSchema = new Schema(
	{
		type: {
			type: String,
			enum: [ 'Point' ]
		},
		coordinates: {
			type: [ Number ]
		}
	},
	{
		_id: false
	}
);
const matchSchema = new Schema({
	id: {
		type:String
	},

	localTeam: {
		type: Schema.Types.ObjectId,
		ref: 'Team',
		autopopulate: true
	},
	adversaryTeam: {
		type: Schema.Types.ObjectId,
		ref: 'Team',
		autopopulate: true
	},
	winnerTeam: {
		type: Schema.Types.ObjectId,
		ref: 'Team',
		autopopulate: true
	},
	
	stadium: {
		type: String
	},
	location: {
		type: pointSchema
	},
	goalLocalTeam: {
		type: Number
	},
	goalAdversaryTeam: {
		type: Number
    },
    timeStartMatch:{
        type:Number
    },
    timeEndMatch:{
        type:Number
	},
	meetingTime:{
		type:Number
	}, 
	meetingDate:{
		type:Number
	},
	dateMatch:{
		type:Number
	}, 
	address:{
		type:String
	},
	status:{
		type:String,
		default:"WAITING",
		enum:["ACCEPTED","REFUSED","WAITING","FINISHED"]
	},
	createdAt:{
		type:Number
	},
	createdBy: {
		player: { type: Schema.Types.ObjectId, ref: 'Player', autopopulate: true },
		role: {
			type: String,
			enum: [ 'PLAYER', 'ADMIN' ]
	
	}}
});
createdAt(matchSchema);
module.exports = model('Match', matchSchema);
