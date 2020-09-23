const teamResolvers = require('./Team');
const playerResolvers=require('./Player')
const invitationResolvers =require('./invitation');
const matchResolvers = require("./match")
const {GraphQLUpload} =require('apollo-server-express');
const nestedResolvers = require("./nestedResolvers")
const conversationResolvers =require('./conversation')
module.exports = {
	Query: {
		...teamResolvers.Query,
		...playerResolvers.Query,
		...invitationResolvers.Query,
		...matchResolvers.Query,
		...conversationResolvers.Query
		
		
	},

	Mutation: {
		...teamResolvers.Mutation,
		...invitationResolvers.Mutation,
		...playerResolvers.Mutation,
		...matchResolvers.Mutation,
		...conversationResolvers.Mutation
		
	},
	Subscription:{
		...matchResolvers.Subscription,
		...teamResolvers.Subscription,
		...conversationResolvers.Subscription
	},
	...nestedResolvers,
	Upload: GraphQLUpload
};
