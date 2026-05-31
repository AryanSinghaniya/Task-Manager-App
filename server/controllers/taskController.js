const Task = require('../models/Task');

const findOwnedTask = async (id, ownerId) => {
	try {
		return await Task.findOne({ _id: id, owner: ownerId });
	} catch (error) {
		if (error.name === 'CastError') {
			return null;
		}

		throw error;
	}
};

const getTasks = async (req, res, next) => {
	try {
		const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });

		const enriched = tasks.map((task) => {
			const obj = task.toObject({ getters: true });
			const isOverdue = obj.dueDate && new Date(obj.dueDate) < new Date() && obj.stage !== 'Done';
			return { ...obj, isOverdue };
		});

		res.status(200).json(enriched);
	} catch (error) {
		next(error);
	}
};

const createTask = async (req, res, next) => {
	try {
		const { title, description, stage, priority, dueDate } = req.body;

		if (!title) {
			res.status(400);
			throw new Error('Title is required');
		}

		const task = await Task.create({
			title,
			description,
			stage,
			priority,
			dueDate: dueDate ? new Date(dueDate) : null,
			owner: req.user._id,
		});

		res.status(201).json(task);
	} catch (error) {
		next(error);
	}
};

const updateTask = async (req, res, next) => {
	try {
		const task = await findOwnedTask(req.params.id, req.user._id);

		if (!task) {
			res.status(404);
			throw new Error('Task not found');
		}

		const fields = ['title', 'description', 'stage', 'priority', 'dueDate'];
		fields.forEach((field) => {
			if (req.body[field] !== undefined) {
				task[field] = req.body[field];
			}
		});

		const updatedTask = await task.save();
		res.status(200).json(updatedTask);
	} catch (error) {
		next(error);
	}
};

const deleteTask = async (req, res, next) => {
	try {
		const task = await findOwnedTask(req.params.id, req.user._id);

		if (!task) {
			res.status(404);
			throw new Error('Task not found');
		}

		await task.deleteOne();
		res.status(200).json({ message: 'Task deleted' });
	} catch (error) {
		next(error);
	}
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
