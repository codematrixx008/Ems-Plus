import React, { forwardRef, SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { BsCommonProps, fieldBase, fieldTone, containerStyle, FieldChrome, FieldChromeProps } from "./BsCommon";

export type MultiOption = { value: string | number; label: React.ReactNode; disabled?: boolean };

export type BsMultiSelectControlProps =
  & BsCommonProps
  & FieldChromeProps
  & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple">
  & { options: MultiOption[] };

export const BsMultiSelectControl = forwardRef<HTMLSelectElement, BsMultiSelectControlProps>(function BsMultiSelectControl(
  { options, disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
    id, label, helpText, errorText, required, style, size = 6, ...rest }, ref) {

  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{...containerStyle({width,height,rtlEnabled,fullWidth}), ...style}}>
      <select
        multiple
        ref={ref}
        id={id}
        title={hint}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        size={typeof size === "number" ? size : 6}
        className={clsx(
          "ui-control ui-multiselect w-full px-3 py-2",
          fieldBase,
          fieldTone(invalid, disabled),
          className
        )}
        {...rest}
      >
        {options.map(o => (
          <option key={String(o.value)} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
      </select>
    </FieldChrome>
  );
});