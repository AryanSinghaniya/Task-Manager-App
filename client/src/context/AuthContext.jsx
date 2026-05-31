import { createContext, useEffect, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const restoreSession = async () => {
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const { data } = await api.get('/api/auth/me');
				setUser(data);
			} catch (error) {
				localStorage.removeItem('token');
				setToken(null);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		restoreSession();
	}, [token]);

	useEffect(() => {
		const expired = sessionStorage.getItem('taskflow:session-expired');
		if (!expired) return;

		sessionStorage.removeItem('taskflow:session-expired');
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
		setLoading(false);
	}, []);

	const handleAuthSuccess = (data) => {
		localStorage.setItem('token', data.token);
		setToken(data.token);
		setUser({ _id: data._id, name: data.name, email: data.email });
	};

	const login = async (email, password) => {
		const { data } = await api.post('/api/auth/login', { email, password });
		handleAuthSuccess(data);
		return data;
	};

	const register = async (name, email, password) => {
		const { data } = await api.post('/api/auth/register', { name, email, password });
		handleAuthSuccess(data);
		return data;
	};

	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	};

	const value = {
		user,
		token,
		loading,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
