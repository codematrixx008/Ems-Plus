import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // ---- Basic Controls ----
      BsCommon: any;
      BsButtonControl: any;
      BsInputControl: any;
      BsTextAreaControl: any;
      BsSelectControl: any;
      BsMultiSelectControl: any;
      BsCheckboxControl: any;
      BsSwitchControl: any;
      BsRadioGroupControl: any;
      BsNumberInputControl: any;
      BsDateInputControl: any;

      // ---- Complex Controls ----
      BsModal: any;
      BsDrawer: any;
      BsTooltip: any;
      BsPopover: any;
      BsTabs: any;
      BsAccordion: any;
      BsToast: any;
      BsDropdownMenu: any;
      BsBreadcrumbs: any;
      BsPagination: any;
      BsStepper: any;
      BsTagInput: any;
      BsAutocomplete: any;
      BsFileUpload: any;
      BsTreeView: any;
      BsSplitPane: any;
      BsDataTable: any;
    }
  }
}

export { };
