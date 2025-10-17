import React from "react";
import { CommonProps } from "../type/types";

export type BsPaginationProps = CommonProps & {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
};

export const BsPagination: React.FC<BsPaginationProps> = ({ page, pageSize, total, onChange }) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const go = (p: number) => onChange(Math.max(1, Math.min(p, pages)));
  const visible = [...Array(pages)].map((_, i) => i + 1).slice(Math.max(0, page - 3), page + 2);

  return (
    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
      <button className="cx-btn" onClick={() => go(1)} disabled={page===1}>«</button>
      <button className="cx-btn" onClick={() => go(page-1)} disabled={page===1}>‹</button>
      {visible[0] > 1 && <span>…</span>}
      {visible.map(p => (
        <button key={p} className={`cx-btn ${p===page ? "cx-btn--primary" : "cx-btn--ghost"}`} onClick={() => go(p)}>{p}</button>
      ))}
      {visible[visible.length-1] < pages && <span>…</span>}
      <button className="cx-btn" onClick={() => go(page+1)} disabled={page===pages}>›</button>
      <button className="cx-btn" onClick={() => go(pages)} disabled={page===pages}>»</button>
    </div>
  );
};