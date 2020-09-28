const { InvitationModel, MessageModel, MatchModel } = require("../../models");
const match = require("../../models/match");

module.exports = {
  Team: {
    location: (team, {}, { user }) => {
      const { location } = team;

      return {
        lat: location.coordinates[0],
        lng: location.coordinates[1],
      };
    },
    countWinnerMatch: async (team, {}, { user }) => {
      const count = (
        await MatchModel.find({
          $and: [
            { $or: [{ adversaryTeam: team.id }, { localTeam: team.id }] },
            { winnerTeam: team.id },
          ],
        })
      ).length;
      return count;
	},
	totalMatch: async (team, {}, { user }) => {
		const count = (
		  await MatchModel.find({
			$and: [
			  { $or: [{ adversaryTeam: team.id }, { localTeam: team.id }] },
			 
			],
		  })
		).length;
		return count;
	  },
	countLoserMatch: async (team, {}, { user }) => {
		const count = (
		  await MatchModel.find({
			$and: [
			  { $or: [{ adversaryTeam: team.id }, { localTeam: team.id }] },
			  { winnerTeam: {$ne:team.id} },
			],
		  })
		).length;
		return count;
	  },
	  countNullMatch: async (team, {}, { user }) => {
		const count = (
		  await MatchModel.find({
			$and: [
			  { $or: [{ adversaryTeam: team.id }, { localTeam: team.id }] },
			  { winnerTeam: {$eq:null} },
			],
		  })
		).length;
		console.log({null:count})
		return count;
	  },
    //nestedItem:()=> "I am nested ",
    playerCount: (team, {}, { user }) => team.members.length,
    // name:()=>" n'exist pas"
  },
  Player: {
    invitations: (player, {}, { user }) => {
      return InvitationModel.find({ player: player.id });
    },
  },
  Match: {
    location: (match, {}, { user }) => {
      const { location } = match;
      return {
        lat: location.coordinates[0],
        lng: location.coordinates[1],
      };
    },
  },
  Conversation: {
    lastMessage: (conversation, args, context) => {
      return MessageModel.find({ conversation: conversation.id })
        .sort({ createdAt: -1 })
        .then((messages) => messages[0]);
    },
  },
};
