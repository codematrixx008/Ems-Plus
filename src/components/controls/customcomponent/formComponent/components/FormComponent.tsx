import React, { useState } from 'react';
import CommonFormComponent from './CommonFormComponent';
import { ActionIdentifier, GridActionEvent } from '../utils/actions';
import { TopButtonsComponentProps } from '../utils/types';

type Props = {
  title: string;
  defaultOpen?: boolean;
  topButtonsComponent?: React.ComponentType<TopButtonsComponentProps>;
  onAction?: (e: GridActionEvent) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accordionId?: string;
  useFormControls?: boolean;
  formColumnsArray: {
    Id: number;
    ColumnName: string;
    ColumnName_StrCode: string;
    DbDataType: string;
    ComponentType: string;
    IsRequired: boolean;
    Length: number;
    Placeholder: string;
    DropdownId: number;
    IsHidden: boolean;
    IsEnabled: boolean;
    IsForSectionGrid: boolean;
    IsForSearch: boolean;
    IsEditablePopup: boolean;
    TabIds: number[] | null;
    AllowMultiSelectSearch: boolean;
  }[];
};

const FormComponent: React.FC<Props> = ({
  title,
  defaultOpen = true,
  topButtonsComponent: TopButtonsComponent,
  onAction,
  open,
  onOpenChange,
  accordionId,
  useFormControls,
  formColumnsArray,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const isControlled = typeof open === 'boolean';
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? open! : internalOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalOpen(val);
    onOpenChange?.(val);
  };

  const emit = (
    identifier: ActionIdentifier,
    value?: unknown,
    sender: GridActionEvent['sender'] = 'toolbar'
  ) => onAction?.({ sender, identifier, value });

  const baseId = accordionId ?? `sectiongrid-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const hdrId = `${baseId}-header`;
  const panelId = `${baseId}-panel`;




  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Received Form Data from Child:', data)
  }


  return (
    <>

      <div className="sg-accordion">
        <BsAccordion
          items={[
            {
              key: "a1",
              title: (
                <div
                  className="sg-accordion__header-content"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div className="sg-accordion__title">{title}</div>
                  <div
                    className="sg-accordion__tools"
                    onClick={(e) => e.stopPropagation()}
                  >

                    {TopButtonsComponent ? (
                      <TopButtonsComponent
                        selectedIds={selectedIds}
                        emit={(id, v) => emit(id, v)}
                      />
                    ) : ""}

                  </div>
                </div>
              ),
              content: (
                <div className="sg-accordion__content">
                  <div className="p-2">
                    <CommonFormComponent
                      formColumnsArray={formColumnsArray}
                      onSubmit={handleFormSubmit}
                      useFormControls={useFormControls}
                    />
                  </div>
                </div>
              ),
            },
          ]}
          defaultOpenKeys={[defaultOpen ? "a1" : ""]}
        />
      </div>


    </>
  );
};

export default FormComponent;
