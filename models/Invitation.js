const { Schema, model } = require("mongoose");
const { createdAt } = require("./preSave");

const invitationSchema = new Schema(
	{
        player:{
            type: Schema.Types.ObjectId,
			required: true,
			ref: 'Player',
			autopopulate: true
        },
		team: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Team',
			autopopulate: true
		},
		sender: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Player',
			autopopulate: true
		},
	
		createdAt: Number,
		updatedAt: Number
	}
);
createdAt(invitationSchema);
module.exports = model("invitations",invitationSchema);;