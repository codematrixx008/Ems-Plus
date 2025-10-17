import React from "react";
import { CommonProps } from "../type/types";

export type BsCrumb = { key: string; label: React.ReactNode; onClick?: () => void };

export const BsBreadcrumbs: React.FC<CommonProps & { items: BsCrumb[] }> = ({ items, className, style }) => {
  return (
    <nav className={className} style={style} aria-label="Breadcrumb">
      <ol style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
        {items.map((c, i) => (
          <li key={c.key} style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
            <button className="cx-btn cx-btn--ghost" onClick={c.onClick}>{c.label}</button>
            {i < items.length - 1 && <span style={{ opacity:.6 }}>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};