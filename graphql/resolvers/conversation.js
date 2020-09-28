const { withFilter } = require('graphql-subscriptions');
const { ConversationModel, MessageModel } = require('../../models');
const { PubSubInstance } = require('../pubSub');

module.exports = {
	Query: {
		getConversations: (root, args, { user }) => {
			const query = {
				$or: [ { receiver: user.id }, { sender: user.id } ]
			};
			return ConversationModel.find(query);
		},
		getConversation: async (root, { id }) => {
            const conv = await  ConversationModel.findById(id);
            const messages = await MessageModel.find({conversation:conv.id}).sort({createdAt:1});
            return {messages,lastMessage:messages.reverse()[0],sender:conv.sender,receiver:conv.receiver}
		}
	},
	Mutation: {
		addMessage: async (root, { input }, { user, role }) => {
			const { to, body, conversationId } = input;
			//const sender =user.id;
			const query1 = { sender: to, receiver: user.id };
			const query2 = { sender: user.id, receiver: to };
			return new Promise(async (resolve, reject) => {
				const conv1 = await ConversationModel.findOne(query1);
				const conv2 = await ConversationModel.findOne(query2);
				if (!!!conv1 && !!!conv2) {
					return new ConversationModel({ sender: user.id, receiver: to }).save((err, conversation) => {
						new MessageModel({
							body,
							receiver: to,
							sender: user.id,
							conversation: conversation.id
						}).save((errMes, message) => {
                            if (errMes) return reject(errMes);
                            PubSubInstance.publish('MESSAGE_ADDED',{messageAdded:message})
							return resolve(message);
						});
					});
                }
                if(conv1){
                    return new MessageModel({
                        body,
                        receiver: to,
                        sender: user.id,
                        conversation: conv1.id
                    }).save((errMes, message) => {
                        if (errMes) return reject(errMes);
                        PubSubInstance.publish('MESSAGE_ADDED',{messageAdded:message})
                        return resolve(message);
                    });
                }
                if(conv2){
                    new MessageModel({
                        body,
                        receiver: to,
                        sender: user.id,
                        conversation: conv2.id
                    }).save((errMes, message) => {
                        if (errMes) return reject(errMes);
                        PubSubInstance.publish('MESSAGE_ADDED',{messageAdded:message})
                        return resolve(message);
                    });
                }
			});

			// Promise.all([
			// 	ConversationModel.findOne(query1),
			// 	ConversationModel.findOne(query2)
			// ]).then(([ conv1, conv2 ]) => {
			//     if(!!!conv1 && !!!conv2){
			//         console.log({conv1,conv2})
			//         new ConversationModel({sender:user.id,receiver:to}).save((err,conversation)=>{
			//             new MessageModel({body,receiver:to,sender:user.id,converation:conversation.id}).save((errMes,message)=>{
			//                 if(err) return Promise.reject(errMes)
			//                 return Promise.resolve(message)
			//             });
			//         })
			//     }
            // });
            
        }
        
    },
    Subscription:{
        messageAdded:{
            subscribe: withFilter(
				() => PubSubInstance.asyncIterator('MESSAGE_ADDED'),
				(payload, variables) => {
					//	console.log({payload,variables});
					return true;
				}
			)
        }
    }
};
