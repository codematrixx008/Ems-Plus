import * as React from "react";
import { BsAccordion } from "../../../basecontrol/BsAccordion";

import GridContainer3 from "../GridContainer3";
import { ColumnDef, Row, TopButtonsComponentProps } from "../utils/types";
import { OptionProvider } from "./optionProviders";
import "./sectionGrid.css";
import { TopButton } from "../buttons/SectionGridTopButton3";
import { SectionGridTopButton } from "../buttons/SectionGridTopButtons";

export type ActionIdentifier = string;

export type SectionGrid3Props = {
  title: string;
  schema: ColumnDef[];
  rows: Row[];
  onAction?: (id: ActionIdentifier, payload?: any) => void;
  topButtons?: TopButton[];
  topButtonsComponent?: React.ComponentType<TopButtonsComponentProps>;
  optionProviders?: Record<string, OptionProvider>;
  useGridControls?: boolean;
  defaultOpen?: boolean;
  accordionId?: string;
  children?: React.ReactNode;
};

export default function SectionGrid3({
  title,
  schema,
  rows,
  onAction,
  topButtons,
  topButtonsComponent: TopButtonsComponent,
  optionProviders,
  useGridControls = true,
  defaultOpen = true,
  accordionId,
  children,
}: SectionGrid3Props) {
  console.log("✅ Rendering SectionGrid3:", { title });
  console.log("🧩 Props received:", {
    title,
    schema,
    rowsCount: rows?.length,
    hasOnAction: !!onAction,
    topButtons: topButtons?.length,
    hasTopButtonsComponent: !!TopButtonsComponent,
    optionProviders,
    useGridControls,
    defaultOpen,
    accordionId,
  });

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  console.log("🎯 Initial selectedIds:", selectedIds);

  // 🔹 Helper to trigger parent onAction
  const emit = React.useCallback(
    (id: ActionIdentifier, payload?: any) => {
      console.log("📣 emit called with:", { id, payload });
      if (onAction) {
        console.log("➡️ Triggering parent onAction handler");
        onAction(id, payload);
      } else {
        console.log("⚠️ No onAction handler provided");
      }
    },
    [onAction]
  );

  // 🔹 Unique Accordion ID
  const baseId =
    accordionId ?? `sectiongrid3-${title.replace(/\s+/g, "-").toLowerCase()}`;
  console.log("🆔 Computed baseId for accordion:", baseId);

  console.log("🚀 Rendering BsAccordion component...");
  return (
    <div className="sg3-accordion">
      <BsAccordion
        items={[
          {
            key: baseId,
            title: (
              <div
                className="sg3-accordion__header-content"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div className="sg3-accordion__title">{title}</div>

                {/* 🔹 Top Buttons Section */}
                <div
                  className="sg3-accordion__tools"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("🖱️ Top button area clicked - stopping accordion toggle");
                  }}
                >
                  {!useGridControls && (
                    <>
                      {TopButtonsComponent ? (
                        <>
                          {console.log("🔘 Rendering custom TopButtonsComponent")}
                          <TopButtonsComponent
                            selectedIds={selectedIds}
                            emit={(id, v) => {
                              console.log("🟢 TopButtonsComponent emit triggered:", { id, v });
                              emit(id, v);
                            }}
                          />
                        </>
                      ) : topButtons ? (
                        <>
                          {console.log("🔘 Rendering SectionGridTopButton with items:", topButtons)}
                          <SectionGridTopButton
                            items={topButtons}
                            selectedIds={selectedIds}
                            emit={emit}
                          />
                        </>
                      ) : (
                        console.log("⚠️ No top buttons or TopButtonsComponent provided")
                      )}
                    </>
                  )}
                </div>
              </div>
            ),

            /* 🔹 Grid Container Section */
            content: (
              <div className="sg3-accordion__content">
                <div className="sg3-accordion__grid">
                  <GridContainer3
                    columns={{ title, columns: schema, settings: {} }}
                    rows={rows}
                    selectedIds={selectedIds}
                    setSelectedIds={(ids) => {
                      console.log("📝 Updating selectedIds:", ids);
                      setSelectedIds(ids);
                    }}
                    optionProviders={optionProviders}
                    useGridControls={useGridControls}
                    onOpenRecord={(id) => {
                      console.log("📂 Record opened with id:", id);
                      emit("open", { id });
                    }}
                  >
                    {children}
                  </GridContainer3>
                </div>
              </div>
            ),
          },
        ]}
        defaultOpenKeys={defaultOpen ? [baseId] : []}
      />
    </div>
  );
}
