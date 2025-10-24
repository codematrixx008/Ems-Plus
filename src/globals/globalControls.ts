// ===========================================
// 🌍 GLOBAL CONTROL REGISTRATION (TypeScript)
// ===========================================

import {
  // ---- Basic Controls ----
  BsCommon,
  BsButtonControl,
  BsInputControl,
  BsTextAreaControl,
  BsSelectControl,
  BsMultiSelectControl,
  BsCheckboxControl,
  BsSwitchControl,
  BsRadioGroupControl,
  BsNumberInputControl,
  BsDateInputControl,

  // ---- Complex Controls ----
  BsModal,
  BsDrawer,
  BsTooltip,
  BsPopover,
  BsTabs,
  BsAccordion,
  BsToast,
  BsDropdownMenu,
  BsBreadcrumbs,
  BsPagination,
  BsStepper,
  BsTagInput,
  BsAutocomplete,
  BsFileUpload,
  BsTreeView,
  BsSplitPane,
  BsDataTable,
} from "../components/controls/basecontrol";

// ==================================================
// Attach all controls to the global `window` object
// ==================================================
Object.assign(window, {
  // ---- Basic Controls ----
  BsCommon,
  BsButtonControl,
  BsInputControl,
  BsTextAreaControl,
  BsSelectControl,
  BsMultiSelectControl,
  BsCheckboxControl,
  BsSwitchControl,
  BsRadioGroupControl,
  BsNumberInputControl,
  BsDateInputControl,

  // ---- Complex Controls ----
  BsModal,
  BsDrawer,
  BsTooltip,
  BsPopover,
  BsTabs,
  BsAccordion,
  BsToast,
  BsDropdownMenu,
  BsBreadcrumbs,
  BsPagination,
  BsStepper,
  BsTagInput,
  BsAutocomplete,
  BsFileUpload,
  BsTreeView,
  BsSplitPane,
  BsDataTable,
});

console.log(" Global controls registered successfully!");
