const { PlayerModel } = require("../../models");


module.exports = {
	Query: {
		async getPlayers() {
			console.log('query run ...');
			try {
				const players = await PlayerModel.find().populate("profile").sort({ createdAt: -1 });
				return players;
			} catch (err) {
				throw new Error(err);
			}
		},
        async getPlayer(_, { firstName }) {
			try {
				const player = await PlayerModel.findById(firstName);
				if (player) {
					return player;
				} else {
					throw new Error("Pas des joueurs");
				}
			} catch (err) {
				throw new Error(err);
			}
		}

    },



    Mutation:{



    }

}