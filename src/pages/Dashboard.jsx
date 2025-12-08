import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const dashboardCards = [
        {
            title: 'Books',
            icon: '📚',
            description: 'Manage book inventory',
            path: '/books',
            color: '#667eea',
        },
        {
            title: 'Stationary',
            icon: '✏️',
            description: 'Manage stationary items',
            path: '/stationary',
            color: '#f093fb',
        },
        {
            title: 'Customers',
            icon: '👥',
            description: 'Manage customer information',
            path: '/customers',
            color: '#4facfe',
        },
        {
            title: 'Suppliers',
            icon: '🏢',
            description: 'Manage supplier details',
            path: '/suppliers',
            color: '#43e97b',
        },
        {
            title: 'Orders',
            icon: '🧾',
            description: 'View and create orders',
            path: '/orders',
            color: '#fa709a',
        },
    ];

    // Add Users card only for owners
    if (user?.role === 'owner') {
        dashboardCards.push({
            title: 'Users',
            icon: '👤',
            description: 'Manage system users',
            path: '/users',
            color: '#764ba2',
        });
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.username}! 👋</h1>
                <p>What would you like to manage today?</p>
            </div>

            <div className="dashboard-grid">
                {dashboardCards.map((card) => (
                    <div
                        key={card.path}
                        className="dashboard-card"
                        onClick={() => navigate(card.path)}
                        style={{ '--card-color': card.color }}
                    >
                        <div className="card-icon">{card.icon}</div>
                        <h3 className="card-title">{card.title}</h3>
                        <p className="card-description">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
