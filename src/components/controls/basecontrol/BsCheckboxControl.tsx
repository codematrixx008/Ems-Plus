import React, { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";
import { BsCheckboxControlProps, BsCommon } from "./BsCommon";
import { BsCommonProps, containerStyle, FieldChrome,  } from "./BsCommon";



export const BsCheckboxControl = forwardRef<HTMLInputElement, BsCheckboxControlProps>(function BsCheckboxControl(
  { disabled, invalid, fullWidth, hint, rtlEnabled, visible, width, height, className,
    id, label, helpText, errorText, required, style, children, size, ...rest }, ref) {

  if (visible === false) return null;

  return (
    <FieldChrome id={id} label={label} helpText={helpText} errorText={errorText} required={required}
      className={fullWidth ? "w-full" : undefined} style={{...containerStyle({width,height,rtlEnabled,fullWidth}), ...style}}>
      <div className={clsx("ui-choice inline-flex items-center gap-2", className)} title={hint}>
        <input
          ref={ref}
          id={id}
          type="checkbox" className="ui-checkbox"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          {...rest}
        />
        {children && <span>{children}</span>}
      </div>
    </FieldChrome>
  );
});