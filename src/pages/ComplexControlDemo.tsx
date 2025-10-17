import React, { useMemo, useState } from "react";
import { employeeSchema } from "../schemas/employee.schema";
import { employeeRows } from "../mockData/employee.data";
import { gridButtons } from "../mockData/availablebuttons.data";
import GridContainer from "./GridContainer";
import { BsNestedTabs } from "../components/controls/basecontrol/BsNestedTabs";
import EmployeeDetailPage from "./EmployeeDetailPage";
import { Column, useBsToast } from "../components/controls/basecontrol";
import DialogBox from "../components/controls/customcomponent/dialogueBox/DialogBox";
import EmployeeFormPage from "./EmployeeFormPage";

export function ComplexControlDemo() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [filterText, setFilterText] = useState("");
  const { show } = useBsToast();

  //  Define your row type
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


  //  Define columns correctly
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
        joinDate: `2023-${String((i % 12) + 1).padStart(2, "0")}-${String(
          (i % 28) + 1
        ).padStart(2, "0")}`,
        salary: 35000 + (i % 10) * 2500,
        bonus: 2000 + (i % 5) * 500,
        phone: `+91-98765${(10000 + i).toString().slice(-5)}`,
        address: `Street ${i + 10}, City ${(i % 20) + 1}`,
        remarks: i % 4 === 0 ? "Top Performer" : i % 4 === 1 ? "Average" : "Needs Improvement",
      })),
    []
  );

  // Sample custom components
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

  return (
    <div style={{ padding: "0rem", marginTop: 30, display: "grid", gap: "1.2rem" }}>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
        Complex Controls – Demo
      </h1>

      {/* Action Buttons with Tooltip, Popover, Dropdown, Toast */}
      {/* <div
        className="cx-panel"
        style={{
          padding: ".75rem",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <button className="cx-btn cx-btn--primary" onClick={() => setModal(true)}>
          Open Modal
        </button>

        <button className="cx-btn" onClick={() => setDrawer(true)}>
          Open Drawer
        </button>

        <BsTooltip content="Hello tooltip">
          <button className="cx-btn">Tooltip</button>
        </BsTooltip>

        <BsPopover
          trigger={<button className="cx-btn">Popover</button>}
          content={
            <div style={{ display: "grid", gap: 6 }}>
              <button className="cx-btn cx-btn--ghost">Action 1</button>
              <button className="cx-btn cx-btn--ghost">Action 2</button>
            </div>
          }
        />

        <BsDropdownMenu
          trigger={<button className="cx-btn">Menu ▾</button>}
          items={[
            {
              key: "n1",
              label: "New File",
              onSelect: () => show("success", "New File created"),
            },
            {
              key: "n2",
              label: "New Folder",
              onSelect: () => show("success", "New Folder created"),
            },
            {
              key: "d", divider: true,
              label: undefined
            },
            {
              key: "del",
              label: "Delete",
              onSelect: () => show("error", "Deleted"),
            },
          ]}
        />

        <BsButtonControl
          className="cx-btn"
          onClick={() =>
            show("info", "Heads up! A sample info toast.", { title: "Info" })
          }
        >
          Show Toast
        </BsButtonControl>
      </div> */}

      {/* Tabs */}
      {/* <BsTabs
        tabs={[
          { key: "t1", label: "Overview", content: <div>Overview content here.</div> },
          { key: "t2", label: "Settings", content: <div>Settings content here.</div> },
          { key: "t3", label: "Usage", content: <div>Usage content here.</div> },
        ]}
      /> */}

      <BsNestedTabs
        tabs={[
          
          {
            key: "household",
            label: "Household",
            children: [
              {
                key: "list", label: "List1",
                content:
                  <GridContainer
                    schema={employeeSchema}
                    rows={employeeRows}
                    onOpenRecord={(id) => alert(`Open record ${id}`)}
                    buttons={gridButtons}
                    enableFiltering={true}
                    enablePagination={true}
                  />
              },
              { key: "empdetailpage", label: "Employee Details", content: <EmployeeDetailPage /> },
              { key: "dialogue", label: "Dialogue Box", content: <DialogBox/> },
              { key: "detail", label: "Details", content: <EmployeeFormPage/> },
              { key: "letters", label: "Letters/Documents1", content: <div>Documents list</div> },
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


      {/* Accordion */}
      {/* <BsAccordion
        items={[
          { key: "a1", title: "Section A", content: "Lorem ipsum dolor sit amet." },
          { key: "a2", title: "Section B", content: "More detailed content here." },
        ]}
      /> */}

      {/* Breadcrumbs */}
      {/* <BsBreadcrumbs
        items={[
          { key: "home", label: "Home" },
          { key: "apps", label: "Apps" },
          { key: "demo", label: "Complex Controls" },
        ]}
      /> */}

      {/* Stepper */}
      {/* <BsStepper
        steps={[
          { key: "s1", label: "Account" },
          { key: "s2", label: "Profile" },
          { key: "s3", label: "Done" },
        ]}
        active="s2"
      /> */}

      {/* Form Controls: Autocomplete, TagInput, FileUpload */}
      {/* <div
        className="cx-panel"
        style={{ padding: ".75rem", display: "grid", gap: 8 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <BsAutocomplete
            options={[
              "India",
              "Indonesia",
              "USA",
              "Germany",
              "France",
              "Japan",
              "Brazil",
              "Canada",
            ]}
            placeholder="Autocomplete country"
          />
          <BsTagInput />
        </div>

        <BsFileUpload />
      </div> */}

      {/* Split Pane: TreeView + DataTable */}
      {/* <BsSplitPane>
        <div style={{ padding: ".75rem" }}>
          <BsTreeView
            data={[
              {
                id: "root",
                label: "Root",
                children: [
                  {
                    id: "src",
                    label: "src",
                    children: [
                      {
                        id: "ui",
                        label: "ui",
                        children: [{ id: "file", label: "Button.tsx" }],
                      },
                    ],
                  },
                ],
              },
            ]}
          />
        </div>

        <div style={{ padding: ".75rem" }}>
         

          <BsDataTable
            columns={columns}
            rows={rows}
            pageSize={4}
            filterText={filterText}
            onFilterTextChange={setFilterText}
            enableFiltering
            enablePagination
            enableSorting
            enableEditing
            onEdit={(key: any, value: any, rowIndex: any) =>
              console.log("Edited:", key, value, rowIndex)
            }
          />

        </div>
      </BsSplitPane> */}

      {/* Modal */}
      <BsModal
        open={modal}
        onClose={() => setModal(false)}
        title="Modal Title"
        footer={
          <>
            <button className="cx-btn" onClick={() => setModal(false)}>
              Cancel
            </button>
            <button
              className="cx-btn cx-btn--primary"
              onClick={() => setModal(false)}
            >
              Confirm
            </button>
          </>
        }
      >
        <p>Build your own complex UI controls from scratch.</p>
      </BsModal>

      {/* Drawer */}
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
