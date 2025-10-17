import React from "react";
import { CommonProps } from "../type/types";

export type BsStep = { key: string; label: React.ReactNode; completed?: boolean; disabled?: boolean };

export const BsStepper: React.FC<CommonProps & { steps: BsStep[]; active: string; onChange?: (key:string)=>void; }> = ({ steps, active, onChange }) => {
  return (
    <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
      {steps.map((s, i) => {
        const isActive = s.key === active;
        return (
          <div key={s.key} style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className={`cx-btn ${isActive ? "cx-btn--primary" : "cx-btn--ghost"}`} disabled={s.disabled} onClick={()=>onChange?.(s.key)}>
              <span className="cx-badge">{i+1}</span> {s.label}
            </button>
            {i < steps.length-1 && <div style={{ width:40, height:2, background:"var(--cx-border)" }} />}
          </div>
        );
      })}
    </div>
  );
};