const { validateRegisterInput, validateLoginInput } = require('./validators');
const { PlayerModel, UserModel } = require('../models');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { ensureToken } = require('./Token');

async function getUserByToken(token) {
	const user = await ensureToken(token);
	const player=await PlayerModel.findById(user.id)
	return {...user,player}
}

function generateToken(user, player=null ) {

	return jwt.sign(
		{
			id: player.id,
			email: user.email,
			role: user.role
		},
		SECRET_KEY
	) 
}
const userRegister = async ({ body, role, res }) => {
	const { firstName, lastName, email, password, phoneNumber, post } = body;
	console.log({body})
	const { errors, valid } = validateRegisterInput({
		...body
	});

	if (!!!valid) {
		return res.send({
			success: false,
			errors
		});
	}

	const Email = await User.findOne({ email });
	if (Email) {
		return res.send({
			success: false,
			errors: {
				email: 'Cette adresse email est déjà utilisée'
			}
		});
	}

	bcrypt.hash(password, 10, async function(err, hash) {
		if (err) {
			res.send({
				success: false,
				message: 'error'
			});
		}
		if (hash) {
			const newUser = new User({
				role,
				email,
				password: hash
			});
			const userAdded = await newUser.save();
			//console.log({userAdded});
		
			const player = new PlayerModel({
				firstName,
				lastName,
				post,
				profile: userAdded.id,
				phoneNumber
			});
			const token = generateToken(userAdded,player);
			//console.log({player2:player})
			 player.save((err, resp) => {
				if (err)
					return res.send({
						success: false,
						message: 'erreur'
					});

				return res.send({
					...userAdded._doc,
					userAdded: userAdded,
					id: userAdded._id,
					success: true,
					token
				});
			});
		}
	});
};
const userLogin = async ({ body, res, role }) => {
	const { email, password } = body;
	const { errors, valid } = validateLoginInput(email, password);

	if (!!!valid) {
		return res.send({
			success: false,
			errors
		});
	}
	const user = await UserModel.findOne({ email });
	if (!!!user) {
		return res.send({
			errors: {
				email: 'Votre email est incorrecte!!!'
			},
			success: false
		});
	}

	const match = await bcrypt.compare(password, user.password);
	if (!!!match) {
		return res.send({
			errors: {
				password: 'Votre mot de passe est incorrecte!!!'
			},
			success: false
		});
	}

	if (user.role == role.PLAYER) {
		console.log({user});
		const player = await PlayerModel.findOne({ profile: user.id })
		console.log({player})
		const token = generateToken(user, player);
		console.log({token})
	
		return res.send({
			user: user,
			player,
			token,
			success: true
		});
	}
};
module.exports = { userRegister, userLogin, getUserByToken };
