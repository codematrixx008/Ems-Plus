import React, { forwardRef, SelectHTMLAttributes } from "react";
import clsx from "clsx";
import { BsCommonProps, sizePad, fieldBase, fieldTone, containerStyle, FieldChrome, FieldChromeProps } from "./BsCommon";

export type Option = { value: string | number; label: React.ReactNode; disabled?: boolean };

export type BsSelectControlProps =
  & BsCommonProps
  & FieldChromeProps
  & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">
  & { options: Option[] };

export const BsSelectControl = forwardRef<HTMLSelectElement, BsSelectControlProps>(function BsSelectControl(
  { options, size="md", disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
    id, label, helpText, errorText, required, style, ...rest }, ref) {

  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{...containerStyle({width,height,rtlEnabled,fullWidth}), ...style}}>
      <select
        ref={ref}
        id={id}
        title={hint}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={clsx(
          "ui-control ui-select w-full px-3 appearance-none bg-no-repeat bg-right pr-8",
          fieldBase,
          fieldTone(invalid, disabled),
          sizePad(size),
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