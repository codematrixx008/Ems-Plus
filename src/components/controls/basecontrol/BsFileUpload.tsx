import React, { useRef, useState } from "react";

export type BsFileUploadProps = {
  onFiles?: (files: File[]) => void;
  multiple?: boolean;
};

export const BsFileUpload: React.FC<BsFileUploadProps> = ({ onFiles, multiple=true }) => {
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [over, setOver] = useState(false);

  const handle = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    onFiles?.(arr);
  };

  return (
    <div className="cx-panel" style={{ padding:"1rem", textAlign:"center", borderStyle: over ? "dashed" : "solid" }}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}>
      <div style={{ marginBottom:8 }}>Drag & drop files here</div>
      <div style={{ marginBottom:8, opacity:.8 }}>or</div>
      <button className="cx-btn cx-btn--primary" onClick={() => inputRef.current?.click()}>Choose files</button>
      <input ref={inputRef} type="file" style={{ display:"none" }} multiple={multiple} onChange={(e) => handle(e.target.files)} />
    </div>
  );
};