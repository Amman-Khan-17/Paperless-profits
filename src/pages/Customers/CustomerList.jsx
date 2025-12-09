import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import Modal from '../../components/Modal'; // Import Modal
import { useToast } from '../../context/ToastContext'; // Import Toast
import { customersAPI } from '../../services/customers';
import '../Books/BookList.css';

const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); // Add Loading State for Delete
    const toast = useToast(); // Initialize Toast

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await customersAPI.getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers", error);
                toast.error("Failed to load customer list.");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [toast]);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'total_orders', label: 'Total Orders' },
    ];

    const handleEdit = (customer) => {
        navigate(`/customers/${customer.id}`);
    };

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!customerToDelete) return;
        setIsDeleting(true);

        try {
            await customersAPI.deleteCustomer(customerToDelete.id);
            setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
            toast.success("Customer deleted successfully! 🗑️");
            setIsModalOpen(false);
            setCustomerToDelete(null);
        } catch (error) {
            console.error("Failed to delete customer", error);
            const msg = error?.message || "Failed to delete customer.";
            // Specific check for Foreign Key Constraints
            if (msg.toLowerCase().includes("foreign key") || msg.toLowerCase().includes("constraint")) {
                toast.error("Cannot delete: Customer has active orders.");
            } else {
                toast.error(`Deletion failed: ${msg}`);
            }
            setIsModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAdd = () => {
        navigate('/customers/new');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👥 Customers</h1>
                <p>Manage customer information</p>
            </div>

            <Table
                columns={columns}
                data={customers}
                onEdit={handleEdit}
                onDelete={handleDeleteClick} // Use Modal Trigger
                onAdd={handleAdd}
                addButtonText="Add New Customer"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Customer?"
                message={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default CustomerList;
