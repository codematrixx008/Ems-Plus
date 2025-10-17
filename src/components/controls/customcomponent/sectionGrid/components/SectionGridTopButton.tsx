import * as React from 'react';
import { ActionIdentifier } from '../utils/actions';
import { JSX } from 'react';
import { BsButtonControl } from '../../../basecontrol/BsButtonControl';

export type TopButton = {
  id: string;
  label: string;
  identifier: ActionIdentifier;
  disabled?: boolean;
  icon?: JSX.Element;
  title?: string;
};

export type TopButtonClickMeta = { id: string; identifier: ActionIdentifier };

type Props = {
  items: TopButton[];
  onItemClick?: (
    ev: React.MouseEvent<HTMLElement>,
    meta: TopButtonClickMeta
  ) => void;
};

export default function SectionGridTopButton({ items, onItemClick }: Props) {
  return (
    <div className="flex gap-2 items-center">
      {items.map((b) => (
        <BsButtonControl
          key={b.id}
          text={b.label}
          icon={b.icon}
          hint={b.title ?? b.label}
          disabled={b.disabled}
          data-action-identifier={b.identifier}
          type="default"                // you can change this (default/success/danger)
          stylingMode="outlined"        // or 'contained' / 'text'
          size="sm"                     // compact look for top toolbar
          onClick={(ev) =>
            onItemClick?.(ev, { id: b.id, identifier: b.identifier })
          }
        />
      ))}
    </div>
  );
}
