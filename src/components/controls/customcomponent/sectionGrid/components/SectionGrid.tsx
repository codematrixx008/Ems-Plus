import * as React from 'react';
import GridContainer from './GridContainer';
import { SectionGridSchema, Row, TopButtonsComponentProps } from '../utils/types';
import { GridActionEvent, ActionIdentifier } from '../utils/actions';
import SectionGridTopButton, { TopButton } from './SectionGridTopButton';
import "./sectionGrid.css";
import { BsAccordion } from '../../../basecontrol/BsAccordion';

type Props = {
  title: string;
  schema: SectionGridSchema;
  rows: Row[];
  pageSizeList?: number[];
  onAction?: (e: GridActionEvent) => void;
  topButtons?: TopButton[];
  topButtonsComponent?: React.ComponentType<TopButtonsComponentProps>;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accordionId?: string;
  children?: React.ReactNode;
  useGridControls: boolean;
};

export default function SectionGrid({
  title,
  schema,
  rows,
  pageSizeList,
  onAction,
  topButtons,
  topButtonsComponent: TopButtonsComponent,
  defaultOpen = false,
  open,
  onOpenChange,
  accordionId,
  children,
  useGridControls,
}: Props) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const isControlled = typeof open === 'boolean';
  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen);
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

  return (
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
                  ) : topButtons ? (
                    <SectionGridTopButton
                      items={topButtons}
                      onItemClick={(_, meta) => {
                        if (meta.identifier === "edit" && selectedIds.length === 1) {
                          emit("edit", { id: selectedIds[0] });
                        } else if (meta.identifier === "delete") {
                          emit("delete", { ids: selectedIds });
                        } else {
                          emit(meta.identifier);
                        }
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ),
            content: (
              <div className="sg-accordion__content">
                <div className="p-2">
                  <GridContainer
                    schema={schema}
                    rows={rows}
                    pageSizeList={pageSizeList}
                    onSelectedIdsChange={setSelectedIds}
                    onOpenRecord={(id) => emit("open", { id }, "grid")}
                    useGridControls={useGridControls}
                  >
                    {children}
                  </GridContainer>
                </div>
              </div>
            ),
          },
        ]}
        defaultOpenKeys={[defaultOpen ? "a1" : ""]}
      />
    </div>
  );
}
