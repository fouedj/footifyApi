const teamResolvers = require('./Team');
const {GraphQLUpload} =require('apollo-server-express');
module.exports = {
	Query: {
		...teamResolvers.Query
	},
	Mutation: {
		...teamResolvers.Mutation
	},
	Upload: GraphQLUpload
};
