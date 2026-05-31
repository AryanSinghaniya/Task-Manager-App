export const formatTaskDate = (value) => {
	if (!value) return '';

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';

	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDueDate = (value) => {
	if (!value) return null;

	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return null;

	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const startOfTomorrow = new Date(startOfToday);
	startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
	const startOfYesterday = new Date(startOfToday);
	startOfYesterday.setDate(startOfYesterday.getDate() - 1);

	const diffMs = d.setHours(0,0,0,0) - startOfToday.getTime();
	const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

	if (d >= startOfToday && d < startOfTomorrow) return 'Due Today';
	if (d >= startOfTomorrow && d < new Date(startOfTomorrow.getFullYear(), startOfTomorrow.getMonth(), startOfTomorrow.getDate() + 1)) return 'Due Tomorrow';
	if (d >= startOfYesterday && d < startOfToday) return 'Yesterday';
	if (diffDays > 0 && diffDays <= 7) return `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;

	return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getDueDateStatus = (value, stage) => {
	if (!value) return null;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return null;

	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const diffMs = d.setHours(0,0,0,0) - today.getTime();
	const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

	if (d < today && stage !== 'Done') return 'overdue';
	if (diffDays === 0) return 'due-today';
	if (diffDays > 0 && diffDays <= 2) return 'due-soon';
	return 'normal';
};

export const getInitials = (name = '') =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('') || 'U';

export const getGreeting = (date = new Date()) => {
	const hour = date.getHours();

	if (hour < 12) return 'Good morning';
	if (hour < 18) return 'Good afternoon';
	return 'Good evening';
};

export const getPriorityTone = (priority) => {
	if (priority === 'High') return 'danger';
	if (priority === 'Low') return 'success';
	return 'warning';
};

export const getStageTone = (stage) => {
	if (stage === 'In Progress') return 'warning';
	if (stage === 'Done') return 'success';
	return 'primary';
};

export const getTaskStats = (tasks = []) => {
	const total = tasks.length;
	const todo = tasks.filter((t) => t.stage === 'Todo').length;
	const inProgress = tasks.filter((t) => t.stage === 'In Progress').length;
	const done = tasks.filter((t) => t.stage === 'Done').length;
	const overdueCount = tasks.filter((t) => t.isOverdue).length;
	const highPriority = tasks.filter((t) => t.priority === 'High').length;

	const now = new Date();
	const sevenDaysAgo = new Date(now);
	sevenDaysAgo.setDate(now.getDate() - 6);
	sevenDaysAgo.setHours(0, 0, 0, 0);

	const completedThisWeek = tasks.filter((t) => {
		if (t.stage !== 'Done') return false;
		const updated = t.updatedAt ? new Date(t.updatedAt) : null;
		if (!updated || Number.isNaN(updated.getTime())) return false;
		return updated >= sevenDaysAgo;
	}).length;

	const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

	return { total, todo, inProgress, done, completionRate, overdueCount, highPriority, completedThisWeek };
};

export const getWeeklyData = (tasks = []) => {
	const result = [];
	const now = new Date();

	// build last 7 days array (oldest first)
	for (let i = 6; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(now.getDate() - i);
		d.setHours(0, 0, 0, 0);
		result.push({ date: new Date(d), day: d.toLocaleDateString('en-US', { weekday: 'short' }), created: 0, completed: 0 });
	}

	tasks.forEach((t) => {
		if (t.createdAt) {
			const created = new Date(t.createdAt);
			if (!Number.isNaN(created.getTime())) {
				const day = new Date(created);
				day.setHours(0, 0, 0, 0);
				const idx = result.findIndex((r) => r.date.getTime() === day.getTime());
				if (idx >= 0) result[idx].created += 1;
			}
		}

		if (t.stage === 'Done' && t.updatedAt) {
			const updated = new Date(t.updatedAt);
			if (!Number.isNaN(updated.getTime())) {
				const day = new Date(updated);
				day.setHours(0, 0, 0, 0);
				const idx = result.findIndex((r) => r.date.getTime() === day.getTime());
				if (idx >= 0) result[idx].completed += 1;
			}
		}
	});

	return result.map((r) => ({ day: r.day, created: r.created, completed: r.completed }));
};

export const getPriorityDistribution = (tasks = []) => {
	const high = tasks.filter((t) => t.priority === 'High').length;
	const medium = tasks.filter((t) => t.priority === 'Medium').length;
	const low = tasks.filter((t) => t.priority === 'Low').length;

	return [
		{ name: 'High', value: high, color: '#ef4444' },
		{ name: 'Medium', value: medium, color: '#f59e0b' },
		{ name: 'Low', value: low, color: '#22c55e' },
	];
};
