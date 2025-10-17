import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import DialogBoxProps, { DialogButtonConfig } from './DialogBox';
import { eDialogButtonType } from './eDialogButtonType';

interface OpenDialogBoxProps {
    title: string;
    message: string;
    buttonConfig: DialogButtonConfig[];
    senderId: string;
    manualCloseTriggered?: boolean;
    onClose: (senderId: string) => void;
    onConfirm: (senderId: string) => void;
    onCancel?: (senderId: string) => void;
    onManualClose?: (senderId: string) => void;
}

const createDialogContainer = (): HTMLElement => {
    const dialogContainer = document.createElement('div');
    document.body.appendChild(dialogContainer);
    return dialogContainer;
};

const openDialog = ({ title, message, buttonConfig, senderId, manualCloseTriggered = false, onClose, onConfirm, onCancel, onManualClose }: OpenDialogBoxProps) => {
    const dialogContainer = createDialogContainer();
    const root: Root = createRoot(dialogContainer);
  
    const handleClose = () => {
      onClose(senderId);
      root.unmount();
      document.body.removeChild(dialogContainer);
    };
  
    const handleConfirm = () => {
      onConfirm(senderId);
      root.unmount();
      document.body.removeChild(dialogContainer);
    };
  
    const handleCancel = () => {
      if (onCancel) {
        onCancel(senderId);
      }
      root.unmount();
      document.body.removeChild(dialogContainer);
    };
  
    const handleManualClose = () => {
      if (onManualClose) {
        onManualClose(senderId);
      }
      root.unmount();
      document.body.removeChild(dialogContainer);
    };

    root.render(
        <DialogBoxProps
            title={title}
            message={message}
            isOpen={true}
            manualCloseTriggered = {manualCloseTriggered}
            onClose={handleClose}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onManualClose={handleManualClose}
            buttonConfig={buttonConfig}
        />
    );
};

export { openDialog, eDialogButtonType };  
export type { DialogButtonConfig };