import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { usersAPI } from '../../services/users'; // Updated import
import '../Books/BookList.css';

const UserList = () => {
    const navigate = useNavigate();
    const { isOwner } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        // Redirect if not owner
        if (!isOwner) {
            navigate('/');
            return;
        }

        const fetchUsers = async () => {
            try {
                const data = await usersAPI.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
                toast.error("Failed to load users list.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [isOwner, navigate, toast]);

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

    const handleDeleteClick = (user) => {
        if (!isOwner) {
            toast.error("Only Owners can delete users.");
            return;
        }
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);

        try {
            await usersAPI.deleteUser(userToDelete.id);
            setUsers(users.filter((u) => u.id !== userToDelete.id));
            toast.success("User deleted successfully! 👤");
            setIsModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Failed to delete user", error);
            const msg = error?.message || "Failed to delete user.";
            toast.error(`Deletion failed: ${msg}`);
            setIsModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAdd = () => {
        navigate('/users/new');
    };

    if (!isOwner) {
        return null;
    }

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👤 Staff Management</h1>
                <p>Manage system access and roles</p>
            </div>

            <Table
                columns={columns}
                data={users}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User?"
                message={`Are you sure you want to delete user "${userToDelete?.username}"? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default UserList;
