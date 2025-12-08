import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/Table';
import { dummyUsers } from '../../services/users';
import '../Books/BookList.css';

const UserList = () => {
    const navigate = useNavigate();
    const { isOwner } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Redirect if not owner
        if (!isOwner) {
            navigate('/');
            return;
        }
        setUsers(dummyUsers);
    }, [isOwner, navigate]);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Role',
            render: (role) => (
                <span className={`badge badge-${role}`}>
                    {role === 'owner' ? 'Owner' : 'Sales Person'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (status) => (
                <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
            ),
        },
    ];

    const handleEdit = (user) => {
        navigate(`/users/${user.id}`);
    };

    const handleDelete = (user) => {
        if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
            setUsers(users.filter((u) => u.id !== user.id));
        }
    };

    const handleAdd = () => {
        navigate('/users/new');
    };

    if (!isOwner) {
        return null;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👤 Users Management</h1>
                <p>Manage system users and permissions</p>
            </div>

            <Table
                columns={columns}
                data={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
                addButtonText="Add New User"
            />
        </div>
    );
};

export default UserList;
