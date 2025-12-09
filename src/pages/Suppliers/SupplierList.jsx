import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import Modal from '../../components/Modal'; // Import Modal
import { useToast } from '../../context/ToastContext'; // Import Toast
import { suppliersAPI } from '../../services/suppliers';
import '../Books/BookList.css';

const SupplierList = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast(); // Initialize Toast

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await suppliersAPI.getSuppliers();
                setSuppliers(data);
            } catch (error) {
                console.error("Failed to fetch suppliers", error);
                toast.error("Failed to load suppliers.");
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, [toast]);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'total_supplies', label: 'Total Supplies' },
    ];

    const handleEdit = (supplier) => {
        navigate(`/suppliers/${supplier.id}`);
    };

    const handleDeleteClick = (supplier) => {
        setSupplierToDelete(supplier);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!supplierToDelete) return;
        setIsDeleting(true);

        try {
            await suppliersAPI.deleteSupplier(supplierToDelete.id);
            setSuppliers(suppliers.filter((s) => s.id !== supplierToDelete.id));
            toast.success("Supplier deleted successfully! 🗑️");
            setIsModalOpen(false);
            setSupplierToDelete(null);
        } catch (error) {
            console.error("Failed to delete supplier", error);
            const msg = error?.message || "Failed to delete supplier.";
            if (msg.toLowerCase().includes("foreign key") || msg.toLowerCase().includes("constraint")) {
                toast.error("Cannot delete: Supplier provides existing inventory.");
            } else {
                toast.error(`Deletion failed: ${msg}`);
            }
            setIsModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAdd = () => {
        navigate('/suppliers/new');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🏢 Suppliers</h1>
                <p>Manage supplier information</p>
            </div>

            <Table
                columns={columns}
                data={suppliers}
                onEdit={handleEdit}
                onDelete={handleDeleteClick} // Use Modal Trigger
                onAdd={handleAdd}
                addButtonText="Add New Supplier"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Supplier?"
                message={`Are you sure you want to delete "${supplierToDelete?.name}"? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default SupplierList;
