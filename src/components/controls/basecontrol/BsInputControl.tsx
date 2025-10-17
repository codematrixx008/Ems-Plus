import React, { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";
import { BsCommonProps, FieldChromeProps, FieldChrome, containerStyle, fieldBase, fieldTone, sizePad } from "./BsCommon";

export type BsInputControlProps =
  & BsCommonProps
  & FieldChromeProps
  & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

export const BsInputControl = forwardRef<HTMLInputElement, BsInputControlProps>(function BsInputControl(
  { size = "md", disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
    id, label, helpText, errorText, required, style, ...rest }, ref) {

  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{ ...containerStyle({ width, height, rtlEnabled, fullWidth }), ...style }}>
      <input
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