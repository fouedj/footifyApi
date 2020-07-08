const { TeamModel } = require('../../models');
const { storeUpload } = require('../../helper/upload');
const { EXTENSION } = require('../../helper/constant');

  
  const processUpload = async upload => {
	const { createReadStream} = await upload;
	const filename=`team/${Date.now()}${EXTENSION}`;
	const path = `images/${filename}`;
	const { id } = await storeUpload({ createReadStream, path });
	console.log({id})
	return filename;
  };
module.exports = {
	Query: {
		async getTeams() {
			console.log('query run ...');
			try {
				const teams = await TeamModel.find().sort({ createdAt: -1 });
				return teams;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getTeam(_, { TeamId }) {
			try {
				const team = await TeamModel.findById(TeamId);
				if (team) {
					return team;
				} else {
					throw new Error("l'equipe est inexistant");
				}
			} catch (err) {
				throw new Error(err);
			}
		}
	},

	Mutation: {
		async createTeam(_, {input:{name, description,picture}} , { user }) {
			//console.log({name, description,picture})
			 const pictureUrl= await processUpload(picture)
			// console.log({pictureUrl})
		
		 	const newTeam = new TeamModel({
				name: name,
				pictureUrl:`/media/${pictureUrl}`,
				description,
				createdBy: {
					role: user.role,
					player: user.id,
					email: user.email
				}
			});
			//console.log(newTeam);
			const team = await newTeam.save();
			return team;
		}
	}
};
