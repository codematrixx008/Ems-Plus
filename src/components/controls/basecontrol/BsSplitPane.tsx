import React, { useRef, useState } from "react";

export const BsSplitPane: React.FC<{ initial?: number; min?: number; children: [React.ReactNode, React.ReactNode] }> = ({ initial = 300, min = 160, children }) => {
  const [left, setLeft] = useState(initial);
  const ref = useRef<HTMLDivElement|null>(null);
  const dragging = useRef(false);

  const onDown = () => { dragging.current = true; };
  const onUp = () => { dragging.current = false; };
  const onMove = (e: React.MouseEvent) => {
    if (!dragging.current || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    setLeft(Math.max(min, Math.min(x, bounds.width - min)));
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} style={{ display:"grid", gridTemplateColumns:`${left}px 8px 1fr`, height:"400px", border:"1px solid var(--cx-border)", borderRadius:"12px", overflow:"hidden" }}>
      <div style={{ overflow:"auto" }}>{children[0]}</div>
      <div onMouseDown={onDown} style={{ cursor:"col-resize", background:"var(--cx-border)" }} />
      <div style={{ overflow:"auto" }}>{children[1]}</div>
    </div>
  );
};