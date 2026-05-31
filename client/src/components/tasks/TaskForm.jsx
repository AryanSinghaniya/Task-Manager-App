import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const defaultValues = {
	title: '',
	description: '',
	stage: 'Todo',
	priority: 'Medium',
	dueDate: null,
};

const priorityOptions = [
	{ value: 'High', label: '🔴 High' },
	{ value: 'Medium', label: '🟡 Medium' },
	{ value: 'Low', label: '🟢 Low' },
];

const stageOptions = ['Todo', 'In Progress', 'Done'];

const TaskForm = ({ onSubmit, initialValues, isLoading = false, mode = 'create', onDirtyChange }) => {
	const [form, setForm] = useState(defaultValues);
	const titleRef = useRef(null);
	const [errors, setErrors] = useState({ title: '' });

	useEffect(() => {
		setForm({
			title: initialValues?.title ?? '',
			description: initialValues?.description ?? '',
			stage: initialValues?.stage ?? 'Todo',
			priority: initialValues?.priority ?? 'Medium',
			dueDate: initialValues?.dueDate ? initialValues.dueDate.split('T')[0] : null,
		});
		setErrors({ title: '' });
		onDirtyChange?.(false);
	}, [initialValues]);

	useEffect(() => {
		const baseline = {
			title: initialValues?.title ?? '',
			description: initialValues?.description ?? '',
			stage: initialValues?.stage ?? 'Todo',
			priority: initialValues?.priority ?? 'Medium',
			dueDate: initialValues?.dueDate ? initialValues.dueDate.split('T')[0] : null,
		};
		const dirty = ['title', 'description', 'stage', 'priority', 'dueDate'].some((field) => form[field] !== baseline[field]);
		onDirtyChange?.(dirty);
	}, [form, initialValues, onDirtyChange]);

	const submitLabel = useMemo(() => (mode === 'edit' ? 'Saving...' : 'Creating...'), [mode]);

	const validate = () => {
		if (!form.title.trim()) {
			setErrors({ title: 'Title is required' });
			return false;
		}

		if (form.title.trim().length > 100) {
			setErrors({ title: 'Title must be 100 characters or less' });
			return false;
		}

		setErrors({ title: '' });
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!validate()) return;

		await onSubmit({
			...form,
			title: form.title.trim(),
			description: form.description.trim(),
		});
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));

		// Restore focus to title input after updates so caret doesn't jump out
		if (name === 'title') {
			setTimeout(() => titleRef.current?.focus(), 0);
		}

		if (name === 'title' && errors.title) {
			setErrors({ title: '' });
		}
	};

	const clearDueDate = () => {
		setForm((current) => ({ ...current, dueDate: null }));
	};

	return (
		<form className="task-form" onSubmit={handleSubmit} noValidate>
			<Input
				label="Title"
				name="title"
				type="text"
				maxLength={100}
				placeholder="Task title"
				value={form.title}
				onChange={handleChange}
				error={errors.title}
				inputRef={titleRef}
				suffix={<span className="field__counter">{form.title.length}/100</span>}
			/>

			<div className="field">
				<label className="field__label" htmlFor="task-description">
					Description
				</label>
				<textarea
					id="task-description"
					className="textarea"
					name="description"
					rows={3}
					placeholder="Add a short note about this task"
					value={form.description}
					onChange={handleChange}
				/>
			</div>

			<div className="field">
				<label className="field__label" htmlFor="task-due">
					Due Date <span className="muted">(optional)</span>
				</label>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input
						id="task-due"
						className="input"
						type="date"
						name="dueDate"
						value={form.dueDate ?? ''}
						onChange={handleChange}
						min={new Date().toISOString().slice(0, 10)}
						style={{ flex: 1 }}
					/>
					{form.dueDate ? (
						<button type="button" className="button button--ghost" onClick={clearDueDate} onMouseDown={(e) => e.preventDefault()} aria-label="Clear due date">
							×
						</button>
					) : null}
				</div>
			</div>

			<div className="task-form__grid">
				<div className="field">
					<label className="field__label" htmlFor="task-stage">
						Stage
					</label>
					<select id="task-stage" className="select" name="stage" value={form.stage} onChange={handleChange}>
						{stageOptions.map((stage) => (
							<option key={stage} value={stage}>
								{stage}
							</option>
						))}
					</select>
				</div>

				<div className="field">
					<label className="field__label" htmlFor="task-priority">
						Priority
					</label>
					<select id="task-priority" className="select" name="priority" value={form.priority} onChange={handleChange}>
						{priorityOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<Button type="submit" className="button--full" loading={isLoading}>
				{isLoading ? submitLabel : mode === 'edit' ? 'Save changes' : 'Create task'}
			</Button>
		</form>
	);
};

export default TaskForm;
