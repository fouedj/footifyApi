const { gql } = require('apollo-server');

module.exports = gql`
	scalar Upload

	scalar Coordinates

	type User {
		id: ID!
		email: String!
	}

	type Team {
		id: ID!
		name: String!
		description: String
		createdBy: CreatedBy
		address: String
		createdAt: Float!
		pictureUrl: String
		members: [Player]
		location: PointProps
		nestedItem: String
		playerCount: Int
	
	}

	type Match {
		id: ID!
		address: String
		localTeam: Team
		adversaryTeam: Team
		winnerTeam: Team
		createdBy: CreatedBy
		goalLocalTeam: Int
		goalAdversaryTeam: Int
		location: PointProps
		timeStartMatch:Float
		timeEndMatch:Float
		meetingTime:Float
		stadium:String
		createdAt:Float
		status:STATUS
		meetingDate:Float
		dateMatch:Float
	}

	input matchInput {
		adversaryTeam: ID
		localTeam: ID
		dateMatch:Float
		stadium:String
		address: String
		timeStartMatch:Float
		timeEndMatch:Float
		meetingTime:Float
		location: inputLocation
		meetingDate:Float
	
	}

	type PointProps {
		lat: Float
		lng: Float
	}

	type PointObject {
		latitude: Float
		longitude: Float
	}

	input teamInput {
		name: String
		description: String
		picture: Upload
		members: [ID]
		address: String
		location: inputLocation
	}

	enum POINT {
		Point
	}

	input inputLocation {
		lng: Float
		lat: Float
	}

	input teamInputEdit {
		name: String
		description: String
		picture: Upload
		address: String
		members: [memberInput]
	}

	input memberInput {
		id: ID
		isNew: Boolean
		isDeleted: Boolean
	}

	type Invitation {
		id: ID
		team: Team
		sender: Player
		player: Player
		createdAt: Float
	}
	enum STATUS{
		ACCEPTED
		REFUSED
		WAITING
	}

	type CreatedBy {
		role: ROLE!
		player: Player
	}

	enum ROLE {
		PLAYER
		ADMIN
	}

	type Player {
		id: ID
		firstName: String!
		lastName: String!
		post: String!
		createdAt: Float!
		profile: User
		phoneNumber: String
		invitations: [Invitation]
		pictureUrl: String
	}

	input inputPlayerEdit {
		firstName: String
		lastName: String
		post: String
		picture: Upload
		phoneNumber: String
	}

	type Mutation {
		createTeam(input: teamInput): Team!
		createMatch(input: matchInput): Match!
		editTeam(teamId: ID, input: teamInputEdit): Team
		deleteTeam(teamId: ID): String
		deleteInvitation(invitationId: ID): String
		acceptInvitation(teamId: ID): Invitation
		acceptInvitationTeam(matchId:ID,status:String):Match
		editPlayer(playerId: ID, input: inputPlayerEdit): Player
	}

	type Query {
		getTeams: [Team]
		getMyTeams: [Team]
		getTeam(TeamId: ID!): Team
		getPlayers: [Player]
		getPlayer(firstName: String): [Player]
		getInvitations: [Invitation]
		getNumberInvitations: Int
		getInvitationsTeam:Int
		getPlayerUser: Player
		getMatchs(status:String):[Match]
		getMatchsAdversary(status:String,invitation:Boolean):[Match]
		getMatchsAccepted:[Match]
	}
	type Subscription {
		matchUpdated(id:String):Match
		invitationAdded(id:String):Invitation
	}

	schema {
		query: Query
		mutation: Mutation
		subscription:Subscription
	}
`;
