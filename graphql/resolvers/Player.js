const { EXTENSION, UserRole } = require('../../helper/constant');
const { storeUpload } = require('../../helper/upload');
const { PlayerModel, TeamModel } = require('../../models');
const { UserModel } = require('../../models');
const processUpload = async (upload) => {
	const { createReadStream } = await upload;
	const filename = `player/${Date.now()}${EXTENSION}`;
	const path = `images/${filename}`;
	const { id } = await storeUpload({ createReadStream, path });
	return filename;
};
module.exports = {
	Query: {
		async getPlayers(_, {}, { user }) {
			try {
				let players = await PlayerModel.find();
				//console.log({players})
				if (user.role === 'PLAYER') {
					players = players.filter((item) => item.id !== user.id);
				}
				return players;
			} catch (err) {
				throw new Error(err);
			}
		},

		async getPlayerUser(_, {}, { user }) {
			try {
				const player =  PlayerModel.findById(user.id)
				if(player)
				return player;
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
					throw new Error('Pas des joueurs');
				}
			} catch (err) {
				throw new Error(err);
			}
		}
	},

	Mutation: {
		async editPlayer(_, { playerId, input: { firstName, lastName, post,picture, phoneNumber } }) {
			if (playerId) {
				return await PlayerModel.findById(playerId).then(async (player) => {
					player.firstName = firstName;
					player.lastName = lastName;
					player.post = post;
					player.phoneNumber=phoneNumber
					if (picture) {
						console.log(picture);
						const pictureUrl = await processUpload(picture);
						player.pictureUrl = `/media/${pictureUrl}`;
					}
					
				//	console.log({ player });
					player.save();
					return player
				});
			}
		},
		async deletePlayer(_,{playerId},{user}){
		if(user.role==UserRole.ADMIN){
			PlayerModel.findById(playerId).then(async (player)=>{
				if(player){
					player.remove();
			await	TeamModel.deleteMany({
					"createdBy.player":playerId
				})
					 UserModel.findOne({id:player.profile.id}).then((user)=>{
						 if(user)
						 user.remove()
					 })
				}
			})
		}
		}
	}
};
