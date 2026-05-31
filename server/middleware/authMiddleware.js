const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			const error = new Error('Not authorized, no token');
			error.statusCode = 401;
			throw error;
		}

		const token = authHeader.split(' ')[1];

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			const authError = new Error('Not authorized, token failed');
			authError.statusCode = 401;
			throw authError;
		}

		const user = await User.findById(decoded.id).select('-password');

		if (!user) {
			const error = new Error('Not authorized, user not found');
			error.statusCode = 401;
			throw error;
		}

		req.user = user;
		next();
	} catch (error) {
		error.statusCode = error.statusCode || 401;
		next(error);
	}
};

module.exports = { protect };
