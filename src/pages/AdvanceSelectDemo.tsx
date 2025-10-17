import React, { useEffect, useState } from "react";
import { Option } from "../components/controls/type/types";
import * as api from "../mockData/advanceSelectMockApi";
import { BsEntitySelect } from "../components/controls/basecontrol/BsEntitySelect";
import { BsTokenSelect } from "../components/controls/basecontrol/BsTokenSelect";
import { BsEntityMultiSelect } from "../components/controls/basecontrol/BsEntityMultiSelect";

export default function App() {
  const [apiSelection, setApiSelection] = useState<string | undefined>();
  const [apiOptions, setApiOptions] = useState<Option[]>([]);
  const [multi, setMulti] = useState<string[]>([]);
  const [tokenIds, setTokenIds] = useState<string[]>([]);
  const [localSelection, setLocalSelection] = useState<string | undefined>();
  const [localOptions, setLocalOptions] = useState<Option[]>([
    { id: "c1", name: "Client" },
    { id: "v1", name: "Vendor" },
  ]);

  //  Load initial API options
  useEffect(() => {
    api.loadAll().then(setApiOptions);
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        display: "grid",
        gap: "1.5rem",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h2>EntitySelect – Advanced Control</h2>

      {/* ===== API-Based EntitySelect ===== */}
      <div>
        <BsEntitySelect
          label="Type (API mode)"
          value={apiSelection}
          onChange={(id) => setApiSelection(id)}
          options={apiOptions}
          onOptionsChange={setApiOptions}
          loadOptions={api.loadAll}
          saveOption={(d) => api.createOne({ name: d.name })}
          updateOption={(id, d) => api.updateOne(id, { name: d.name })}
        />
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          Selected: {apiSelection || "(none)"}
        </div>

        {/* ===== Token Select (API-backed) ===== */}
        <div style={{ marginTop: 16 }}>
          <BsTokenSelect
            label="Type (Tokenized inline)"
            value={tokenIds}
            onChange={(ids) => setTokenIds(ids)}
            options={apiOptions}
            onOptionsChange={setApiOptions}
            loadOptions={api.loadAll}
            saveOption={(d) => api.createOne({ name: d.name })}
          />
          <div style={{ marginTop: 8, opacity: 0.8 }}>
            Selected: {tokenIds.join(", ") || "(none)"}
          </div>
        </div>
      </div>

      {/* ===== MultiSelect (API-based) ===== */}
      <div>
        <BsEntityMultiSelect
          label="Type (Multi)"
          value={multi}
          onChange={(ids) => setMulti(ids)}
          options={apiOptions}
          onOptionsChange={setApiOptions}
          loadOptions={api.loadAll}
          saveOption={(d) => api.createOne({ name: d.name })}
          updateOption={(id, d) => api.updateOne(id, { name: d.name })}
        />
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          Selected: {multi.join(", ") || "(none)"}
        </div>
      </div>

      <hr />

      {/* ===== Local Mode (Static Data) ===== */}
      <div>
        <BsEntitySelect
          label="Type (Local mode)"
          value={localSelection}
          onChange={(id) => setLocalSelection(id)}
          options={localOptions}
          onOptionsChange={setLocalOptions}
        />
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          Selected: {localSelection || "(none)"}
        </div>
      </div>
    </div>
  );
}
