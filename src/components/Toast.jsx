import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

const ToastItem = ({ toast, removeToast }) => {
    useEffect(() => {
        // Animation handled by CSS libraries usually, but here just mounting
    }, []);

    const icons = {
        success: <CheckCircle size={20} color="#38a169" />,
        error: <AlertCircle size={20} color="#e53e3e" />,
        warning: <AlertTriangle size={20} color="#d69e2e" />,
        info: <Info size={20} color="#3182ce" />
    };

    const borders = {
        success: '4px solid #38a169',
        error: '4px solid #e53e3e',
        warning: '4px solid #d69e2e',
        info: '4px solid #3182ce'
    };

    return (
        <div className={`toast-item toast-${toast.type} slide-in-right`} style={{ borderLeft: borders[toast.type] }}>
            <div className="toast-icon">{icons[toast.type]}</div>
            <div className="toast-content">
                <p>{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="toast-close">
                <X size={16} />
            </button>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
