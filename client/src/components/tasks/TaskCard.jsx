import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { formatTaskDate, getPriorityTone, formatDueDate, getDueDateStatus } from '../../utils/helpers';
import { fireSmallConfetti } from '../../utils/confetti';
import { useToast } from '../../hooks/useToast';

const stageOptions = ['Todo', 'In Progress', 'Done'];

const TaskCard = ({ task, onEdit, onDelete, onStageChange, index }) => {
	const [confirmDelete, setConfirmDelete] = useState(false);

	const { showToast } = useToast();

	const handleStageClick = async (newStage) => {
		if (newStage === 'Done' && task.stage !== 'Done') {
			try {
				await onStageChange(task, newStage);
				fireSmallConfetti();
				showToast({ type: 'success', message: '🎉 Task completed! Great work!', duration: 4000 });
			} catch (err) {
				// swallow; onStageChange should show its own error
			}
		} else {
			onStageChange(task, newStage);
		}
	};

	const borderClass = {
		High: 'task-card--priority-high',
		Medium: 'task-card--priority-medium',
		Low: 'task-card--priority-low',
	}[task.priority];

	const priorityTone = getPriorityTone(task.priority);

	const handleDeleteClick = () => {
		if (!confirmDelete) {
			setConfirmDelete(true);
			return;
		}

		onDelete(task);
	};

	const dueLabel = formatDueDate(task.dueDate);
	const dueStatus = task.dueDate ? getDueDateStatus(task.dueDate, task.stage) : null;

	return (
		<Draggable draggableId={String(task._id)} index={index}>
			{(provided, snapshot) => (
				<article
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={`task-card ${borderClass ?? ''}${confirmDelete ? ' task-card--confirm' : ''}`}
					style={{
						...provided.draggableProps.style,
						opacity: snapshot.isDragging ? 0.85 : 1,
						transform: snapshot.isDragging ? `${provided.draggableProps.style?.transform} rotate(2deg)` : provided.draggableProps.style?.transform,
						boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'var(--shadow)',
						transition: snapshot.isDragging ? 'none' : 'box-shadow 200ms ease',
						cursor: snapshot.isDragging ? 'grabbing' : 'grab',
					}}
				>
					<div className="task-card__top">
						<span className="task-card__drag-handle" aria-hidden style={{ marginRight: 6, cursor: 'grab' }}>⠿</span>
						<span className={`task-badge task-badge--${priorityTone}`}>{task.priority}</span>
						<span className={`task-badge task-badge--stage-${task.stage.toLowerCase().replace(/\s+/g, '-')}`}>{task.stage}</span>
					</div>

					<h4 className="task-card__title">{task.title}</h4>
					{task.description ? <p className="task-card__description">{task.description}</p> : null}

					<div className="task-card__stage-switch" aria-label={`Change stage for ${task.title}`}>
						{stageOptions.map((stage) => (
							<button
								key={stage}
								type="button"
								className={`task-stage-switch__button${task.stage === stage ? ' is-active' : ''}`}
								onClick={() => handleStageClick(stage)}
								aria-pressed={task.stage === stage}
							>
								{stage}
							</button>
						))}
					</div>

					<div className="task-card__footer">
						<span className="task-card__date">{formatTaskDate(task.createdAt)}</span>

						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							{task.stage === 'Done' ? (
								<span className="task-badge task-badge--success">✓ Completed</span>
							) : dueStatus === 'overdue' ? (
								<span className="task-due task-due--overdue">⚠ Overdue — {dueLabel ?? ''}</span>
							) : dueStatus === 'due-today' ? (
								<span className="task-due task-due--today">📅 Due Today</span>
							) : dueStatus === 'due-soon' ? (
								<span className="task-due task-due--soon">📅 {dueLabel}</span>
							) : dueStatus === 'normal' && dueLabel ? (
								<span className="task-due task-due--normal">{dueLabel}</span>
							) : null}

							<div className="task-card__actions">
								<button type="button" className="task-icon-button" onClick={() => onEdit(task)} aria-label="Edit task">
									✏️
								</button>
								<button type="button" className={`task-icon-button task-icon-button--delete${confirmDelete ? ' is-armed' : ''}`} onClick={handleDeleteClick} aria-label="Delete task">
									🗑️
								</button>
							</div>
						</div>
					</div>

					{confirmDelete ? <div className="task-card__confirm-hint">Click delete again to confirm</div> : null}
				</article>
			)}
		</Draggable>
	);
};

export default TaskCard;
