import React, { useState } from "react";
import { CommonProps } from "../type/types";

export type BsTagInputProps = CommonProps & {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
};

export const BsTagInput: React.FC<BsTagInputProps> = ({ value, onChange, placeholder="Add and press Enter" }) => {
  const [v, setV] = useState("");
  const [tags, setTags] = useState<string[]>(value ?? []);

  const commit = () => {
    const t = v.trim();
    if (!t) return;
    const next = [...tags, t];
    setTags(next);
    onChange?.(next);
    setV("");
  };

  const remove = (i: number) => {
    const next = tags.filter((_, idx) => idx !== i);
    setTags(next);
    onChange?.(next);
  };

  return (
    <div className="cx-panel" style={{ padding:".5rem", display:"flex", flexWrap:"wrap", gap:6 }}>
      {tags.map((t, i) => (
        <span key={`${t}-${i}`} className="cx-badge">
          {t}
          <button className="cx-btn" onClick={()=>remove(i)} aria-label="Remove">×</button>
        </span>
      ))}
      <input className="cx-input" style={{ minWidth:160, flex:"1 1 200px" }} value={v} placeholder={placeholder}
        onChange={e=>setV(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
      />
    </div>
  );
};