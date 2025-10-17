import React, { useEffect, useState } from "react";
import { ColumnDef } from "./utils/types";
import { usePortal } from "../../shared/usePortal";

type Props = {
  open: boolean;
  mode: "Add" | "Edit";
  columns: ColumnDef[];
  initial?: Record<string, any>;
  onClose: () => void;
  onSubmit: (vals: any) => void;
};

const EditAddModal: React.FC<Props> = ({ open, mode, columns, initial, onClose, onSubmit }) => {
  const [vals, setVals] = useState<Record<string, any>>(initial ?? {});
  useEffect(() => setVals(initial ?? {}), [initial, open]);
  const Portal = usePortal("ac-root");

  if (!open) return null;

  return (
    <Portal>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
          <h3>{mode} Record</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {columns
              .filter((c) => !c.IsHidden)
              .map((c) => (
                <label key={c.Id} style={{ display: "grid", gap: 4 }}>
                  <span>{c.ColumnName}</span>

                  {c.ComponentType === "Checkbox" ? (
                    <BsInputControl
                      type="checkbox"
                      checked={!!vals[c.ColumnHeader]}
                      onChange={(e: { target: { checked: any } }) =>
                        setVals((v) => ({ ...v, [c.ColumnHeader]: e.target.checked }))
                      }
                    />
                  ) : (
                    <BsInputControl
                      type={
                        c.ComponentType === "Number"
                          ? "number"
                          : c.ComponentType === "DatePicker"
                            ? "date"
                            : "text"
                      }
                      value={vals[c.ColumnHeader] ?? ""}
                      onChange={(e: { target: { value: any } }) =>
                        setVals((v) => ({ ...v, [c.ColumnHeader]: e.target.value }))
                      }
                    />
                  )}
                </label>
              ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 12,
            }}
          >
            <BsButtonControl onClick={onClose}>Cancel</BsButtonControl>
            <BsButtonControl onClick={() => onSubmit(vals)}>Save</BsButtonControl>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default EditAddModal;
