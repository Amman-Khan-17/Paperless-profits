import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; // Import Toast
import { usersAPI } from '../../services/users';
import { validation } from '../../utils/validation';
import '../Books/BookForm.css';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isOwner } = useAuth();
    const toast = useToast(); // Initialize Toast

    // Strict Edit Mode Only
    const isEditMode = true;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'sales_man',
        status: 'Active',
    });

    useEffect(() => {
        if (!isOwner) {
            navigate('/');
            return;
        }

        if (id === 'new') {
            toast.info("Creating users is done via Supabase Dashboard.", 4000);
            navigate('/users');
            return;
        }

        if (id) {
            usersAPI.getUserById(id).then(data => {
                setFormData({
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    status: data.status || 'Active',
                });
            }).catch(err => {
                console.error("Failed to fetch user", err);
                toast.error("Failed to fetch user details.");
            });
        }
    }, [id, isOwner, navigate, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.username.trim()) {
                toast.error("Username cannot be empty.");
                return;
            }

            if (!validation.isValidUsername(formData.username)) {
                toast.error("Username must be at least 3 characters and contain only letters, numbers, underscores, or hyphens.");
                return;
            }

            if (!validation.isValidEmail(formData.email)) {
                toast.error("Invalid email format.");
                return;
            }

            const updates = {
                username: formData.username.trim(),
                email: formData.email,
                role: formData.role,
                status: formData.status
            };
            await usersAPI.updateUser(id, updates);
            toast.success("Staff profile updated successfully! 🎉");
            navigate('/users');
        } catch (error) {
            console.error("Failed to update user", error);
            toast.error("Failed to update user profile.");
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    if (!isOwner) return null;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>✏️ Edit User Staff</h1>
                <p>Update staff details and roles</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="data-form">
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="username">Username *</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">Email (Read Only)</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="input-disabled"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="role">Role *</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="sales_man">Sales Person</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="status">Status *</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            Update Staff
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
