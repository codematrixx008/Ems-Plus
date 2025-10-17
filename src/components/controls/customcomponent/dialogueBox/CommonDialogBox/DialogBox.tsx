import React, { useEffect } from 'react';
import './DialogBox.css';
import { eDialogButtonType } from './eDialogButtonType';

interface DialogBoxProps {
    isOpen: boolean;
    title: string;
    message: string;
    buttonConfig: DialogButtonConfig[];
    manualCloseTriggered?: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel?: () => void;
    onManualClose?: () => void;
    children?: React.ReactNode; // Add this line to support children
}

interface DialogButtonConfig {
    name?: string;
    buttonType: eDialogButtonType;
}

const DialogBox: React.FC<DialogBoxProps> = ({ title, message, isOpen, manualCloseTriggered = false, onClose, onConfirm, onCancel, onManualClose, buttonConfig, children }) => {
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                // console.log("SEDialogBox Escape", event);
                if (onManualClose) onManualClose();
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onManualClose]);
    
    useEffect(() => {
        // console.log("SEDialogBox manualCloseTriggered", manualCloseTriggered);
        if (manualCloseTriggered) {
            if (onManualClose) onManualClose();
        }
    }, [manualCloseTriggered]);

    if (!isOpen) return null;

    return (
        <div className="SEDB-overlay">
            <div className="SEDB-dialog-box">
                <div className="SEDB-dialog-header">
                    <h2 className="SEDB-dialog-formTitle">{title}</h2>
                    <button className="SEDB-dialog-close-button" onClick={onCancel} >X</button>
                </div>
                <div className="SEDB-dialog">
                    <div className="SEDB-dialog-content">
                        <p className="SEDB-dialogMessage">{message}</p>
                        {children}
                    </div>
                </div>
                <div className="SEDB-dialog-footer">
                    {(
                        buttonConfig.map(elem => {
                            var eleName =  elem.buttonType.toString()
                            if(elem.name && elem.name?.length > 0){
                                eleName = elem.name
                            }
                            switch (elem.buttonType) {
                                case eDialogButtonType.YES:
                                    return (
                                        <button key={elem.buttonType} className="SEDB-dialog-button" onClick={onConfirm}>{eleName}</button>
                                    );
                                case eDialogButtonType.NO:
                                    return (
                                        <button key={elem.buttonType} className="SEDB-dialog-button" onClick={onClose}>{eleName}</button>
                                    );
                                case eDialogButtonType.OK:
                                    return (
                                        <button key={elem.buttonType} className="SEDB-dialog-button" onClick={onConfirm}>{eleName}</button>
                                    );
                                case eDialogButtonType.CANCEL:
                                    return (
                                        <button key={elem.buttonType} className="SEDB-dialog-button" onClick={onCancel}>{eleName}</button>
                                    );
                            }
                        })
                    )}
                </div>
            </div>
        </div>
    );
};


export default DialogBox;
export type { DialogBoxProps, DialogButtonConfig };