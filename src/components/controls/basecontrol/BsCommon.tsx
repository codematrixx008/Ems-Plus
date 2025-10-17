// =============================================
// ✅ BsCommon.ts — Common Props & Field Helpers
// =============================================

import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

// --------- Shared Types ---------


export type Size = "sm" | "md" | "lg";

export type BsCommonProps = {
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  hint?: string;
  rtlEnabled?: boolean;
  visible?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  "data-testid"?: string;
};

// --------- Utility Functions ---------
export const sizePad = (size: Size = "md") =>
  size === "sm" ? "h-8 text-sm" : size === "lg" ? "h-12 text-base" : "h-10 text-sm";

export const fieldBase =
  "rounded-xl border transition-[box-shadow,border-color,background-color] outline-none " +
  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ctl-focus)]";

export const fieldTone = (invalid?: boolean, disabled?: boolean) =>
  clsx(
    invalid
      ? "border-[var(--ctl-danger)]"
      : "border-[var(--ctl-border)] focus:border-[var(--ctl-primary)]",
    disabled ? "opacity-60 cursor-not-allowed bg-[var(--ctl-surface)]" : "bg-white"
  );

export const containerStyle = (
  props: Pick<BsCommonProps, "width" | "height" | "rtlEnabled" | "fullWidth">
): React.CSSProperties => ({
  ...(props.width !== undefined ? { width: props.width } : null),
  ...(props.height !== undefined ? { height: props.height } : null),
  ...(props.rtlEnabled ? { direction: "rtl" } : null),
  ...(props.fullWidth ? { width: "100%" } : null),
});

// --------- Field Chrome Component ---------
export type FieldChromeProps = {
  id?: string;
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  errorText?: React.ReactNode;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type BsCheckboxControlProps =
  & BsCommonProps
  & FieldChromeProps
  & Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">;


export const FieldChrome: React.FC<FieldChromeProps & { children: React.ReactNode }> = ({
  id,
  label,
  helpText,
  errorText,
  required,
  className,
  style,
  children,
}) => {
  return (
    <label className={clsx("block", className)} style={style} htmlFor={id}>
      {label && (
        <div className="mb-1 text-sm font-medium text-[var(--ctl-label)]">
          {label}
          {required ? <span className="text-[var(--ctl-danger)]"> *</span> : null}
        </div>
      )}
      {children}
      {errorText ? (
        <div className="mt-1 text-xs text-[var(--ctl-danger)]">{errorText}</div>
      ) : helpText ? (
        <div className="mt-1 text-xs text-[var(--ctl-muted)]">{helpText}</div>
      ) : null}
    </label>
  );
};

// ✅ Export BsCommon object to avoid missing member errors
export const BsCommon = {
  sizePad,
  fieldBase,
  fieldTone,
  containerStyle,
  FieldChrome,
};
