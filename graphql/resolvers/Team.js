const { TeamModel, InvitationModel } = require('../../models');
const { storeUpload } = require('../../helper/upload');
const { EXTENSION, UserRole } = require('../../helper/constant');
const moment = require('moment');
const { PubSubInstance } = require('../pubSub');
const { withFilter } =require('graphql-subscriptions');
const processUpload = async (upload) => {
	const { createReadStream } = await upload;
	const filename = `team/${Date.now()}${EXTENSION}`;
	const path = `images/${filename}`;
	const { id } = await storeUpload({ createReadStream, path });
	//console.log({ id });
	return filename;
};
module.exports = {
	Query: {
		async getTeams(_, {filter}, { user }) {
			//console.log('query run ...')
			if(!!!filter)
				{return  TeamModel.find().sort({ createdAt: -1 });
				}
			try {
				
				return TeamModel.aggregate([
					{
					  $geoNear: {
						 near: { type: "Point", coordinates: [ filter.location.latitude ,filter.location.longitude ] },
						 distanceField: "distance",
						 maxDistance: 700000,
						 spherical: true
					  }
					}
				 ]).then(teams=>{
					return teams.filter((team) => String(team.createdBy.player) !== String(user.id));
				
				
				 })
				
			} catch (err) {
				throw new Error(err);
			}
		},
		async getMyTeams(_, {}, { user }) {
			//console.log('query run ...');

			try {
				const query = {
					'createdBy.player': user.id
				};
				//console.log({query})
				let teams = await TeamModel.find(query).sort({ createdAt: -1 });
				//console.log({teams})
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
		async createTeam(
			_,
			{ input: { name, description, picture, members, address, location: { lat, lng } } },
			{ user }
		) {
			//console.log({name,description,picture,address,lat,lng})
			let data = {
				name,
				description,
				createdBy: {
					role: user.role,
					player: user.id,
					email: user.email
				},
				address,
				location: {
					type: 'Point',
					coordinates: [ lat, lng ]
				}
			};
			if (picture) {
				const pictureUrl = await processUpload(picture);
				data = {
					...data,
					pictureUrl: `/media/${pictureUrl}`
				};
			}

			const newTeam = new TeamModel({
				...data
			});
			const team = await newTeam.save();
			console.log({ members });
			members.map((id) => {
				const obj = {
					player: id,
					team: team.id,
					sender: user.id,
					date: moment().valueOf()
				};
				new InvitationModel(obj).save((err,invit)=>{
					if(err) return Promise.reject(err);
					PubSubInstance.publish('INVITATION_ADDED',{invitationAdded:invit});
				});
			});

			return team;
		},
		async editTeam(_, { teamId, input: { name, description, picture, address, members } }) {
			 return new Promise((resolve,reject)=>{
				if (teamId) {
					return TeamModel.findById(teamId).then(async (team) => {
						team.address = address;
						team.name = name;
						team.description = description;
						if (picture) {
							console.log(team);
							const pictureUrl = await processUpload(picture);
							team.pictureUrl = `/media/${pictureUrl}`;
						}
						team.save();
						return resolve(team);
					});
				}
			 })
			
		},
		async deleteTeam(_, { teamId }) {
			return TeamModel.findById(teamId).then(async (team) => {
				if (!!!team) return 'team not exist';
				if (teamId) {
					await team.delete();

					return 'la supprission a été effectuée avec succés';
				} else {
					return "la supprission n'est pas effectuée";
				}
			});
		}
	},
	Subscription:{
		invitationAdded:{
			subscribe: withFilter(() => PubSubInstance.asyncIterator('INVITATION_ADDED'), (payload, variables) => {
				console.log({payload,variables});
				return true
			})
		}
	}
};
