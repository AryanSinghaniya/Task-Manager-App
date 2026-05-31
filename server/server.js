const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL,
	})
);
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Task Manager API is running',
		status: 'ok',
	});
});

app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'ok',
		time: new Date().toISOString(),
	});
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Server startup failed:', error.message);
		process.exit(1);
	}
};

startServer();
