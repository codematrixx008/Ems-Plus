import React from 'react';
import TopButtonList, { TopButton } from './TopButtonList';

export function SectionGridTopButtons({
  buttons,
  selectedIds,
  emit
}:{
  buttons: TopButton[];
  selectedIds: number[];
  emit: (id: string, payload?: any) => void;
}){
  return (
    <TopButtonList
      items={buttons}
      onClick={(id)=> emit(id, { selectedIds })}
    />
  );
}
