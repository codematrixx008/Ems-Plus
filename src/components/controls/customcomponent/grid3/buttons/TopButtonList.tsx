import React from 'react';

export type TopButton = { id:string; label:string; disabled?:boolean; icon?:React.ReactNode };
export default function TopButtonList({ items, onClick }:{ items: TopButton[]; onClick:(id:string)=>void }){
  return (
    <div className="flex gap-2" style={{ display:'flex', gap:8 }}>
      {items.map(b=>(
        <button key={b.id} disabled={b.disabled} onClick={()=>onClick(b.id)} className="btn">
          <span style={{marginRight:6}}>{b.icon}</span>{b.label}
        </button>
      ))}
    </div>
  );
}
