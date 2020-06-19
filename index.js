const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./graphql/typeDefs');
const mongoose = require('mongoose');
const resolvers = require('./graphql/resolvers');
const Token = require('./util/Token');
const AuthRouter = require('./router/auth');
require('dotenv').config();
const bodyParser = require('body-parser');
const uri = process.env.ATLAS_URI;
const ENDPOINT = process.env.ENDPOINT;
const PORT = process.env.port;
const AUTHENTICATE = process.env.AUTHENTICATE;

const server = new ApolloServer({
	typeDefs,
	resolvers
});

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('connection is established!!');
});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(AUTHENTICATE, AuthRouter);
app.use(ENDPOINT, (req, res, next) => {
	let token = req.headers.authorization;
	//console.log(token)
	Token.ensureToken(token).then((valid) => next()).catch((err) => {
		res.status(401).json({
			success: false,
			code: 401,
			message: 'token not found***'
		});
	});
});
server.applyMiddleware({
	app,
	path: ENDPOINT
});
app.listen({ port: PORT }, () => console.log(`Server ready at http://localhost:${PORT} ${server.graphqlPath}`));
