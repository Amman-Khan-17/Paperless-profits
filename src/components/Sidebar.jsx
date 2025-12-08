import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useAuth();
    const isOwner = user?.role === 'owner';

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '🏠' },
        { path: '/books', label: 'Books', icon: '📚' },
        { path: '/stationary', label: 'Stationary', icon: '✏️' },
        { path: '/customers', label: 'Customers', icon: '👥' },
        { path: '/suppliers', label: 'Suppliers', icon: '🏢' },
        { path: '/orders', label: 'Orders', icon: '🧾' },
    ];

    // Add Users link only for owners
    if (isOwner) {
        menuItems.push({ path: '/users', label: 'Users', icon: '👤' });
    }

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'sidebar-link active' : 'sidebar-link'
                        }
                        end={item.path === '/'}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
