import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-glass-card fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className={`modal-icon ${type}`}>
                        <AlertTriangle size={24} color="white" />
                    </div>
                    <h3>{title}</h3>
                    <button onClick={onClose} className="modal-close">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="btn-cancel">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className={`btn-confirm ${type}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
