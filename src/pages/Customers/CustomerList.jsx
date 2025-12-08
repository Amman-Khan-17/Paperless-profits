import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { dummyCustomers } from '../../services/customers';
import '../Books/BookList.css';

const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        setCustomers(dummyCustomers);
    }, []);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'totalOrders', label: 'Total Orders' },
    ];

    const handleEdit = (customer) => {
        navigate(`/customers/${customer.id}`);
    };

    const handleDelete = (customer) => {
        if (window.confirm(`Are you sure you want to delete "${customer.name}"?`)) {
            setCustomers(customers.filter((c) => c.id !== customer.id));
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
                onDelete={handleDelete}
                onAdd={handleAdd}
                addButtonText="Add New Customer"
            />
        </div>
    );
};

export default CustomerList;
