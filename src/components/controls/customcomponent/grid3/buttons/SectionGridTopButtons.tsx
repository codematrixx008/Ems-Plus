import React from "react";
import TopButtonList, { TopButton } from "./TopButtonList";

//  Export TopButton type so it can be imported elsewhere
export type { TopButton };

export const SectionGridTopButton: React.FC<{
  items: TopButton[]; // 👈 changed from buttons → items for consistency
  selectedIds: number[];
  emit: (id: string, payload?: any) => void;
}> = ({ items, selectedIds, emit }) => {
  return (
    <TopButtonList
      items={items}
      onClick={(id) => emit(id, { selectedIds })}
    />
  );
};
