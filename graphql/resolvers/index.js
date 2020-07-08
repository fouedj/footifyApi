const teamResolvers = require('./Team');
const playerResolvers=require('./Player')
const {GraphQLUpload} =require('apollo-server-express');
module.exports = {
	Query: {
		...teamResolvers.Query,
		...playerResolvers.Query
		
		
	},

	Mutation: {
		...teamResolvers.Mutation
	},
	Upload: GraphQLUpload
};
