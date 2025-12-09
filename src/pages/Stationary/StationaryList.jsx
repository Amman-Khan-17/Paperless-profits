
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import Modal from '../../components/Modal'; // Import Modal
import { useToast } from '../../context/ToastContext'; // Import Toast
import { stationaryAPI } from '../../services/stationary';
import '../Books/BookList.css';

const StationaryList = () => {
    const navigate = useNavigate();
    const [stationary, setStationary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast(); // Initialize Toast

    useEffect(() => {
        const fetchStationary = async () => {
            try {
                const data = await stationaryAPI.getStationary();
                setStationary(data);
            } catch (error) {
                console.error("Failed to fetch stationary", error);
                toast.error("Failed to load stationary inventory.");
            } finally {
                setLoading(false);
            }
        };
        fetchStationary();
    }, [toast]);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        {
            key: 'price',
            label: 'Price',
            render: (price) => `$${price.toFixed(2)} `,
        },
        { key: 'stock', label: 'Stock' },
        { key: 'supplier', label: 'Supplier' },
    ];

    const handleEdit = (item) => {
        navigate(`/stationary/${item.id}`);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        try {
            await stationaryAPI.deleteStationary(itemToDelete.id);
            setStationary(stationary.filter((s) => s.id !== itemToDelete.id));
            toast.success("Item deleted successfully! 🗑️");
            setIsModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Failed to delete item", error);
            const msg = error?.message || "Failed to delete item.";
            // Assuming stationary might have orders too if we track item sales
            if (msg.toLowerCase().includes("foreign key") || msg.toLowerCase().includes("constraint")) {
                toast.error("Cannot delete: Item has linked orders.");
            } else {
                toast.error(`Deletion failed: ${msg}`);
            }
            setIsModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAdd = () => {
        navigate('/stationary/new');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>✏️ Stationary Inventory</h1>
                <p>Manage your stationary items</p>
            </div>

            <Table
                columns={columns}
                data={stationary}
                onEdit={handleEdit}
                onDelete={handleDeleteClick} // Use Modal Trigger
                onAdd={handleAdd}
                addButtonText="Add New Item"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Item?"
                message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default StationaryList;
