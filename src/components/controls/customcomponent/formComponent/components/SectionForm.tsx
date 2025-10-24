import React, { useState } from 'react';
import { ActionIdentifier, GridActionEvent } from '../utils/actions';
import { TopButtonsComponentProps } from '../utils/types';
import DynamicForm from './DynamicForm';

type SectionFormProps = {
  title: string;
  defaultOpen?: boolean;
  topButtonsComponent?: React.ComponentType<TopButtonsComponentProps>;
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

const SectionForm: React.FC<SectionFormProps> = ({
  title,
  defaultOpen = true,
  topButtonsComponent: TopButtonsComponent,
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
  const [actionType, setActionType] = useState<ActionIdentifier|null>(null);

  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalOpen(val);
    onOpenChange?.(val);
  };

  const handleAction = (e: GridActionEvent) => {
    console.log('Action:', e, e.identifier);
    setActionType(e.identifier);
  };


  const emit = (
    identifier: ActionIdentifier,
    value?: unknown,
    sender: GridActionEvent['sender'] = 'toolbar'
  ) => handleAction?.({ sender, identifier, value });

  const baseId = accordionId ?? `sectiongrid-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const hdrId = `${baseId}-header`;
  const panelId = `${baseId}-panel`;


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
                    <DynamicForm
                      formColumnsArray={formColumnsArray}
                      useFormControls={useFormControls}
                      actionType={actionType} 
                      onActionHandled={() => setActionType(null)}
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

export default SectionForm;
