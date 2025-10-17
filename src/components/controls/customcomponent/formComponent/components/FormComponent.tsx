import React from 'react';

type Props = {
  title: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accordionId?: string;
};

const FormComponent: React.FC<Props> = ({
  title,
  defaultOpen = true,
  open,
  onOpenChange,
  accordionId,
}) => {
  const isControlled = typeof open === 'boolean';
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? open! : internalOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalOpen(val);
    onOpenChange?.(val);
  };

  const baseId = accordionId ?? `sectiongrid-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const hdrId = `${baseId}-header`;
  const panelId = `${baseId}-panel`;

  return (
    <div className="sg-accordion">
      {/* Accordion Header */}
      <button
        id={hdrId}
        className="sg-accordion__header"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        type="button"
      >
        <div className="sg-accordion__title">{title}</div>

        <span className="sg-accordion__chevron" aria-hidden>
          {isOpen ? '▴' : '▾'}
        </span>
      </button>

      {/* Accordion Body */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={hdrId}
        className={`sg-accordion__panel ${isOpen ? 'open' : 'closed'}`}
      >
        <div className="p-2">body</div>
      </div>
    </div>
  );
};

export default FormComponent;
