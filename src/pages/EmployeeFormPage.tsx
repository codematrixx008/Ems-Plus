import React, { useState } from 'react';
import FormComponent from '../components/controls/customcomponent/formComponent/components/FormComponent';
import { GridActionEvent } from '../components/controls/customcomponent/formComponent/utils/actions';
import CrudFormButtons from '../components/controls/customcomponent/formComponent/components/CrudFormButtons';

const EmployeeFormPage = () => {

  const handleAction = (e: GridActionEvent) => {
        console.log('Action:', e);
    };

     const UIColumnList = [
    {
      "Id": 1,
      "ColumnName": "EmployeeName",
      "ColumnName_StrCode": "GRID_EMPLOYEE_NAME",
      "DbDataType": "Varchar",
      "ComponentType": "Textbox",
      "IsRequired": true,
      "Length": 200,
      "Placeholder": "GRID_PLACEHOLDER_EMPLOYEE_NAME",
      "DropdownId": 0,
      "IsHidden": false,
      "IsEnabled": true,
      "IsForSectionGrid": false,
      "IsForSearch": true,
      "IsEditablePopup": false,
      "TabIds": null,
      "AllowMultiSelectSearch": false
    },
    {
      "Id": 2,
      "ColumnName": "Department",
      "ColumnName_StrCode": "GRID_DEPARTMENT",
      "DbDataType": "Varchar",
      "ComponentType": "Dropdown",
      "IsRequired": true,
      "Length": 200,
      "Placeholder": "GRID_PLACEHOLDER_DEPARTMENT",
      "DropdownId": 1,
      "IsHidden": true,
      "IsEnabled": true,
      "IsForSectionGrid": false,
      "IsForSearch": true,
      "IsEditablePopup": true,
      "TabIds": null,
      "AllowMultiSelectSearch": false
    },
    {
      "Id": 3,
      "ColumnName": "Gender",
      "ColumnName_StrCode": "GRID_GENDER",
      "DbDataType": "Varchar",
      "ComponentType": "Dropdown",
      "IsRequired": true,
      "Length": 120,
      "Placeholder": "GRID_PLACEHOLDER_GENDER",
      "DropdownId": 2,
      "IsHidden": false,
      "IsEnabled": true,
      "IsForSectionGrid": false,
      "IsForSearch": true,
      "IsEditablePopup": true,
      "TabIds": null,
      "AllowMultiSelectSearch": false
    },
    {
      "Id": 4,
      "ColumnName": "Salary",
      "ColumnName_StrCode": "GRID_SALARY",
      "DbDataType": "Int",
      "ComponentType": "CurrencyTextbox",
      "IsRequired": true,
      "Length": 100,
      "Placeholder": "GRID_PLACEHOLDER_SALARY",
      "DropdownId": 0,
      "IsHidden": false,
      "IsEnabled": true,
      "IsForSectionGrid": false,
      "IsForSearch": true,
      "IsEditablePopup": false,
      "TabIds": null,
      "AllowMultiSelectSearch": false
    },
    {
      "Id": 5,
      "ColumnName": "DOB",
      "ColumnName_StrCode": "GRID_DOB",
      "DbDataType": "Date",
      "ComponentType": "DatePicker",
      "IsRequired": true,
      "Length": 100,
      "Placeholder": "GRID_PLACEHOLDER_DOB",
      "DropdownId": 0,
      "IsHidden": false,
      "IsEnabled": true,
      "IsForSectionGrid": false,
      "IsForSearch": true,
      "IsEditablePopup": false,
      "TabIds": null,
      "AllowMultiSelectSearch": false
    },
    {
      "Id": 6,
      "ColumnName": "IsActive",
      "ColumnName_StrCode": "GRID_IS_ACTIVE",
      "DbDataType": "Bit",
      "ComponentType": "Checkbox",
      "IsRequired": false,
      "Length": 100,
      "Placeholder": "GRID_PLACEHOLDER_CHECKBOX",
      "DropdownId": 0,
      "IsHidden": false,
      "IsEnabled": true,
      "IsForSectionGrid": false,
      "IsForSearch": true,
      "IsEditablePopup": false,
      "TabIds": null,
      "AllowMultiSelectSearch": false
    }
  ]

    return (
        <div className="container">
            <div className="card p-3">
                <FormComponent
                    title="Personal Information"
                    defaultOpen={true}
                    topButtonsComponent={CrudFormButtons}
                    onAction={(e) => handleAction(e)}
                    formColumnsArray={UIColumnList}
                    useFormControls={false}
                />


            </div>
        </div>
    );
};

export default EmployeeFormPage;
