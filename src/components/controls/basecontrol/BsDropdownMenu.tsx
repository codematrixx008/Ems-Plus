import React, { useEffect, useRef, useState } from "react";
import { usePortal } from "../shared/usePortal";
import { computePosition } from "../shared/position";
import { Align, Placement } from "../type/types";

export type BsMenuItem = { key: string; label: React.ReactNode; onSelect?: () => void; disabled?: boolean; divider?: boolean };

export type BsDropdownMenuProps = {
  trigger: React.ReactElement;
  items: BsMenuItem[];
  placement?: Placement;
  align?: Align;
};

export const BsDropdownMenu: React.FC<BsDropdownMenuProps> = ({ trigger, items, placement="bottom", align="start" }) => {
  const Portal = usePortal("menu-root");
  const ref = useRef<HTMLElement|null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{x:number;y:number}>({x:0,y:0});

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (open && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const anchor = ref.current.getBoundingClientRect();
    const probe = document.createElement("div");
    probe.style.position="fixed"; probe.style.left="0"; probe.style.top="0"; probe.style.visibility="hidden";
    probe.className = "cx-floating";
    document.body.appendChild(probe);
    const pos = computePosition(anchor, probe.getBoundingClientRect(), placement, align, 8);
    setCoords(pos);
    document.body.removeChild(probe);
  }, [open, placement, align]);

  const trig = React.cloneElement(trigger as React.ReactElement<any>, {
    ref: (node: HTMLElement | null) => {
      ref.current = node;
      const childRef: any = (trigger as any).ref;
      if (typeof childRef === "function") childRef(node);
    },
    onClick: (e: any) => { setOpen(v => !v); (trigger.props as any).onClick?.(e); }
  });

  return (
    <>
      {trig}
      {open && (
        <Portal>
          <div className="cx-floating" style={{ left: coords.x, top: coords.y, padding:0 }}>
            <div style={{ display:"grid", minWidth:220 }}>
              {items.map((it, i) => it.divider ? (
                <div key={`div-${i}`} style={{ height:1, background:"var(--cx-border)", margin:".25rem .5rem" }} />
              ) : (
                <button key={it.key} className="cx-btn cx-btn--ghost" style={{ textAlign:"left", justifyContent:"flex-start" }}
                  disabled={it.disabled} onClick={() => { it.onSelect?.(); setOpen(false); }}>
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};