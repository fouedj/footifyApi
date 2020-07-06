const { makeExecutableSchema } =require('graphql-tools');

const resolvers =require("./resolvers");
const typeDefs =require("./typeDefs");
//import directiveResolvers from './directiveResolvers';
module.exports = makeExecutableSchema({
typeDefs,
resolvers,
//directiveResolvers,
logger: {
log: message => {
//console.log("Logger: ", message);
}
}
});