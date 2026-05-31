import { BrowserRouter, Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Toast from './components/common/Toast';
import Spinner from './components/common/Spinner';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

const PublicRoute = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="page-center">
				<Spinner size="lg" />
			</div>
		);
	}

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};

const RoutedApp = () => {
	const location = useLocation();

	return (
		<div className="route-shell" key={`${location.pathname}${location.search}`}>
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<DashboardPage />} />
				</Route>
			</Routes>
		</div>
	);
};

const App = () => {
	return (
		<ThemeProvider>
			<ToastProvider>
				<AuthProvider>
					<TaskProvider>
						<BrowserRouter>
							<Toast />
							<RoutedApp />
						</BrowserRouter>
					</TaskProvider>
				</AuthProvider>
			</ToastProvider>
		</ThemeProvider>
	);
};

export default App;
