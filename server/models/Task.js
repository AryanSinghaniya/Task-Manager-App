const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 500,
			default: '',
		},
		stage: {
			type: String,
			enum: ['Todo', 'In Progress', 'Done'],
			default: 'Todo',
		},
		priority: {
			type: String,
			enum: ['Low', 'Medium', 'High'],
			default: 'Medium',
		},
		dueDate: {
			type: Date,
			default: null,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Task', taskSchema);
