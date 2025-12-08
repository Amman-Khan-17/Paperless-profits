import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, ownerOnly = false }) => {
    const { isAuthenticated, isOwner } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (ownerOnly && !isOwner) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
