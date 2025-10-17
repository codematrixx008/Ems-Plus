
import React, { useEffect, useMemo, useState } from "react";
import { Draft, LoadFn, Option, SaveFn, UpdateFn } from "../type/types";

export type BsEntityMultiSelectProps = {
  label?: React.ReactNode;
  value?: string[];
  onChange?: (ids: string[], options: Option[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;

  options?: Option[];
  onOptionsChange?: (opts: Option[]) => void;

  loadOptions?: LoadFn;
  saveOption?: SaveFn;
  updateOption?: UpdateFn;

  allowCreate?: boolean;
  allowEdit?: boolean;
};

type FormMode = { type: "none" } | { type: "create" } | { type: "edit"; item: Option };

export const BsEntityMultiSelect: React.FC<BsEntityMultiSelectProps> = ({
  label, value = [], onChange, placeholder="Select…", disabled, className, style,
  options: localOptions, onOptionsChange,
  loadOptions, saveOption, updateOption,
  allowCreate=true, allowEdit=true,
}) => {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<Option[]>(localOptions ?? []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<FormMode>({ type: "none" });
  const [draft, setDraft] = useState<Draft>({ name: "" });
  const [pending, setPending] = useState<string[]>(value);

  useEffect(() => { if (localOptions) setOpts(localOptions); }, [localOptions]);
  useEffect(() => { setPending(value); }, [value]);

  async function refresh() {
    if (!loadOptions) return;
    setLoading(true);
    try {
      const data = await loadOptions();
      setOpts(data);
      onOptionsChange?.(data);
    } finally { setLoading(false); }
  }
  useEffect(() => { if (loadOptions) refresh(); }, []);

  const selectedOptions = useMemo(() => opts.filter(o => value.includes(o.id)), [opts, value]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return opts;
    return opts.filter(o => o.name.toLowerCase().includes(q));
  }, [opts, search]);

  const togglePending = (id: string) => {
    setPending(curr => curr.includes(id) ? curr.filter(x => x != id) : [...curr, id]);
  };

  const applyPending = () => {
    const chosen = opts.filter(o => pending.includes(o.id));
    onChange?.(pending, chosen);
    setOpen(false);
  };

  const submitCreate = async () => {
    const name = draft.name?.trim();
    if (!name) return;
    if (saveOption) {
      setLoading(true);
      try {
        const created = await saveOption({ name });
        const next = [...opts, created];
        setOpts(next); onOptionsChange?.(next);
        setMode({ type: "none" }); setDraft({ name: "" });
        setPending(p => [...p, created.id]);
      } finally { setLoading(false); }
    } else {
      const created: Option = { id: Math.random().toString(36).slice(2), name };
      const next = [...opts, created];
      setOpts(next); onOptionsChange?.(next);
      setMode({ type: "none" }); setDraft({ name: "" });
      setPending(p => [...p, created.id]);
    }
  };

  const submitEdit = async () => {
    if (mode.type !== "edit") return;
    const name = draft.name?.trim(); if (!name) return;
    const id = mode.item.id;
    if (updateOption) {
      setLoading(true);
      try {
        const updated = await updateOption(id, { name });
        const next = opts.map(o => o.id === id ? updated : o);
        setOpts(next); onOptionsChange?.(next); setMode({ type:"none" });
      } finally { setLoading(false); }
    } else {
      const next = opts.map(o => o.id === id ? { ...o, name } : o);
      setOpts(next); onOptionsChange?.(next); setMode({ type:"none" });
    }
  };

  return (
    <div className={className} style={style}>
      <div className="es-field">
        {label && <div className="es-label">{label}</div>}
        <div className="es-row">
          <div className="es-select" style={{ display:"flex", alignItems:"center", gap:8, padding: '0 .5rem', height:38 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
              {selectedOptions.length ? selectedOptions.map(o => (
                <span key={o.id} className="es-badge">{o.name}</span>
              )) : <span style={{ color:"var(--es-muted)" }}>{placeholder}</span>}
            </div>
          </div>
          <button className="es-iconbtn" onClick={() => { setOpen(true); refresh(); }} title="Manage options" aria-label="Manage">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="es-overlay" onClick={() => setOpen(false)}>
          <div className="es-modal" onClick={e => e.stopPropagation()}>
            <div className="es-head" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontWeight:600}}>Manage Options</div>
              <div className="es-row">
                <input className="es-input" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
                {allowCreate && <button className="es-btn es-btn--primary" onClick={() => { setMode({ type: "create" }); setDraft({ name: "" }); }}>Add New</button>}
                <button className="es-btn" onClick={()=> refresh()} disabled={loading}>Refresh</button>
                <button className="es-btn" onClick={applyPending}>Apply</button>
                <button className="es-btn" onClick={()=> setOpen(false)}>Close</button>
              </div>
            </div>

            <div className="es-body">
              {mode.type === "none" && (
                <div style={{display:"grid", gap:12}}>
                  <table className="es-table">
                    <thead>
                      <tr><th style={{width:44}}></th><th style={{width:"30%"}}>ID</th><th>Name</th><th style={{width:120}}></th></tr>
                    </thead>
                    <tbody>
                      {filtered.map(o => (
                        <tr key={o.id}>
                          <td><input type="checkbox" checked={pending.includes(o.id)} onChange={() => togglePending(o.id)} /></td>
                          <td><span className="es-badge">{o.id}</span></td>
                          <td>{o.name}</td>
                          <td>
                            {allowEdit && (
                              <button className="es-btn" onClick={()=> { setMode({ type:"edit", item: o }); setDraft({ name: o.name }); }}>Edit</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && <div style={{opacity:.7}}>No results.</div>}
                </div>
              )}

              {mode.type !== "none" && (
                <div style={{display:"grid", gap:12}}>
                  <div style={{fontWeight:600}}>{mode.type === "create" ? "Add New" : "Edit"}</div>
                  <label className="es-field">
                    <span className="es-label">Name</span>
                    <input className="es-input" value={draft.name || ""} onChange={e=>setDraft(d=>({ ...(d||{}), name:e.target.value }))} />
                  </label>
                </div>
              )}
            </div>

            <div className="es-foot">
              {mode.type === "none" ? (
                <>
                  <button className="es-btn" onClick={()=> setOpen(false)}>Close</button>
                  <button className="es-btn es-btn--primary" onClick={applyPending}>Apply</button>
                </>
              ) : mode.type === "create" ? (
                <>
                  <button className="es-btn" onClick={()=> setMode({ type:"none" })}>Cancel</button>
                  <button className="es-btn es-btn--primary" onClick={submitCreate} disabled={loading || !draft.name?.trim()}>Save</button>
                </>
              ) : (
                <>
                  <button className="es-btn" onClick={()=> setMode({ type:"none" })}>Cancel</button>
                  <button className="es-btn es-btn--primary" onClick={submitEdit} disabled={loading || !draft.name?.trim()}>Save</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
