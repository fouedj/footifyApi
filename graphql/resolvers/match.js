const Agenda = require('agenda');
const { withFilter } = require('graphql-subscriptions');

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

module.exports = {
	Query: {
		async getMatchs(_, { status }, { user }) {
			//console.log('query run ...');

			try {
				const query = {
					'createdBy.player': user.id
				};
				console.log({ query });
				const matchs = await MatchModel.find(query).sort({ createdAt: -1 });
				// console.log({ matchs });
				//return null
				return matchs;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getMatchsAdversary(_, { status, invitation }, { user }) {
			console.log({ status });
			const query1 = {
				'createdBy.player': user.id
			};

			const teams = await TeamModel.find(query1).select({ id: 1 }).lean();
			const teamIds = teams.map((item) => item.id);
			//console.log({teamIds})
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
				timeStartMatch,
				timeEndMatch,
				createdBy: {
					role: user.role,
					player: user.id,
					email: user.email
				},
				dateMatch,
				meetingTime,
				meetingDate,
				location: {
					type: 'Point',
					coordinates: [ lat, lng ]
				}
			};
			const newMatch = new MatchModel({
				...data
			});
			//console.log({newMatch})
			//return null
			const match = await newMatch.save();
			// if (adversaryTeam) {
			// 	const object = {
			// 		player: adversaryTeam,
			// 		sender: user.id,
			// 		team: localTeam
			// 	};
			// 	new InvitationModel(object).save();
			// }

			// Schedule.define(`match#${match.id}`, (job, done) => {
			// 	const now = moment().now();
			// 	console.log({ now });
			// 	job.save();
			// 	done();
			// });
			// const job = Schedule.create(`match#${match.id}`, {
			// 	match
			// });

			// job.repeatEvery('1 seconds', {
			// 	skipImmediate: true
			// });
			// job.save();
			// Schedule.start();
			Schedule.define('printAnalyticsReport', async job => {
				
				console.log('I print a report!');
			  });
			  
			  Schedule.every('0.1 seconds', 'printAnalyticsReport');
			  Schedule.start()

			return match;
		},

		async acceptInvitationTeam(_, { matchId, status }, { user }) {
			//console.log(matchId)
			console.log({ user });
			await MatchModel.updateOne({ id: matchId }, { $set: { status } }).exec();

			const match = await MatchModel.findById(matchId);
			PubSubInstance.publish('MATCH_UPDATED', { matchUpdated: match });
			sendNotification({
				userId: user.player.profile.id,
				body: 'Hello',
				button: [ { id: 'id_close', text: 'Fermer' }, { id: 'id_open', text: 'Ouvrir' } ]
			});
			console.log('ffsdfsd');
			return match;
		}
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
