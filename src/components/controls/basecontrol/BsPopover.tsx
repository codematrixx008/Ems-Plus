import React, { useEffect, useRef, useState } from "react";
import { usePortal } from "../shared/usePortal";
import { computePosition } from "../shared/position";
import { Align, CommonProps, Placement } from "../type/types";

export type BsPopoverProps = CommonProps & {
  open?: boolean;
  onOpenChange?: (open:boolean)=>void;
  trigger: React.ReactElement;
  content: React.ReactNode;
  placement?: Placement;
  align?: Align;
};

export const BsPopover: React.FC<BsPopoverProps> = ({ open, onOpenChange, trigger, content, placement="bottom", align="start" }) => {
  const controlled = typeof open === "boolean";
  const [innerOpen, setInnerOpen] = useState(false);
  const isOpen = controlled ? (open as boolean) : innerOpen;

  const Portal = usePortal("popover-root");
  const ref = useRef<HTMLElement|null>(null);
  const [coords, setCoords] = useState<{x:number;y:number}>({x:0,y:0});

  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current) return;
      if (isOpen && !ref.current.contains(e.target as Node)) {
        if (controlled) onOpenChange?.(false); else setInnerOpen(false);
      }
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [isOpen, controlled, onOpenChange]);

  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const anchor = ref.current.getBoundingClientRect();
    const probe = document.createElement("div");
    probe.style.position="fixed"; probe.style.left="0"; probe.style.top="0"; probe.style.visibility="hidden";
    probe.className = "cx-floating";
    document.body.appendChild(probe);
    const position = computePosition(anchor, probe.getBoundingClientRect(), placement, align, 8);
    setCoords(position);
    document.body.removeChild(probe);
  }, [isOpen, placement, align]);

  const trig = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        ref: (node: HTMLElement | null) => {
          ref.current = node;
          const childRef = (trigger as any).ref;
          if (typeof childRef === "function") {
            childRef(node);
          } else if (childRef && typeof childRef === "object") {
            (childRef as React.MutableRefObject<any>).current = node;
          }
        },
        onClick: (e: any) => {
          if (controlled) onOpenChange?.(!open); else setInnerOpen(v => !v);
          (trigger as React.ReactElement<any>).props?.onClick?.(e);
        }
      } as any)
    : trigger;

  return (
    <>
      {trig}
      {isOpen && (
        <Portal>
          <div className="cx-floating" style={{ left: coords.x, top: coords.y }}>
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};