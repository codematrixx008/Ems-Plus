import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export function usePortal(id = "app-portal") {
  const el = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    el.setAttribute("id", id);
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [el, id]);

  const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => createPortal(children, el);
  return Portal;
}