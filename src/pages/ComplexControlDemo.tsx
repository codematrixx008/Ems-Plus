// ==============================================
// 📘 ComplexControlDemo.tsx
// ==============================================
// This component demonstrates a complex UI setup 
// combining grids, tabs, modals, drawers, and 
// custom reusable controls built with React + TypeScript.
// ==============================================

import React, { useMemo, useState } from "react";

// ====== Schemas & Mock Data ======
import { employeeSchema } from "../schemas/employee.schema";
import { employeeRows } from "../mockData/employee.data";
import { gridButtons } from "../mockData/availablebuttons.data";

// ====== Core Components ======
import GridContainer from "./GridContainer";
import { BsNestedTabs } from "../components/controls/basecontrol/BsNestedTabs";
import EmployeeDetailPage from "./EmployeeDetailPage";
import EmployeeFormPage from "./EmployeeFormPage";
import DialogBox from "../components/controls/customcomponent/dialogueBox/DialogBox";

// ====== Base Controls ======
import { Column, useBsToast } from "../components/controls/basecontrol";

// ====== Grid Container 2 (Advanced SectionGrid) ======
import SectionGrid from "../components/controls/customcomponent/grid2/section/SectionGrid";
import { SectionGridTopButtons } from "../components/controls/customcomponent/grid2/section/SectionGridTopButtons";
import { departmentRows, departmentSchema } from "../components/controls/customcomponent/grid2/schemas/department.schema";
import { employeeProvider } from "../components/controls/customcomponent/grid2/section/providers/employeeProvider";
import { employeeSchema as employeeSchema2, employeeRows as employeeRows2 } from "../components/controls/customcomponent/grid2/schemas/employee.schema";


// ==============================================
// 🌟 Component: ComplexControlDemo
// ==============================================
export function ComplexControlDemo() {
  // ----- State Management -----
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [filterText, setFilterText] = useState("");
  const { show } = useBsToast();

  // ----- Option Providers -----
  const optionProviders = useMemo(() => ({ Employee: employeeProvider }), []);

  // ==============================================
  // 📋 Row Type Definition
  // ==============================================
  type UserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
    designation: string;
    location: string;
    experience: number;
    projects: number;
    rating: string;
    active: boolean;
    joinDate: string;
    salary: number;
    bonus: number;
    phone: string;
    address: string;
    remarks: string;
  };

  // ==============================================
  // 🧩 Columns Configuration
  // ==============================================
  const columns = useMemo<Column<UserRow>[]>(
    () => [
      { key: "id", title: "ID", sortable: true, type: "number", frozen: true, width: 60 },
      { key: "name", title: "Name", sortable: true, editable: true, type: "text", frozen: true, width: 150 },
      { key: "email", title: "Email", sortable: true, editable: true, type: "text", width: 200 },
      { key: "role", title: "Role", sortable: true, type: "text", width: 100 },
      { key: "department", title: "Department", sortable: true, type: "text", width: 100 },
      { key: "designation", title: "Designation", sortable: true, type: "text", width: 100 },
      { key: "location", title: "Location", sortable: true, type: "text", width: 100 },
      { key: "experience", title: "Experience (Years)", type: "number", width: 100 },
      { key: "projects", title: "Projects", type: "number", width: 100 },
      { key: "rating", title: "Rating", type: "number", width: 100 },
      { key: "active", title: "Active", type: "boolean", width: 100 },
      { key: "joinDate", title: "Join Date", type: "date", width: 100 },
      { key: "salary", title: "Salary", type: "number", width: 100 },
      { key: "bonus", title: "Bonus", type: "number", width: 100 },
      { key: "phone", title: "Phone", type: "text", width: 100 },
      { key: "address", title: "Address", type: "text", width: 100 },
      { key: "remarks", title: "Remarks", type: "text", width: 100 },
    ],
    []
  );

  // ==============================================
  // 🧠 Generate Sample Rows
  // ==============================================
  const rows = useMemo<UserRow[]>(
    () =>
      Array.from({ length: 200 }).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
        department: ["HR", "IT", "Finance", "Marketing", "Support"][i % 5],
        designation: ["Manager", "Lead", "Executive", "Analyst", "Intern"][i % 5],
        location: ["New York", "London", "Berlin", "Tokyo", "Delhi"][i % 5],
        experience: (i % 15) + 1,
        projects: (i % 12) + 1,
        rating: (Math.random() * 5).toFixed(1),
        active: i % 2 === 0,
        joinDate: `2023-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
        salary: 35000 + (i % 10) * 2500,
        bonus: 2000 + (i % 5) * 500,
        phone: `+91-98765${(10000 + i).toString().slice(-5)}`,
        address: `Street ${i + 10}, City ${(i % 20) + 1}`,
        remarks: i % 4 === 0 ? "Top Performer" : i % 4 === 1 ? "Average" : "Needs Improvement",
      })),
    []
  );

  // ==============================================
  // 🔹 Sample Custom Components
  // ==============================================
  const ListComponent = () => (
    <div style={{ padding: 8 }}>
      <h4>Household List Component</h4>
      <p>This is rendered from a separate React component.</p>
    </div>
  );

  const PersonalComponent = () => (
    <div style={{ padding: 8 }}>
      <h4>Personal Info Component</h4>
      <p>Dynamic content or form goes here.</p>
    </div>
  );

  // ==============================================
  // 🧱 Render UI
  // ==============================================
  return (
    <div style={{ padding: "0rem", marginTop: 30, display: "grid", gap: "1.2rem" }}>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Complex Controls – Demo</h1>

      {/* ===================================================
          🧩 Nested Tabs – Container for multiple sections
      =================================================== */}
      <BsNestedTabs
        tabs={[
          {
            key: "household",
            label: "Household",
            children: [
              {
                key: "list",
                label: "List1",
                content: (
                  <GridContainer
                    schema={employeeSchema}
                    rows={employeeRows}
                    onOpenRecord={(id) => alert(`Open record ${id}`)}
                    buttons={gridButtons}
                    enableFiltering
                    enablePagination
                  />
                ),
              },
              { key: "empdetailpage", label: "Employee Details", content: <EmployeeDetailPage /> },
              { key: "dialogue", label: "Dialogue Box", content: <DialogBox /> },
              { key: "detail", label: "Details", content: <EmployeeFormPage /> },

              // ----- SectionGrid Dual Example -----
              {
                key: "empldetailpage2",
                label: "Employee Details 2",
                content: (
                  <div className="container">
                    <h1>SectionGrid — Dual Demo</h1>
                    <p className="badge">App-level HTTP cache + Dataset cache + Inline editors + Remote Select</p>

                    <div className="row" style={{ marginTop: 12 }}>
                      {/* ---- Employees Grid ---- */}
                      <div className="col">
                        <SectionGrid
                          title="Employees"
                          schema={employeeSchema2}
                          rows={employeeRows2}
                          topButtonsComponent={(ctx) => (
                            <SectionGridTopButtons
                              selectedIds={ctx.selectedIds}
                              emit={ctx.emit}
                              buttons={[
                                { id: "add", label: "Add", icon: "➕" },
                                { id: "edit", label: "Edit", icon: "✏️", disabled: ctx.selectedIds.length !== 1 },
                                { id: "delete", label: "Delete", icon: "🗑", disabled: ctx.selectedIds.length === 0 },
                                { id: "csv", label: "CSV", icon: "📄" },
                              ]}
                            />
                          )}
                          optionProviders={optionProviders}
                          onAction={(id, payload) => {
                            console.log("[Employees] action", id, payload);
                            alert(`Employees action: ${id} payload=${JSON.stringify(payload)}`);
                          }}
                        />
                      </div>

                      {/* ---- Departments Grid ---- */}
                      <div className="col">
                        <SectionGrid
                          title="Departments"
                          schema={departmentSchema}
                          rows={departmentRows}
                          topButtonsComponent={(ctx) => (
                            <SectionGridTopButtons
                              selectedIds={ctx.selectedIds}
                              emit={ctx.emit}
                              buttons={[
                                { id: "add", label: "Add", icon: "➕" },
                                { id: "edit", label: "Edit", icon: "✏️", disabled: ctx.selectedIds.length !== 1 },
                              ]}
                            />
                          )}
                          onAction={(id) => {
                            console.log("[Departments] action", id);
                            alert(`Departments action: ${id}`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ),
              },

              { key: "custom", label: "Custom1", content: <div>Custom view</div> },
            ],
          },
          { key: "policies", label: "Policies", content: <div>Policies content</div> },
          { key: "accounts", label: "Investment Accounts", content: <div>Accounts</div> },
          { key: "positions", label: "Investment Positions", content: <div>Positions</div> },
          { key: "log", label: "Activity Log", content: <div>Log data</div> },
          { key: "groups", label: "Account Groups", content: <div>Groups content</div> },
        ]}
      />

      {/* ===================================================
          🪟 Modal Section
      =================================================== */}
      <BsModal
        open={modal}
        onClose={() => setModal(false)}
        title="Modal Title"
        footer={
          <>
            <button className="cx-btn" onClick={() => setModal(false)}>
              Cancel
            </button>
            <button className="cx-btn cx-btn--primary" onClick={() => setModal(false)}>
              Confirm
            </button>
          </>
        }
      >
        <p>Build your own complex UI controls from scratch.</p>
      </BsModal>

      {/* ===================================================
          📥 Drawer Section
      =================================================== */}
      <BsDrawer open={drawer} onClose={() => setDrawer(false)} side="right" width={420}>
        <div style={{ padding: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Drawer</h3>
          <p>Place settings, filters, or secondary content here.</p>
          <button className="cx-btn" onClick={() => setDrawer(false)}>
            Close
          </button>
        </div>
      </BsDrawer>
    </div>
  );
}
