import { useState } from 'react';
import './Table.css';

const Table = ({ columns, data, onEdit, onDelete, onAdd, addButtonText = 'Add New' }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter((row) =>
        columns.some((col) =>
            String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="table-container">
            <div className="table-header">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                {onAdd && (
                    <button onClick={onAdd} className="btn-primary">
                        ➕ {addButtonText}
                    </button>
                )}
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                            {(onEdit || onDelete) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="no-data">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row, index) => (
                                <tr key={row.id || index}>
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="actions">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="btn-edit"
                                                    title="View/Edit"
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row)}
                                                    className="btn-delete"
                                                    title="Cancel/Delete"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                            {/* Render extra actions from parent */}
                                            {row.extraActions && row.extraActions.map((action, i) => (
                                                <button
                                                    key={i}
                                                    onClick={action.onClick}
                                                    className={action.className || 'btn-action'}
                                                    title={action.title}
                                                >
                                                    {action.icon || action.label}
                                                </button>
                                            ))}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
