import React, { useEffect } from "react";
import "./DialogBox.css";
import { eDialogButtonType } from "./eDialogButtonType";

interface DialogButtonConfig {
  name?: string;
  buttonType: eDialogButtonType;
}

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
  children?: React.ReactNode;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  title,
  message,
  isOpen,
  manualCloseTriggered = false,
  onClose,
  onConfirm,
  onCancel,
  onManualClose,
  buttonConfig,
  children,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (onManualClose) onManualClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onManualClose]);

  // Handle manual close trigger
  useEffect(() => {
    if (manualCloseTriggered && onManualClose) {
      onManualClose();
    }
  }, [manualCloseTriggered, onManualClose]);

  if (!isOpen) return null;

  return (
    <div className="Bs-overlay">
      <div className="Bs-dialog-box">
        {/* ===== Header ===== */}
        <div className="Bs-dialog-header">
          <h2 className="Bs-dialog-title">{title}</h2>
          <BsButtonControl
            className="Bs-dialog-close"
            onClick={onCancel}
          >
            X
          </BsButtonControl>
        </div>

        {/* ===== Message & Content ===== */}
        <div className="Bs-dialog-body">
          <div className="Bs-dialog-content">
            {message && <p className="Bs-dialog-message">{message}</p>}
            {children}
          </div>
        </div>

        {/* ===== Footer Buttons ===== */}
        <div className="Bs-dialog-footer">
          {buttonConfig.map((elem) => {
            const eleName =
              elem.name && elem.name.length > 0
                ? elem.name
                : elem.buttonType.toString();

            switch (elem.buttonType) {
              case eDialogButtonType.YES:
                return (
                  <BsButtonControl
                    key={elem.buttonType}
                    className="Bs-dialog-button"
                    onClick={onConfirm}
                  >
                    {eleName}
                  </BsButtonControl>
                );

              case eDialogButtonType.NO:
                return (
                  <BsButtonControl
                    key={elem.buttonType}
                    className="Bs-dialog-button"
                    onClick={onClose}
                  >
                    {eleName}
                  </BsButtonControl>
                );

              case eDialogButtonType.OK:
                return (
                  <BsButtonControl
                    key={elem.buttonType}
                    className="Bs-dialog-button"
                    onClick={onConfirm}
                  >
                    {eleName}
                  </BsButtonControl>
                );

              case eDialogButtonType.CANCEL:
                return (
                  <BsButtonControl
                    key={elem.buttonType}
                    className="Bs-dialog-button"
                    onClick={onCancel}
                  >
                    {eleName}
                  </BsButtonControl>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
export type { DialogBoxProps, DialogButtonConfig };
