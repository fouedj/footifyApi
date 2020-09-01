const { InvitationModel, TeamModel } = require('../../models');

module.exports = {
	Query: {
		async getInvitations(_,__,{user}){
                return await InvitationModel.find({player:user.id});
		},
		async getNumberInvitations(_,__,{user}){
			return await InvitationModel.find({player:user.id}).count((err,numbInvit)=>{
				if(err){
					return err
				}
				return numbInvit
			})
		},
	
	},
	Mutation: {
		async deleteInvitation(_, { invitationId }) {
			
			return InvitationModel.findById(invitationId).then(async (invitation) => {
			console.log({invitation})
				if (invitationId) {
					await invitation.remove();

					return 'la supprission a été effectuée avec succés';
				} else {
					return "lasupprission n'est pas effectuée";
				}
			});
		},
		async acceptInvitation(_,{teamId},{user}){
		  await	TeamModel.updateOne({id:teamId},{$push:{members:user.id}}).exec((err,team)=>{
				if(err){
					return err
				}
				InvitationModel.deleteOne({team:teamId,player:user.id }).exec()
				
			})

		

		}
	},
	Subscription:{


	}
};
