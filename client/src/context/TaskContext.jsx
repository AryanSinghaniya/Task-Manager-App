import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

export const TaskContext = createContext(null);

const normalizeError = (error, fallback) => {
	if (!error.response) {
		return 'Connection failed. Check your internet.';
	}

	return error.response?.data?.message || error.message || fallback;
};

export const TaskProvider = ({ children }) => {
	const { user } = useAuth();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchTasks = useCallback(async () => {
		if (!user) {
			setTasks([]);
			setError(null);
			setLoading(false);
			return [];
		}

		setLoading(true);
		setError(null);

		try {
			const { data } = await api.get('/api/tasks');
			setTasks(data);
			return data;
		} catch (error) {
			const message = normalizeError(error, 'Failed to load tasks');
			setError(message);
			return [];
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			fetchTasks();
			return;
		}

		setTasks([]);
		setError(null);
		setLoading(false);
	}, [user, fetchTasks]);

	const createTask = useCallback(async (taskInput) => {
		const tempId = `temp-${Date.now()}`;
		const optimisticTask = {
			_id: tempId,
			...taskInput,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		setTasks((current) => [optimisticTask, ...current]);
		setError(null);

		try {
			const { data } = await api.post('/api/tasks', taskInput);
			setTasks((current) => current.map((task) => (task._id === tempId ? data : task)));
			return data;
		} catch (error) {
			setTasks((current) => current.filter((task) => task._id !== tempId));
			const message = normalizeError(error, 'Failed to create task');
			setError(message);
			throw error;
		}
	}, []);

	const updateTask = useCallback(async (taskId, updates) => {
		let rollbackTask = null;

		setTasks((current) =>
			current.map((task) => {
				if (task._id !== taskId) return task;
				rollbackTask = task;
				return { ...task, ...updates };
			})
		);
		setError(null);

		try {
			const { data } = await api.patch(`/api/tasks/${taskId}`, updates);
			setTasks((current) => current.map((task) => (task._id === taskId ? data : task)));
			return data;
		} catch (error) {
			if (rollbackTask) {
				setTasks((current) => current.map((task) => (task._id === taskId ? rollbackTask : task)));
			}
			const message = normalizeError(error, 'Failed to update task');
			setError(message);
			throw error;
		}
	}, []);

	const deleteTask = useCallback(async (taskId) => {
		let removedTask = null;

		setTasks((current) => {
			removedTask = current.find((task) => task._id === taskId) ?? null;
			return current.filter((task) => task._id !== taskId);
		});
		setError(null);

		try {
			await api.delete(`/api/tasks/${taskId}`);
			return removedTask;
		} catch (error) {
			if (removedTask) {
				setTasks((current) => [removedTask, ...current]);
			}
			const message = normalizeError(error, 'Failed to delete task');
			setError(message);
			throw error;
		}
	}, []);

	const restoreTask = useCallback((task) => {
		if (!task) return;

		setTasks((current) => {
			if (current.some((existingTask) => existingTask._id === task._id)) {
				return current;
			}

			return [task, ...current].sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
		});
	}, []);

	const value = useMemo(
		() => ({
			tasks,
			loading,
			error,
			fetchTasks,
			createTask,
			updateTask,
			deleteTask,
			restoreTask,
		}),
		[tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, restoreTask]
	);

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
