const Agenda = require('agenda');
const { withFilter } = require('graphql-subscriptions');
const moment = require('moment');
const { UserRole } = require('../../helper/constant');
const { sendNotification } = require('../../helper/notification');
const { MatchModel, TeamModel, InvitationModel } = require('../../models');
const { PubSubInstance } = require('../pubSub');

const Schedule = new Agenda({
	db: {
		address: 'mongodb://127.0.0.1/footifydb',
		collection: 'jobs',
		options: { useNewUrlParser: true, useUnifiedTopology: true }
	}
});
function subtractHour({date,nb}){
	return moment(date).subtract(nb,'hours').valueOf()
}
module.exports = {
	Query: {
		async getMatchModified(_, { matchId}, { user }) {
			//console.log('query run ...');

			try {
			
				console.log({ matchId });
				
				const matchModified = await MatchModel.findById(matchId);
				// console.log({ matchModified });
				//return null
				return matchModified;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getMatchsAdversary(_, { status, invitation }, { user }) {
		
			if(user.role==UserRole.ADMIN){
				let query = {

				}
				if(status!== "ALL"){
					query={
						status
					}
				}
				return MatchModel.find(query);
			}
			const query1 = {
				'createdBy.player': user.id
			};
			const teams = await TeamModel.find(query1).select({ id: 1 }).lean();
			const teamIds = teams.map((item) => item.id);
			const query = invitation
				? {
						$or: [ { adversaryTeam: { $in: teamIds } } ],
						status
					}
				: {
						$or: [ { localTeam: { $in: teamIds } } ],
						status
					};
			if (status !== 'WAITING' && invitation !== true) {
				query.$or.push({ adversaryTeam: { $in: teamIds } });
				// autre version query.$or = [...query.$or ,{ adversaryTeam: { $in: teamIds } }];
			}

			const matchsAdvarsary = await MatchModel.find(query).sort({ createdAt: -1 });

			return matchsAdvarsary;
		},
		async getMatchsAccepted(_, {}, { user }) {
			//console.log('query run ...');
			const query1 = {
				'createdBy.player': user.id
			};
			const teams = await TeamModel.find(query1).select({ id: 1 }).lean();
			const teamIds = teams.map((item) => item.id);
			//console.log({teamIds})
			const matchsAccepted = await MatchModel.find({
				$and: [ { adversaryTeam: { $in: teamIds }, status: 'ACCEPTED' } ]
			}).sort({ createdAt: -1 });

			return matchsAccepted;
		},

		async getInvitationsTeam(_, {}, { user }) {
			//console.log('query run ...');
			const query1 = {
				'createdBy.player': user.id
			};
			const teams = await TeamModel.find(query1).select({ id: 1 }).lean();
			const teamIds = teams.map((item) => item.id);
			return await MatchModel.find({
				$and: [ { adversaryTeam: { $in: teamIds }, status: 'WAITING' } ]
			}).countDocuments((err, numbInvit) => {
				if (err) {
					return err;
				}
				return numbInvit;
			});
		}
	},
	Mutation: {
		async createMatch(
			_,
			{
				input: {
					adversaryTeam,
					localTeam,
					dateMatch,
					address,
					timeStartMatch,
					timeEndMatch,
					stadium,
					meetingTime,
					meetingDate,
					location: { lat, lng }
				}
			},
			{ user }
		) {
			let data = {
				 adversaryTeam,
				localTeam,
				address,
				stadium,
				timeStartMatch:subtractHour({date:timeStartMatch,nb:1}),
				timeEndMatch:subtractHour({date:timeEndMatch,nb:1}),
				createdBy: {
					role: user.role,
					player: user.id,
					email: user.email
				},
				dateMatch,
				meetingTime:subtractHour({date:meetingTime,nb:1}),
				meetingDate,
				location: {
					type: 'Point',
					coordinates: [ lat, lng ]
				}
			};
			const newMatch = new MatchModel({
				...data
			});
			const match = await newMatch.save();
			Schedule.define(`match#${match.id}`, async (job) => {
				job.save();
				const now = moment().valueOf();
				const timeEndMatch = job.attrs.data.match.timeEndMatch;
				const { id: idMAtch, adversaryTeam, localTeam } = job.attrs.data.match;
					if (now > timeEndMatch) {
					MatchModel.updateOne({ id: idMAtch }, { status: 'FINISHED' }).exec(async (err, res) => {
						if (err) {
							return Promise.reject(err);
						}
						const teams = await TeamModel.find({ id: { $in: [ localTeam, adversaryTeam ] } });
					
						const playersIds = teams.map((team) => team.createdBy.player.profile.id);
						console.log("schools")
						console.log({playersIds});
						console.log({id:user.player.profile.id})
						try{
							sendNotification({
								userId:user.player.profile.id,
								body: "Le match est finis",
								data:{match:match.id},
								button: [ { id: 'id_close', text: 'Fermer' }, { id: 'id_open', text: 'Ouvrir' } ]
							});
							sendNotification({
								userId:playersIds[1],
								body: "Le match est finis",
								data:{match:match.id},
								button: [ { id: 'id_close', text: 'Fermer' }, { id: 'id_open', text: 'Ouvrir' } ]
							});
						}catch(e){
							console.log(e)
							
						}
						
						
						
						Schedule.cancel({ name: `match#${match.id}` });
					});
				}
			});
			const job1 = Schedule.create(`match#${match.id}`, {
				match
			});
			job1.save()
			Schedule.every('9 seconds', `match#${match.id}`, {
				match
				
			});
			Schedule.start();
				// playersIds.forEach((player) => {
				// 			sendNotification({
				// 				userId: player,
				// 				body: 'Match finished',
				// 				data:{match}
				// 			});
				// 		});
			return match;
		},

		async acceptInvitationTeam(_, { matchId, status }, { user }) {
			//console.log(matchId)
			//console.log({ user });
			await MatchModel.updateOne({ id: matchId }, { $set: { status } }).exec();

			const match = await MatchModel.findById(matchId);
			//console.log({match})
			sendNotification({
				userId:user.player.profile.id,
				body: "L'invitation de votre match est accéptée",
				data:{match:match.id},
				button: [ { id: 'id_close', text: 'Fermer' }, { id: 'id_open', text: 'Ouvrir' } ]
			});
			PubSubInstance.publish('MATCH_UPDATED', { matchUpdated: match });
			//console.log('ffsdfsd');
			return match;
		},
		async updateMatch(_,{input},{user}){
			console.log({input})
			const {id,winnerTeam,goalLocalTeam,goalAdversaryTeam} = input;
			Promise.all([MatchModel.findById(id)]).then(([match])=>{
				if(!!!match) return Promise.reject("Match not found");
				match.winnerTeam = winnerTeam;
				match.goalAdversaryTeam = goalAdversaryTeam;
				match.goalLocalTeam=goalLocalTeam;
				return Promise.resolve(match.save());
			})
		},
		async deleteMatch(_,{matchId},{user}){
			if(user.role==UserRole.ADMIN){
				MatchModel.findById(matchId).then(match=>{
			  match.remove()
			 console.log({match})
			  return match;
			
		})}
			
		},
	},
	Subscription: {
		matchUpdated: {
			subscribe: withFilter(
				() => PubSubInstance.asyncIterator('MATCH_UPDATED'),
				(payload, variables) => {
					//	console.log({payload,variables});
					return true;
				}
			)
		}
	}
};
