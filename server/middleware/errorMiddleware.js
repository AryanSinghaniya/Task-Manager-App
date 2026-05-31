const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	error.statusCode = 404;
	next(error);
};

const errorHandler = (error, req, res, next) => {
	const statusCode = error.statusCode || res.statusCode || 500;

	res.status(statusCode).json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
	});
};

module.exports = { notFound, errorHandler };
