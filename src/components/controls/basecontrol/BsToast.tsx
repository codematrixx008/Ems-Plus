import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePortal } from "../shared/usePortal";

export type BsToastKind = "info"|"success"|"warning"|"error";
export type BsToastItem = { id: string; kind: BsToastKind; title?: string; message: string; timeout?: number };

type Ctx = {
  show: (kind: BsToastKind, message: string, opts?: Omit<BsToastItem,"id"|"kind"|"message">) => void;
};

const BsToastCtx = createContext<Ctx | null>(null);

export const useBsToast = () => {
  const ctx = useContext(BsToastCtx);
  if (!ctx) throw new Error("useBsToast must be inside <BsToastProvider/>");
  return ctx;
};

export const BsToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BsToastItem[]>([]);
  const Portal = usePortal("toast-root");

  const show = useCallback<Ctx["show"]>((kind, message, opts) => {
    const item: BsToastItem = { id: Math.random().toString(36).slice(2), kind, message, ...(opts ?? {}) };
    setItems(list => [...list, item]);
    const t = item.timeout ?? 3000;
    if (t > 0) setTimeout(() => setItems(list => list.filter(x => x.id !== item.id)), t);
  }, []);

  const ctx = useMemo<Ctx>(() => ({ show }), [show]);

  return (
    <BsToastCtx.Provider value={ctx}>
      {children}
      <Portal>
        <div style={{ position:"fixed", right:16, bottom:16, display:"grid", gap:8, zIndex:9999 }}>
          {items.map(it => (
            <div key={it.id} className="cx-panel" style={{ padding:".6rem .8rem", minWidth:260, borderLeft:"4px solid var(--cx-primary)"}}>
              <div style={{fontWeight:600, marginBottom:4, textTransform:"capitalize"}}>{it.title ?? it.kind}</div>
              <div style={{opacity:.95}}>{it.message}</div>
            </div>
          ))}
        </div>
      </Portal>
    </BsToastCtx.Provider>
  );
};

export const BsToast = {
  Provider: BsToastProvider,
  useToast: useBsToast,
};
