import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { dummySuppliers } from '../../services/suppliers';
import '../Books/BookList.css';

const SupplierList = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        setSuppliers(dummySuppliers);
    }, []);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'totalSupplies', label: 'Total Supplies' },
    ];

    const handleEdit = (supplier) => {
        navigate(`/suppliers/${supplier.id}`);
    };

    const handleDelete = (supplier) => {
        if (window.confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
            setSuppliers(suppliers.filter((s) => s.id !== supplier.id));
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
                onDelete={handleDelete}
                onAdd={handleAdd}
                addButtonText="Add New Supplier"
            />
        </div>
    );
};

export default SupplierList;
