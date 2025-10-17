import React from "react";
import clsx from "clsx";
import { BsCommonProps, containerStyle, FieldChrome, FieldChromeProps } from "./BsCommon";

export type RadioOption = { value: string | number; label: React.ReactNode; disabled?: boolean };

export type BsRadioGroupControlProps =
  & BsCommonProps
  & FieldChromeProps
  & {
    name: string;
    value?: string | number;
    onChange?: (value: string) => void;
    options: RadioOption[];
    direction?: "row" | "column";
    id?: string;
  };

export function BsRadioGroupControl({
  name, value, onChange, options, direction="row",
  disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
  id, label, helpText, errorText, required, style,
}: BsRadioGroupControlProps) {

  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{...containerStyle({width,height,rtlEnabled,fullWidth}), ...style}}>
      <div
        role="radiogroup"
        aria-invalid={invalid || undefined}
        className={clsx(direction === "row" ? "flex flex-wrap gap-4" : "grid gap-2", className)}
        title={hint}
      >
        {options.map(o => (
          <label key={String(o.value)} className={clsx("ui-choice inline-flex items-center gap-2", (disabled || o.disabled) && "opacity-60 cursor-not-allowed")}>
            <input
              type="radio" className="ui-radio"
              name={name}
              value={String(o.value)}
              disabled={disabled || o.disabled}
              checked={String(value) === String(o.value)}
              onChange={(e) => onChange?.(e.target.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </FieldChrome>
  );
}