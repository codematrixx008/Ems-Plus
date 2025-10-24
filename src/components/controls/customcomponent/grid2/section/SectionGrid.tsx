import React from 'react';
import GridContainer from '../grid/components/GridContainer';
import type { ColumnDef, Row } from '../grid/utils/types';
import { OptionProvider } from './optionProviders';

export type ActionIdentifier = string;

export default function SectionGrid({
  title,
  schema,
  rows,
  onAction,
  topButtonsComponent,
  optionProviders
}:{
  title: string;
  schema: ColumnDef[];
  rows: Row[];
  onAction?: (id: ActionIdentifier, payload?: any) => void;
  topButtonsComponent?: (ctx:{ selectedIds:number[]; emit:(id:ActionIdentifier,v?:any)=>void }) => React.ReactNode;
  optionProviders?: Record<string, OptionProvider>;
}){
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const emit = (id:ActionIdentifier, payload?:any) => onAction?.(id, payload);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="accordion">
      <div className="ac-head" onClick={()=>setOpen(o=>!o)}>
        <div className="ac-title">{title}</div>
        <div onClick={(e)=>e.stopPropagation()}>
          {topButtonsComponent ? topButtonsComponent({ selectedIds, emit }) : null}
        </div>
      </div>
      {open && (
        <div className="ac-body">
          <GridContainer
            columns={schema}
            rows={rows}
            optionProviders={optionProviders}
            onOpenRecord={(id)=> emit('open', { id })}
          />
        </div>
      )}
    </div>
  );
}
