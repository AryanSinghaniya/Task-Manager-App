import Button from '../common/Button';
import SkeletonCard from '../common/SkeletonCard';
import TaskColumn from './TaskColumn';
import { useTasks } from '../../hooks/useTasks';
import { getDueDateStatus } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import { DragDropContext } from '@hello-pangea/dnd';
import { fireConfetti } from '../../utils/confetti';

const stages = ['Todo', 'In Progress', 'Done'];

const KanbanBoard = ({ onEditTask, onAddTask, onDeleteTask, filterMode = 'all' }) => {
	const { tasks, loading, error, fetchTasks, updateTask } = useTasks();
	const { showToast } = useToast();

	const handleStageChange = async (task, nextStage) => {
		if (task.stage === nextStage) return;
		await updateTask(task._id, { stage: nextStage });
	};

	const applyFilter = (task) => {
		if (!filterMode || filterMode === 'all') return true;

		if (filterMode === 'overdue') return !!task.isOverdue || getDueDateStatus(task.dueDate, task.stage) === 'overdue';

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		if (filterMode === 'due-today') return getDueDateStatus(task.dueDate, task.stage) === 'due-today';

		if (filterMode === 'this-week') {
			if (!task.dueDate) return false;
			const d = new Date(task.dueDate);
			const diff = Math.ceil((d.setHours(0,0,0,0) - today.getTime()) / (1000 * 60 * 60 * 24));
			return diff >= 0 && diff <= 7;
		}

		return true;
	};

	const handleDragEnd = async (result) => {
		const { source, destination, draggableId } = result || {};

		if (!destination) return;
		if (source?.droppableId === destination.droppableId) return;

		const task = tasks.find((t) => String(t._id) === String(draggableId));
		if (!task) return;

		// Optimistic UI update via updateTask (updates local state immediately)
		const op = updateTask(task._id, { stage: destination.droppableId });

		try {
			await op;

			// If moved into Done from another column, celebrate
			if (destination.droppableId === 'Done' && source.droppableId !== 'Done') {
				setTimeout(() => fireConfetti(), 150);
				showToast({ type: 'success', message: '🎉 Task completed! Great work!', duration: 4000 });
			}
		} catch (err) {
			showToast({ type: 'error', message: 'Failed to move task' });
		}
	};

	return (
		<section className="kanban-board">
			{error ? (
				<div className="banner banner--error">
					<span>{error}</span>
					<Button size="sm" variant="ghost" onClick={fetchTasks}>
						Retry
					</Button>
				</div>
			) : null}

			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="kanban-board__grid">
					{loading
						? stages.map((stage) => (
								<section key={stage} className="task-column task-column--loading" aria-hidden="true">
									<header className="task-column__header">
										<div className="task-column__title-wrap">
											<span className="task-column__icon">⋯</span>
											<h3>{stage}</h3>
										</div>
										<span className="task-column__count">3</span>
									</header>
									<div className="task-column__list">
										<SkeletonCard />
										<SkeletonCard />
										<SkeletonCard />
									</div>
								</section>
							))
								: stages.map((stage) => {
										// apply active filter to tasks for this column
										const stageTasks = tasks.filter((task) => task.stage === stage).filter(applyFilter);

										return (
											<TaskColumn
												key={stage}
												stage={stage}
												tasks={stageTasks}
												onEdit={onEditTask}
												onDelete={onDeleteTask}
												onStageChange={handleStageChange}
												onAddTask={onAddTask}
											/>
										);
									})}
				</div>
			</DragDropContext>
		</section>
	);
};

export default KanbanBoard;
