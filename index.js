const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const mongoose = require('mongoose');
const schema = require('./graphql');
const Token = require('./util/Token');
const AuthRouter = require('./router/auth');
require('dotenv').config();
const bodyParser = require('body-parser');
const { getUserByToken } = require('./util/Auths');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const mediaRouter = require('./router/media');
const Agenda = require('agenda');
const uri = process.env.ATLAS_URI;
const ENDPOINT = process.env.ENDPOINT;
const PORT = process.env.port;
const MEDIA=process.env.MEDIA
const AUTHENTICATE = process.env.AUTHENTICATE;
const server = new ApolloServer({
	schema,
	context: async ({ req }) => {
		return {
			user: await getUserByToken(req.headers.authorization)
		};
	}
});

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, }).then(()=>{
	console.log("db connected")
}).catch((err)=>{
	console.log("Error database",err)
})
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('connection is established!!');
});
const agenda =  new Agenda({
	db: {
		address: 'mongodb://localhost:27017/footifydb',
		collection: 'jobs',
		options: { useNewUrlParser: true, useUnifiedTopology: true }
	}
});
agenda.start()
const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: '10gb' }));
app.use(bodyParser.json());
app.use(compression());
app.use(cors());
app.use(helmet());
//app.use(morgan('dev'));
app.use(AUTHENTICATE, AuthRouter);
app.use(MEDIA,mediaRouter)
app.use(ENDPOINT, (req, res, next) => {
	//console.log("token")
	let token = req.headers.authorization;
	
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
	path: ENDPOINT,
	bodyParserConfig: {
		limit: '100mb' // Your Limited Here
	}
});
//app.listen({ port: PORT }, () => console.log(`Server ready at http://localhost:${PORT} ${server.graphqlPath}`));

const ws = createServer(app);
ws
	.listen(PORT, () => {
		console.log(`Server listening at port ${PORT} ...`);
	})
	.on('listening', () => {
		console.log('Subscription is listing....');
		new SubscriptionServer(
			{
				execute,
				subscribe,
				schema,
				onConnect: async (connectionParams) => {
					console.log("On connect server sub ...")
					if (connectionParams.token) {
						const token = connectionParams.token;
						
						return new Promise((resolve, reject) => {
							getUserByToken(token)
								.then((res) => {
									return resolve(res);
								})
								.catch((err) => reject(err));
						});
					}
				}
			},
			{
				server: ws,
				path: '/subscriptions'
			}
		);
	});
