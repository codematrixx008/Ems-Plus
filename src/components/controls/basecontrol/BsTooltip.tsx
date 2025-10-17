import React, { useEffect, useRef, useState } from "react";
import { usePortal } from "../shared/usePortal";
import { computePosition } from "../shared/position";
import { Align, CommonProps, Placement } from "../type/types";

export type BsTooltipProps<T extends HTMLElement = HTMLElement> = CommonProps & {
  content: React.ReactNode;
  placement?: Placement;
  align?: Align;
  children: React.ReactElement<any, any>;
};

export const BsTooltip = <T extends HTMLElement = HTMLElement>({
  content,
  placement = "top",
  align = "center",
  children,
}: BsTooltipProps<T>) => {
  const Portal = usePortal("tooltip-root");
  const ref = useRef<T | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!open || !ref.current) return;

    const anchor = ref.current.getBoundingClientRect();
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "0";
    probe.style.top = "0";
    probe.style.visibility = "hidden";
    probe.className = "cx-floating";
    probe.textContent = typeof content === "string" ? content : "";
    document.body.appendChild(probe);

    const position = computePosition(anchor, probe.getBoundingClientRect(), placement, align, 8);
    setCoords(position);
    document.body.removeChild(probe);
  }, [open, placement, align, content]);

  const handleRef = (node: T | null) => {
    ref.current = node;
    const childRef = (children as any).ref;
    if (typeof childRef === "function") childRef(node);
    else if (childRef && typeof childRef === "object") (childRef as any).current = node;
  };

  const child = React.cloneElement(children, {
    ref: handleRef,
    onMouseEnter: (e: React.MouseEvent<T>) => {
      setOpen(true);
      (children.props as any).onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<T>) => {
      setOpen(false);
      (children.props as any).onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent<T>) => {
      setOpen(true);
      (children.props as any).onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<T>) => {
      setOpen(false);
      (children.props as any).onBlur?.(e);
    },
  });

  return (
    <>
      {child}
      {open && (
        <Portal>
          <div className="cx-floating" style={{ left: coords.x, top: coords.y }}>
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};
