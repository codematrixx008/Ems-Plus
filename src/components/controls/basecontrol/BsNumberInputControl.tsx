import React, { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";
import { BsCommonProps, sizePad, fieldBase, fieldTone, containerStyle, FieldChrome, FieldChromeProps } from "./BsCommon";

export type BsNumberInputControlProps =
  & BsCommonProps
  & FieldChromeProps
  & Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">;

export const BsNumberInputControl = forwardRef<HTMLInputElement, BsNumberInputControlProps>(function BsNumberInputControl(
  { size="md", disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
    id, label, helpText, errorText, required, style, ...rest }, ref) {

  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{...containerStyle({width,height,rtlEnabled,fullWidth}), ...style}}>
      <input
        type="number"
        ref={ref}
        id={id}
        title={hint}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={clsx(
          "ui-control w-full px-3",
          fieldBase,
          fieldTone(invalid, disabled),
          sizePad(size),
          className
        )}
        {...rest}
      />
    </FieldChrome>
  );
});