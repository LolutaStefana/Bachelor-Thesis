import React from 'react';
import './modal.css'; 
import { Tooltip } from '@mui/material';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    <Tooltip title="Close" >
                    <button onClick={onClose} className="modal-close-button">
                        &times;
                    </button>
                    </Tooltip>
                    {children}
                </div>
            </div>
        </>
    );
};

export default Modal;
