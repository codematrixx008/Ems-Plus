import React from "react";
import { ColumnDef, GridSettings, Row } from "../utils/types";
import { OptionItem, OptionProvider } from "../section/optionProviders";

type EditingCell = {
  rowId: number;
  colKey: string;
  draft: any;
  error?: string | null;
};

type GridTableProps = {
  rows: Row[];
  columns: ColumnDef[];
  selectedIds: number[];
  onToggleRow: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  settings: GridSettings;
  onHyperlink?: (id: number) => void;
  editing?: EditingCell | null;
  onStartEdit?: (rowId: number, colKey: string, initial?: any) => void;
  onDraftChange?: (draft: any) => void;
  onCommit?: (rowId: number, colKey: string, value: any) => void;
  onCancel?: () => void;
  optionProviders?: Record<string, OptionProvider>;
};

function useDebounced<T>(val: T, delay = 250) {
  const [deb, setDeb] = React.useState(val);
  React.useEffect(() => {
    const t = setTimeout(() => setDeb(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return deb;
}

/* -----------------------
   Simple Editor components
   -----------------------*/
function TextCellEditor({
  value,
  onChange,
  onCommit,
  onCancel,
  error,
}: {
  value: any;
  onChange: (v: any) => void;
  onCommit: () => void;
  onCancel: () => void;
  error?: string | null;
}) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  // Handle object values by extracting display value
  const displayValue = React.useMemo(() => {
    if (value == null) return '';
    if (typeof value === 'object') {
      const obj = value as Record<string, any>;
      return String(obj.label || obj.name || obj.value || '');
    }
    return String(value);
  }, [value]);

  return (
    <div>
      <input
        ref={ref}
        className="editor-input"
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit();
          if (e.key === "Escape") onCancel();
        }}
        style={{ width: "100%" }}
      />
      {error ? <div style={{ color: "crimson", fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}

function NumberCellEditor({
  value,
  onChange,
  onCommit,
  onCancel,
}: {
  value: any;
  onChange: (v: any) => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  // Extract numeric value from object if needed
  const numericValue = React.useMemo(() => {
    if (value == null) return '';
    if (typeof value === 'object') {
      const obj = value as Record<string, any>;
      return obj.value ?? '';
    }
    return value;
  }, [value]);

  return (
    <input
      ref={ref}
      type="number"
      className="editor-input"
      value={numericValue ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit();
        if (e.key === "Escape") onCancel();
      }}
      style={{ width: "100%" }}
    />
  );
}

function CheckboxCellEditor({
  value,
  onChange,
  onCommit,
}: {
  value: any;
  onChange: (v: boolean) => void;
  onCommit: () => void;
}) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  // Extract boolean value from object if needed
  const boolValue = React.useMemo(() => {
    if (typeof value === 'object') {
      const obj = value as Record<string, any>;
      return !!obj.value;
    }
    return !!value;
  }, [value]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={boolValue}
      onChange={(e) => {
        onChange(e.target.checked);
        onCommit();
      }}
    />
  );
}

function DateCellEditor({
  value,
  onChange,
  onCommit,
  onCancel,
}: {
  value: any;
  onChange: (v: any) => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  // Extract date value from object if needed
  const dateValue = React.useMemo(() => {
    if (typeof value === 'object') {
      const obj = value as Record<string, any>;
      return obj.value ?? value;
    }
    return value;
  }, [value]);

  // ensure YYYY-MM-DD
  const valStr = dateValue ? String(dateValue).substring(0, 10) : "";

  return (
    <input
      ref={ref}
      type="date"
      className="editor-input"
      value={valStr}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit();
        if (e.key === "Escape") onCancel();
      }}
      style={{ width: "100%" }}
    />
  );
}

function SelectCellEditor({
  value,
  onChange,
  onCommit,
  onCancel,
  options,
}: {
  value: any;
  onChange: (v: any) => void;
  onCommit: () => void;
  onCancel: () => void;
  options: { value: string | number; label: string }[];
}) {
  const ref = React.useRef<HTMLSelectElement | null>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  // Extract value from object if needed
  const displayValue = React.useMemo(() => {
    if (typeof value === 'object') {
      const obj = value as Record<string, any>;
      return obj.value ?? '';
    }
    return value ?? '';
  }, [value]);

  return (
    <select
      ref={ref}
      value={displayValue}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit();
        if (e.key === "Escape") onCancel();
      }}
      className="editor-input"
      style={{ width: "100%" }}
    >
      <option value="" disabled>
        — select —
      </option>
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function SelectRemoteEditor({
  value,
  onChange,
  onCommit,
  onCancel,
  provider,
  params,
}: {
  value: any;
  onChange: (v: any) => void;
  onCommit: () => void;
  onCancel: () => void;
  provider: OptionProvider;
  params?: Record<string, any>;
}) {
  const [term, setTerm] = React.useState("");
  const debTerm = useDebounced(term, 250);
  const [items, setItems] = React.useState<OptionItem[]>([]);
  const [cursor, setCursor] = React.useState<string | null | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  const loadPage = React.useCallback(
    async (reset = true) => {
      const nextCursor = reset ? null : cursor ?? null;
      setLoading(true);
      try {
        const page = await provider.load({ term: debTerm, cursor: nextCursor, params });
        const merged = reset ? page.items : [...(items ?? []), ...page.items];
        setItems(merged);
        setCursor(page.nextCursor ?? null);
      } finally {
        setLoading(false);
      }
    },
    [debTerm, cursor, params, provider, items]
  );

  React.useEffect(() => {
    loadPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPage]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onCommit();
    if (e.key === "Escape") onCancel();
  };

  // Extract value from object if needed for highlighting
  const displayValue = React.useMemo(() => {
    if (typeof value === 'object') {
      const obj = value as Record<string, any>;
      return obj.value ?? value;
    }
    return value;
  }, [value]);

  return (
    <div style={{ position: "relative" }} onKeyDown={onKeyDown}>
      <input
        autoFocus
        placeholder="Search…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="editor-input"
        style={{ marginBottom: 6, width: "100%" }}
      />
      <div style={{ maxHeight: 220, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
        {items.map((opt) => (
          <div
            key={String(opt.value)}
            onMouseDown={() => {
              onChange(opt.value);
              onCommit();
            }}
            style={{
              padding: "6px 8px",
              cursor: "pointer",
              background: displayValue === opt.value ? "#eef6ff" : "transparent"
            }}
          >
            {opt.label}
          </div>
        ))}
        {loading && <div style={{ padding: 8, color: "#666" }}>Loading…</div>}
        {!loading && cursor && (
          <button
            className="btn"
            style={{ width: "100%", borderRadius: 0 }}
            onMouseDown={(e) => {
              e.preventDefault();
              loadPage(false);
            }}
          >
            Load more
          </button>
        )}
        {!loading && items.length === 0 && <div style={{ padding: 8, color: "#999" }}>No results</div>}
      </div>
    </div>
  );
}

/* -----------------------
   Helpers
   -----------------------*/
function resolveOptionParams(col: ColumnDef, row: Row): Record<string, any> | undefined {
  if (!col.optionParams) return undefined;
  return typeof col.optionParams === "function" ? (col.optionParams as (r: Row) => Record<string, any>)(row) : col.optionParams;
}

function formatDisplay(col: ColumnDef, raw: any) {
  if (raw == null) return "";

  // If raw is an object, try to extract a meaningful display value
  if (typeof raw === 'object') {
    const obj = raw as Record<string, any>;
    // Common cases: if it has label, name, or value properties
    if (obj.label !== undefined) return String(obj.label);
    if (obj.name !== undefined) return String(obj.name);
    if (obj.value !== undefined) return String(obj.value);
    // Fallback: try to stringify or show empty
    try {
      return JSON.stringify(raw);
    } catch {
      return "[Object]";
    }
  }

  if (col.format) return col.format(raw);

  // Currency formatting if ComponentType = CurrencyTextbox
  if (col.ComponentType === "CurrencyTextbox") {
    try {
      const n = Number(raw);
      if (Number.isFinite(n)) {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2
        }).format(n);
      }
    } catch { }
  }

  if (col.ComponentType === "DatePicker") {
    try {
      return String(raw).substring(0, 10);
    } catch { }
  }

  return String(raw);
}

/* -----------------------
   Body component
   -----------------------*/
const Body: React.FC<GridTableProps> = ({
  rows,
  columns,
  selectedIds,
  onToggleRow,
  settings,
  onHyperlink,
  editing,
  onStartEdit,
  onDraftChange,
  onCommit,
  onCancel,
  optionProviders,
}) => {
  const renderEditor = (col: ColumnDef, row: Row, draftValue: any) => {
    const colKey = col.ColumnHeader;

    // validate helper that returns error string or null
    const runValidate = (val: any) => {
      try {
        return col.validate ? col.validate(val, row) : null;
      } catch {
        return null;
      }
    };

    // handlers for onChange that update draft
    const changeDraft = (v: any) => {
      onDraftChange?.({ rowId: row.Id, colKey, value: v });
    };

    const commitIfValid = (v: any) => {
      const err = runValidate(v);
      if (err) {
        // if caller stores editing state, they'll show error via editing prop; otherwise still call commit but include error
        onDraftChange?.({ rowId: row.Id, colKey, value: v, error: err });
        return;
      }
      onCommit?.(row.Id, colKey, v);
    };

    switch (col.ComponentType) {
      case "Checkbox":
        return (
          <CheckboxCellEditor
            value={draftValue}
            onChange={(v) => changeDraft(v)}
            onCommit={() => commitIfValid(draftValue)}
          />
        );

      case "DatePicker":
        return (
          <DateCellEditor
            value={draftValue}
            onChange={(v) => changeDraft(v)}
            onCommit={() => commitIfValid(draftValue)}
            onCancel={() => onCancel?.()}
          />
        );

      case "Dropdown": {
        // remote provider if optionProviderKey present and exists
        if (col.optionProviderKey && optionProviders?.[col.optionProviderKey]) {
          return (
            <SelectRemoteEditor
              value={draftValue}
              provider={optionProviders[col.optionProviderKey]}
              params={resolveOptionParams(col, row)}
              onChange={(v) => changeDraft(v)}
              onCommit={() => commitIfValid(draftValue)}
              onCancel={() => onCancel?.()}
            />
          );
        }
        // local options
        const opts = (col.options as { value: string | number; label: string }[]) ?? [];
        return (
          <SelectCellEditor
            value={draftValue}
            options={opts}
            onChange={(v) => changeDraft(v)}
            onCommit={() => commitIfValid(draftValue)}
            onCancel={() => onCancel?.()}
          />
        );
      }

      case "Number":
        return (
          <NumberCellEditor
            value={draftValue}
            onChange={(v) => changeDraft(v)}
            onCommit={() => commitIfValid(draftValue)}
            onCancel={() => onCancel?.()}
          />
        );

      case "CurrencyTextbox":
        // treat as number editor but display formatting in non-edit mode
        return (
          <NumberCellEditor
            value={draftValue}
            onChange={(v) => changeDraft(v)}
            onCommit={() => commitIfValid(draftValue)}
            onCancel={() => onCancel?.()}
          />
        );

      case "Textbox":
      default:
        return (
          <TextCellEditor
            value={draftValue}
            onChange={(v) => changeDraft(v)}
            onCommit={() => commitIfValid(draftValue)}
            onCancel={() => onCancel?.()}
            error={editing?.error ?? null}
          />
        );
    }
  };

  // compute visible columns (respect IsHidden or isHidden)
  const visibleCols = React.useMemo(
    () => [...columns].filter((c) => !c.IsHidden && !(c as any).isHidden).sort((a, b) => (a.ColumnOrder ?? 0) - (b.ColumnOrder ?? 0)),
    [columns]
  );

  return (
    <>
      {rows.length === 0 ? (
        <tr>
          <td colSpan={(visibleCols.length || columns.length) + 1} style={{ textAlign: "center", padding: 16, color: "#666" }}>
            No data
          </td>
        </tr>
      ) : (
        rows.map((row, idx) => (
          <tr key={row.Id ?? idx} className={idx % 2 === 0 ? "stripedRow" : ""}>
            <td style={{ position: "sticky", left: 0, background: "#fff", textAlign: "center", width: 50 }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(row.Id)}
                onChange={() => onToggleRow(row.Id)}
              />
            </td>

            {visibleCols.map((col) => {
              const colKey = col.ColumnHeader;
              const isEditing = editing?.rowId === row.Id && editing?.colKey === colKey;
              const draftVal = isEditing ? editing?.draft : undefined;
              const raw = row[colKey];
              const display = isEditing ? draftVal : formatDisplay(col, raw);

              return (
                <td
                  key={colKey}
                  onDoubleClick={() => onStartEdit?.(row.Id, colKey, raw)}
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #eee",
                    cursor: (col.IsEditable ?? (col as any).isEditable) ? "text" : "default",
                  }}
                >
                  {isEditing ? (
                    renderEditor(col, row, draftVal ?? raw)
                  ) : col.isLink ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onHyperlink?.(row.Id);
                      }}
                    >
                      {display}
                    </a>
                  ) : (
                    display
                  )}
                </td>
              );
            })}
          </tr>
        ))
      )}
    </>
  );
};

export default Body;