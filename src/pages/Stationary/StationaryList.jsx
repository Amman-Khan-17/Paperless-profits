import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { dummyStationary } from '../../services/stationary';
import '../Books/BookList.css';

const StationaryList = () => {
    const navigate = useNavigate();
    const [stationary, setStationary] = useState([]);

    useEffect(() => {
        setStationary(dummyStationary);
    }, []);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        {
            key: 'price',
            label: 'Price',
            render: (price) => `$${price.toFixed(2)}`,
        },
        { key: 'stock', label: 'Stock' },
        { key: 'supplier', label: 'Supplier' },
    ];

    const handleEdit = (item) => {
        navigate(`/stationary/${item.id}`);
    };

    const handleDelete = (item) => {
        if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
            setStationary(stationary.filter((s) => s.id !== item.id));
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
                onDelete={handleDelete}
                onAdd={handleAdd}
                addButtonText="Add New Item"
            />
        </div>
    );
};

export default StationaryList;
