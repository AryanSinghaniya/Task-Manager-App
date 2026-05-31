import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Navbar from '../components/layout/Navbar';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import { fireSmallConfetti } from '../utils/confetti';
import { getGreeting, getTaskStats, getWeeklyData, getPriorityDistribution } from '../utils/helpers';
import StatsBar from '../components/tasks/StatsBar';
const AnalyticsPanel = lazy(() => import('../components/tasks/AnalyticsPanel'));

const DashboardPage = () => {
	const { user, logout } = useAuth();
	const { tasks, loading, error, createTask, updateTask, deleteTask, restoreTask } = useTasks();
	const { showToast } = useToast();
	const [taskModal, setTaskModal] = useState({ isOpen: false, mode: 'create', initialValues: null });
	const [savingTask, setSavingTask] = useState(false);
	const [modalDirty, setModalDirty] = useState(false);
	const [dismissedError, setDismissedError] = useState(false);

	const handleLogout = () => {
		logout();
		showToast({ type: 'info', message: 'You have been signed out.' });
	};

	const taskCounts = useMemo(
		() => ({
			Todo: tasks.filter((task) => task.stage === 'Todo').length,
			'In Progress': tasks.filter((task) => task.stage === 'In Progress').length,
			Done: tasks.filter((task) => task.stage === 'Done').length,
		}),
		[tasks]
	);

	const openCreateTask = (stage = 'Todo') => {
		setModalDirty(false);
		setTaskModal({
			isOpen: true,
			mode: 'create',
			initialValues: { title: '', description: '', stage, priority: 'Medium' },
		});
	};

	const openEditTask = (task) => {
		setModalDirty(false);
		setTaskModal({
			isOpen: true,
			mode: 'edit',
			initialValues: task,
		});
	};

	const closeTaskModal = () => {
		if (savingTask) return;
		if (modalDirty && !window.confirm('Unsaved changes. Discard?')) return;
		setModalDirty(false);
		setTaskModal({ isOpen: false, mode: 'create', initialValues: null });
	};

	useEffect(() => {
		setDismissedError(false);
	}, [error]);

	const handleTaskSubmit = async (values) => {
		setSavingTask(true);

		try {
			if (taskModal.mode === 'edit' && taskModal.initialValues?._id) {
				const updated = await updateTask(taskModal.initialValues._id, values);
				showToast({ type: 'success', message: 'Task updated successfully.' });
				if (updated?.stage === 'Done' && taskModal.initialValues?.stage !== 'Done') {
					setTimeout(() => {
						fireSmallConfetti();
						showToast({ type: 'success', message: '🎉 Task completed! Great work!', duration: 4000 });
					}, 300);
				}
			} else {
				await createTask(values);
				showToast({ type: 'success', message: 'Task created successfully.' });
			}

			setModalDirty(false);
			closeTaskModal();
		} catch (error) {
			showToast({ type: 'error', message: error.response?.data?.message || 'Could not save task.' });
		} finally {
			setSavingTask(false);
		}
	};

	const handleDeleteTask = async (task) => {
		try {
			const deletedTask = await deleteTask(task._id);
		showToast({
			type: 'info',
			message: 'Task deleted',
			actionLabel: 'Undo',
			duration: 5000,
			onAction: async () => {
				restoreTask(deletedTask);
				showToast({ type: 'success', message: 'Task restored.' });
			},
		});
		} catch (error) {
			showToast({ type: 'error', message: error.response?.data?.message || 'Could not delete task.' });
		}
	};

	const greeting = getGreeting();

	const stats = useMemo(() => getTaskStats(tasks), [tasks]);
	const weeklyData = useMemo(() => getWeeklyData(tasks), [tasks]);
	const priorityData = useMemo(() => getPriorityDistribution(tasks), [tasks]);
	const isEmpty = !loading && tasks.length === 0;
	const showConnectionBanner = error === 'Connection failed. Check your internet.' && !dismissedError;

	const [filterMode, setFilterMode] = useState('all');

	const overdueCount = tasks.filter((t) => t.isOverdue).length;
	const overdueDismissed = sessionStorage.getItem('taskflow:overdue-dismissed') === '1';

	const handleDismissOverdue = () => {
		sessionStorage.setItem('taskflow:overdue-dismissed', '1');
		setDismissedError(true);
	};

	const handleOverdueClick = () => {
		const el = document.querySelector('.task-due--overdue');
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};

	return (
		<main className="dashboard-layout">
			<Navbar onLogout={handleLogout} />
			<section className="dashboard-content">
				{showConnectionBanner ? (
					<div className="banner banner--error banner--sticky">
						<span>Connection failed. Check your internet.</span>
						<Button size="sm" variant="ghost" onClick={() => window.location.reload()}>
							Retry
						</Button>
					</div>
				) : null}

				{isEmpty ? (
					<div className="empty-dashboard">
						<svg viewBox="0 0 480 320" className="empty-dashboard__illustration" aria-hidden="true">
							<defs>
								<linearGradient id="emptyGrad" x1="0" x2="1" y1="0" y2="1">
									<stop offset="0%" stopColor="#6366f1" />
									<stop offset="100%" stopColor="#a5b4fc" />
								</linearGradient>
							</defs>
							<rect x="24" y="32" width="432" height="248" rx="28" fill="#fff" stroke="#e2e8f0" />
							<rect x="56" y="64" width="160" height="20" rx="10" fill="#e0e7ff" />
							<rect x="56" y="104" width="120" height="16" rx="8" fill="#e2e8f0" />
							<rect x="56" y="142" width="368" height="80" rx="20" fill="#f1f5f9" />
							<circle cx="360" cy="134" r="38" fill="url(#emptyGrad)" opacity="0.95" />
							<path d="M350 134l10 10 18-22" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<h2>No tasks yet</h2>
						<p>Add your first task to start organizing Todo, In Progress, and Done work.</p>
						<Button onClick={() => openCreateTask('Todo')}>+ New Task</Button>
					</div>
				) : (
					<>
						<div className="dashboard-hero">
							<div>
								<p className="eyebrow">Dashboard</p>
								<h1>{greeting}{user?.name ? `, ${user.name}` : ''}! 👋</h1>
								<p className="dashboard-copy">Here's what's on your plate today</p>
							</div>
							<Button onClick={() => openCreateTask('Todo')}>+ New Task</Button>
						</div>

						<StatsBar stats={stats} loading={loading} />

						<div className="stats-bar">
							{[
								{ label: 'Todo', value: taskCounts.Todo, icon: '◌', tone: 'primary' },
								{ label: 'In Progress', value: taskCounts['In Progress'], icon: '⏳', tone: 'warning' },
								{ label: 'Done', value: taskCounts.Done, icon: '✓', tone: 'success' },
							].map((stat) => (
								<div key={stat.label} className={`stat-card stat-card--${stat.tone}`}>
									<div className="stat-card__icon">{stat.icon}</div>
									<div>
										<strong>{stat.value}</strong>
										<span>{stat.label}</span>
									</div>
								</div>
							))}
						</div>

						{overdueCount > 0 && !overdueDismissed ? (
							<div className="banner banner--warning banner--overdue">
								<span>⚠️ You have {overdueCount} overdue task(s). Review them below.</span>
								<div>
									<button className="button button--ghost" onClick={handleOverdueClick}>View</button>
									<button className="button button--ghost" onClick={handleDismissOverdue} aria-label="Dismiss">×</button>
								</div>
							</div>
						) : null}

						<Suspense fallback={<div className="analytics-panel"><div className="analytics-empty">Loading analytics...</div></div>}>
							<AnalyticsPanel weeklyData={weeklyData} priorityData={priorityData} loading={loading} />
						</Suspense>

						<div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
							{[
								{ key: 'all', label: 'All', tone: 'default' },
								{ key: 'due-today', label: 'Due Today' },
								{ key: 'this-week', label: 'This Week' },
								{ key: 'overdue', label: 'Overdue' },
							].map((pill) => (
								<button
									key={pill.key}
									className={`button ${filterMode === pill.key ? 'button--primary' : 'button--ghost'}`}
									onClick={() => setFilterMode(pill.key)}
								>
									{pill.label}
								</button>
							))}
						</div>

						<KanbanBoard filterMode={filterMode} onAddTask={openCreateTask} onEditTask={openEditTask} onDeleteTask={handleDeleteTask} />
					</>
				)}
			</section>

			<Modal
				isOpen={taskModal.isOpen}
				onClose={closeTaskModal}
				title={taskModal.mode === 'edit' ? 'Edit task' : 'Create task'}
				size="md"
			>
				<TaskForm onSubmit={handleTaskSubmit} initialValues={taskModal.initialValues} isLoading={savingTask} mode={taskModal.mode} onDirtyChange={setModalDirty} />
			</Modal>
		</main>
	);
};

export default DashboardPage;
