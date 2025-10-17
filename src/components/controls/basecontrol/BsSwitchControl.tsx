import React from "react";
import clsx from "clsx";
import { BsCommonProps, FieldChrome, FieldChromeProps, containerStyle } from "./BsCommon";

export type BsSwitchControlProps =
  & BsCommonProps
  & FieldChromeProps
  & {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    id?: string;
  };

export function BsSwitchControl({
  checked=false, onChange, id, disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
  label, helpText, errorText, required, style
}: BsSwitchControlProps) {
  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{...containerStyle({width,height,rtlEnabled,fullWidth}), ...style}}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        title={hint}
        onClick={() => !disabled && onChange?.(!checked)}
        className={clsx(
          "ui-switch relative inline-flex items-center rounded-full transition-colors",
          checked ? "bg-[var(--ctl-primary)]" : "bg-[var(--ctl-border)]",
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <span
          className={clsx(
            "ui-switch__thumb inline-block transform rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </FieldChrome>
  );
}