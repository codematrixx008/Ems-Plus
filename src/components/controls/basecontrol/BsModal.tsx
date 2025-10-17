import React, { useEffect } from "react";
import { usePortal } from "../shared/usePortal";
import { CommonProps } from "../type/types";

export type BsModalProps = CommonProps & {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  closeOnBackdrop?: boolean;
};

export const BsModal: React.FC<BsModalProps> = ({ open, onClose, title, footer, children, closeOnBackdrop=true, className, style }) => {
  const Portal = usePortal("modal-root");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className="cx-overlay" onClick={() => closeOnBackdrop && onClose()}>
        <div
          className={`cx-panel ${className ?? ""}`}
          style={{
            position:"fixed", inset:"auto", left:"50%", top:"50%",
            transform:"translate(-50%,-50%)", width:"min(720px, 92vw)", maxHeight:"86vh",
            overflow:"hidden", ...style
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{padding:"1rem 1rem .75rem", borderBottom:"1px solid var(--cx-border)"}}>
            <div style={{fontSize:"1.05rem", fontWeight:600}}>{title}</div>
          </div>
          <div style={{padding:"1rem", overflow:"auto"}}>
            {children}
          </div>
          {footer && (
            <div style={{padding:".75rem 1rem", borderTop:"1px solid var(--cx-border)", display:"flex", gap:8, justifyContent:"flex-end"}}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};