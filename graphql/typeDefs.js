const { gql } = require('apollo-server');

module.exports = gql`
 scalar Upload

		
	type Team {
		id: ID!
		createdAt: Float!
		members: [Player]!
		description:String
		name: String!
		pictureUrl:String
		createdBy: CreatedBy
	}
	input teamInput{
		name: String
		description:String
		picture:Upload
	}

	type CreatedBy {
		role: ROLE!
	}

	enum ROLE {
		PLAYER
		ADMIN
	}

	type Player {
		id: ID!
		firstName: String!
		lastName: String!
		post: String!
		createdAt: Float!
	}

	type Mutation {
		createTeam(input:teamInput): Team!
	
	}

	type Query {
    getTeams:[Team]
    getTeam(TeamId: ID!): Team

	}

	schema {
		query: Query
		mutation: Mutation
	}
`;
