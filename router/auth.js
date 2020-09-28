
const { userRegister, userLogin } = require('../util/Auths');
const { UserRole } = require('../helper/constant');
const AuthRouter = require('express').Router();

//User Login Route
AuthRouter.post('/login', async function(req, res, next) {
	userLogin({
		body: req.body,
		role: UserRole,
		res
	});
});
AuthRouter.post('/login/admin', async function(req, res, next) {
	//console.log("loginnn")
	userLogin({
		body: req.body,
		role: UserRole,
		res
	});
});
//user Registeration Route
AuthRouter.post('/register', async (req, res) => {
	userRegister({
		body: req.body,
		role: UserRole.PLAYER,
		res
	});
});

module.exports = AuthRouter;
