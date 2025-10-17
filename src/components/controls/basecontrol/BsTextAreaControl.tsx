import React, { forwardRef, TextareaHTMLAttributes } from "react";
import clsx from "clsx";
import { BsCommonProps, fieldBase, fieldTone, containerStyle, FieldChrome, FieldChromeProps } from "./BsCommon";

export type BsTextAreaControlProps =
  & BsCommonProps
  & FieldChromeProps
  & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

export const BsTextAreaControl = forwardRef<HTMLTextAreaElement, BsTextAreaControlProps>(function BsTextAreaControl(
  { disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
    id, label, helpText, errorText, required, style, rows = 4, ...rest }, ref) {

  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{...containerStyle({width,height,rtlEnabled,fullWidth}), ...style}}>
      <textarea
        ref={ref}
        id={id}
        title={hint}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        rows={rows}
        className={clsx(
          "ui-control w-full px-3 py-2",
          fieldBase,
          fieldTone(invalid, disabled),
          className
        )}
        {...rest}
      />
    </FieldChrome>
  );
});