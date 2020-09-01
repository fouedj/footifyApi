const teamResolvers = require('./Team');
const playerResolvers=require('./Player')
const invitationResolvers =require('./invitation');
const matchResolvers = require("./match")
const {GraphQLUpload} =require('apollo-server-express');
const nestedResolvers = require("./nestedResolvers")
module.exports = {
	Query: {
		...teamResolvers.Query,
		...playerResolvers.Query,
		...invitationResolvers.Query,
		...matchResolvers.Query
		
		
	},

	Mutation: {
		...teamResolvers.Mutation,
		...invitationResolvers.Mutation,
		...playerResolvers.Mutation,
		...matchResolvers.Mutation
		
	},
	Subscription:{
		...matchResolvers.Subscription,
		...teamResolvers.Subscription
	},
	...nestedResolvers,
	Upload: GraphQLUpload
};
