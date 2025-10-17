import React, { useState } from "react";

export type BsTreeNode = { id: string; label: React.ReactNode; children?: BsTreeNode[] };

export const BsTreeView: React.FC<{ data: BsTreeNode[] }> = ({ data }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpen(o => ({ ...o, [id]: !o[id] }));

  const render = (nodes: BsTreeNode[], depth=0): React.ReactNode => (
    <ul style={{ listStyle:"none", margin:0, paddingLeft: depth ? 12 : 0 }}>
      {nodes.map(n => {
        const has = !!n.children?.length;
        const isOpen = open[n.id];
        return (
          <li key={n.id} style={{ margin:".15rem 0" }}>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              {has ? <button className="cx-btn" onClick={()=>toggle(n.id)} aria-label="toggle">{isOpen ? "▾" : "▸"}</button> : <span style={{ width:24 }} />}
              <span>{n.label}</span>
            </div>
            {has && isOpen && render(n.children!, depth+1)}
          </li>
        );
      })}
    </ul>
  );

  return <div className="cx-panel" style={{ padding:".5rem" }}>{render(data)}</div>;
};