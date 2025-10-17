import React, { useState } from "react";
// import { BsInputControl } from "../components/controls/basecontrol/BsInputControl";
import { BsNumberInputControl, 
  BsDateInputControl, 
  BsTextAreaControl, 
  BsSelectControl, 
  BsMultiSelectControl, 
  BsRadioGroupControl, 
  BsCheckboxControl, 
  BsSwitchControl, 
  BsButtonControl } from "../components/controls/basecontrol";

export default function FormControlDemo() {
  const [toggle, setToggle] = useState(false);
  const [mode, setMode] = useState("default");

  return (
    <form className="max-w-2xl mx-auto p-6 space-y-5 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 border-b pb-2">
        Form Controls Demo
      </h1>

      {/* Input Controls */}
      <BsInputControl
        id="name"
        label="Name"
        placeholder="Your name"
        required
      />

      <BsNumberInputControl
        id="age"
        label="Age"
        min={0}
        step={1}
        placeholder="0"
      />

      <BsDateInputControl
        id="dob"
        label="Date of Birth"
      />

      <BsTextAreaControl
        id="bio"
        label="Bio"
        placeholder="Tell us about yourself..."
      />

      {/* Select Controls */}
      <BsSelectControl
        id="country"
        label="Country"
        options={[
          { value: "", label: "Select…" },
          { value: "in", label: "India" },
          { value: "us", label: "United States" },
          { value: "de", label: "Germany" },
        ]}
        required
      />

      <BsMultiSelectControl
        id="skills"
        label="Skills (multi-select)"
        options={[
          { value: "react", label: "React" },
          { value: "blazor", label: "Blazor" },
          { value: "dotnet", label: ".NET" },
          { value: "sql", label: "SQL" },
        ]}
      />

      {/* Radio & Checkbox Controls */}
      <BsRadioGroupControl
        name="mode"
        label="Theme"
        options={[
          { value: "default", label: "Default" },
          { value: "success", label: "Success" },
          { value: "danger", label: "Danger" },
        ]}
        value={mode}
        onChange={setMode}
      />

      <BsCheckboxControl id="tos" required>
        I agree to the Terms
      </BsCheckboxControl>

      <BsSwitchControl
        label="Enable notifications"
        checked={toggle}
        onChange={setToggle}
      />

      {/* Action Buttons */}
      <div className="pt-4 flex justify-end gap-3">
        <BsButtonControl
          text="Submit"
          type="default"
          useSubmitBehavior
        />
        <BsButtonControl
          text="Delete"
          type="danger"
          stylingMode="outlined"
        />
      </div>
    </form>
  );
}
