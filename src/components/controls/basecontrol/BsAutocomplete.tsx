import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePortal } from "../shared/usePortal";
// import { BsInputControl } from "./BsInputControl";
// import { BsButtonControl } from "./BsButtonControl";

export type BsAutocompleteProps = {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export const BsAutocomplete: React.FC<BsAutocompleteProps> = ({ options, value, onChange, placeholder }) => {
  const [v, setV] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const Portal = usePortal("ac-root");
  const [coords, setCoords] = useState<{ x: number; y: number; width: number }>({ x: 0, y: 0, width: 200 });

  useEffect(() => setV(value ?? ""), [value]);

  const filtered = useMemo(() => options.filter(o => o.toLowerCase().includes(v.toLowerCase())).slice(0, 8), [options, v]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setCoords({ x: r.left, y: r.bottom + 6, width: r.width });
  }, [open]);

  const choose = (val: string) => {
    setV(val); onChange?.(val); setOpen(false);
  };

  return (
    <>
      <BsInputControl
        className="cx-input"
        ref={ref}
        placeholder={placeholder}
        value={v}
        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => { setV(e.target.value); setOpen(true); setActive(0); }}
        onKeyDown={(e: { key: string; }) => {
          if (!open && (e.key === "ArrowDown" || e.key === "Enter")) setOpen(true);
          if (e.key === "ArrowDown") setActive(a => Math.min(a + 1, filtered.length - 1));
          if (e.key === "ArrowUp") setActive(a => Math.max(a - 1, 0));
          if (e.key === "Enter") { if (filtered[active]) choose(filtered[active]); }
          if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && filtered.length > 0 && (
        <Portal>
          <div className="cx-floating" ref={listRef} style={{ left: coords.x, top: coords.y, width: coords.width, padding: 0 }}>
            <div style={{ display: "grid" }}>
              {filtered.map((o, i) => (
                <BsButtonControl key={o} className={`cx-btn ${i === active ? "cx-btn--primary" : "cx-btn--ghost"}`} style={{ justifyContent: "flex-start" }} onMouseDown={(e: { preventDefault: () => void; }) => { e.preventDefault(); choose(o); }}>
                  {o}
                </BsButtonControl>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};