
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Option } from "../type/types";
import { BsButtonControl } from "./BsButtonControl";

export type BsTokenSelectProps = {
  label?: React.ReactNode;
  value?: string[];
  onChange?: (ids: string[], options: Option[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  // Data
  options?: Option[];
  onOptionsChange?: (opts: Option[]) => void;
  loadOptions?: () => Promise<Option[]>;     // optional async load on focus
  saveOption?: (draft: { name: string }) => Promise<Option>; // optional create
  allowCreate?: boolean;
};

export const BsTokenSelect: React.FC<BsTokenSelectProps> = ({
  label, value = [], onChange, placeholder = "Select or type…", disabled, className, style,
  options: localOptions = [], onOptionsChange,
  loadOptions, saveOption, allowCreate = true,
}) => {
  const [opts, setOpts] = useState<Option[]>(localOptions);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // sync external options
  useEffect(() => setOpts(localOptions), [localOptions]);

  // click outside
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = useMemo(() => opts.filter(o => value.includes(o.id)), [opts, value]);
  const available = useMemo(() => opts.filter(o => !value.includes(o.id)), [opts, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return available.slice(0, 100);
    return available.filter(o => o.name.toLowerCase().includes(q)).slice(0, 100);
  }, [available, query]);

  const showCreateRow = allowCreate && !!query.trim() && !opts.some(o => o.name.toLowerCase() === query.trim().toLowerCase());

  async function ensureLoaded() {
    if (!loadOptions) return;
    if (opts.length > 0) return;
    const data = await loadOptions();
    setOpts(data);
    onOptionsChange?.(data);
  }

  const addId = (id: string) => {
    if (value.includes(id)) return;
    const ids = [...value, id];
    const sel = opts.filter(o => ids.includes(o.id));
    onChange?.(ids, sel);
    setQuery("");
    setActive(0);
  };

  const removeIdx = (idx: number) => {
    const ids = value.filter((_, i) => i !== idx);
    const sel = opts.filter(o => ids.includes(o.id));
    onChange?.(ids, sel);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const createAndAdd = async () => {
    const name = query.trim();
    if (!name) return;
    if (saveOption) {
      const created = await saveOption({ name });
      const next = [...opts, created];
      setOpts(next);
      onOptionsChange?.(next);
      addId(created.id);
    } else {
      const created = { id: Math.random().toString(36).slice(2), name };
      const next = [...opts, created];
      setOpts(next);
      onOptionsChange?.(next);
      addId(created.id);
    }
  };

  return (
    <div className={className} style={style} ref={rootRef}>
      <div className="es-field">
        {label && <div className="es-label">{label}</div>}
        <div
          className="es-select"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => { if (disabled) return; setOpen(true); inputRef.current?.focus(); }}
          style={{ display: "flex", flexWrap: "wrap", minHeight: 38, gap: 6, alignItems: "center", padding: 6 }}
        >
          {selected.map((o, i) => (
            <span key={o.id} className="es-badge">
              {o.name}
              {!disabled && <BsButtonControl className="es-btn" onClick={(e) => { e.stopPropagation(); removeIdx(i); }} aria-label="Remove">×</BsButtonControl>}
            </span>
          ))}
          <input
            ref={inputRef}
            className="es-input"
            placeholder={selected.length ? "" : placeholder}
            value={query}
            disabled={disabled}
            onFocus={() => { setOpen(true); ensureLoaded(); }}
            onChange={e => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={e => {
              if (e.key === "Backspace" && !query && selected.length && !disabled) {
                removeIdx(selected.length - 1);
                return;
              }
              if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length + (showCreateRow ? 0 : -1))); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
              if (e.key === "Enter") {
                e.preventDefault();
                if (filtered[active]) addId(filtered[active].id);
                else if (showCreateRow) createAndAdd();
              }
              if (e.key === "Escape") setOpen(false);
            }}
            style={{ flex: 1, minWidth: 120, border: "none", boxShadow: "none", height: 28 }}
          />
        </div>

        {open && (
          <div className="cx-floating" role="listbox" style={{ marginTop: 6, width: "100%", maxHeight: 240, overflow: "auto", padding: 0 }}>
            <div style={{ display: "grid" }}>
              {filtered.map((o, i) => (
                <button
                  key={o.id}
                  className={`es-btn ${i === active ? "es-btn--primary" : "es-btn--ghost"}`}
                  role="option"
                  onMouseDown={(e) => { e.preventDefault(); addId(o.id); }}
                  onMouseEnter={() => setActive(i)}
                  style={{ justifyContent: "flex-start" }}
                >
                  {o.name}
                </button>
              ))}
              {showCreateRow && (
                <button
                  className={`es-btn ${filtered.length === 0 || active === filtered.length ? "es-btn--primary" : "es-btn--ghost"}`}
                  onMouseDown={(e) => { e.preventDefault(); createAndAdd(); }}
                  style={{ justifyContent: "flex-start" }}
                >
                  Create “{query.trim()}”
                </button>
              )}
              {filtered.length === 0 && !showCreateRow && (
                <div style={{ padding: ".5rem .75rem", opacity: .7 }}>No results</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
