import React, { useState } from "react";
import { CommonProps } from "../type/types";

export type BsTab = { key: string; label: React.ReactNode; content: React.ReactNode; disabled?: boolean; };

export type BsTabsProps = CommonProps & {
  tabs: BsTab[];
  value?: string;
  onChange?: (key: string) => void;
};

export const BsTabs: React.FC<BsTabsProps> = ({ tabs, value, onChange, className }) => {
  const [v, setV] = useState(tabs[0]?.key);
  const active = value ?? v;

  const setActive = (k: string) => {
    if (value === undefined) setV(k);
    onChange?.(k);
  };

  return (
    <div className={className}>
      <div style={{ display:"flex", gap:6, borderBottom:"1px solid var(--cx-border)", padding:"0 .25rem" }}>
        {tabs.map(t => (
          <button key={t.key} disabled={t.disabled} onClick={() => !t.disabled && setActive(t.key)}
            className={`cx-btn ${active === t.key ? "cx-btn--primary" : "cx-btn--ghost"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{padding:"1rem 0"}}>
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
};