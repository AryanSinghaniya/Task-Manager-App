import Button from '../common/Button';
import TaskCard from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';

const stageMeta = {
	Todo: { label: 'Todo', className: 'task-column--todo', icon: '◌' },
	'In Progress': { label: 'In Progress', className: 'task-column--progress', icon: '⏳' },
	Done: { label: 'Done', className: 'task-column--done', icon: '✓' },
};

const TaskColumn = ({ stage, tasks, onEdit, onDelete, onStageChange, onAddTask }) => {
	const meta = stageMeta[stage] ?? stageMeta.Todo;

	return (
		<section className={`task-column ${meta.className}`}>
			<header className="task-column__header">
				<div className="task-column__title-wrap">
					<span className="task-column__icon">{meta.icon}</span>
					<h3>{meta.label}</h3>
				</div>
				<span className="task-column__count">{tasks.length}</span>
			</header>

			<Droppable droppableId={stage}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						role="list"
						style={{
							background: snapshot.isDraggingOver ? 'var(--primary-light)' : 'transparent',
							transition: 'background 200ms ease',
							minHeight: '100px',
							borderRadius: 'var(--radius)',
							padding: '4px',
						}}
					>
						{tasks.length ? (
							tasks.map((task, index) => (
								<TaskCard key={task._id} task={task} index={index} onEdit={onEdit} onDelete={onDelete} onStageChange={onStageChange} />
							))
						) : (
							<div className="task-column__empty">
								<div className="task-column__empty-icon">⋯</div>
								<p>No tasks here</p>
							</div>
						)}

						{provided.placeholder}
					</div>
				)}
			</Droppable>

			<Button variant="secondary" size="sm" className="task-column__add" onClick={() => onAddTask(stage)}>
				Add task
			</Button>
		</section>
	);
};

export default TaskColumn;
