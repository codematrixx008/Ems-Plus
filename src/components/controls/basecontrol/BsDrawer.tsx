import React from "react";
import { usePortal } from "../shared/usePortal";
import { CommonProps } from "../type/types";

export type BsDrawerSide = "left"|"right"|"top"|"bottom";

export type BsDrawerProps = CommonProps & {
  open: boolean;
  onClose: () => void;
  side?: BsDrawerSide;
  width?: number | string;
  height?: number | string;
  children?: React.ReactNode;
};

export const BsDrawer: React.FC<BsDrawerProps> = ({ open, onClose, side="right", width=420, height=420, children, style }) => {
  const Portal = usePortal("drawer-root");
  if (!open) return null;

  const pos: React.CSSProperties = side === "left" || side === "right"
    ? { top:0, bottom:0, width }
    : { left:0, right:0, height };

  const sideStyle: React.CSSProperties =
    side === "left" ? { left:0 } :
    side === "right" ? { right:0 } :
    side === "top" ? { top:0 } : { bottom:0 };

  return (
    <Portal>
      <div className="cx-overlay" onClick={onClose}>
        <div
          className="cx-panel"
          onClick={(e)=>e.stopPropagation()}
          style={{ position:"fixed", ...pos, ...sideStyle, ...style, overflow:"auto" }}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
};