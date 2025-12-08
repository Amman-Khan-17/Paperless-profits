import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Books/BookForm.css';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isOwner } = useAuth();
    const isEditMode = !!id && id !== 'new';

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'sales_man',
        status: 'Active',
    });

    useEffect(() => {
        if (!isOwner) {
            navigate('/');
            return;
        }

        if (isEditMode) {
            setFormData({
                username: 'sales_john',
                email: 'john@paperlessprofits.com',
                password: '',
                role: 'sales_man',
                status: 'Active',
            });
        }
    }, [id, isEditMode, isOwner, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting user:', formData);
        navigate('/users');
    };

    const handleCancel = () => {
        navigate('/users');
    };

    if (!isOwner) {
        return null;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{isEditMode ? '✏️ Edit User' : '➕ Add New User'}</h1>
                <p>{isEditMode ? 'Update user information' : 'Create a new system user'}</p>
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
                            <label htmlFor="email">Email *</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="user@paperlessprofits.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="password">
                                Password {isEditMode ? '(leave blank to keep current)' : '*'}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required={!isEditMode}
                            />
                        </div>

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
                            {isEditMode ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
