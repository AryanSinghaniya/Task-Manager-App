import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="page-center">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
