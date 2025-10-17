import React, { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import clsx from "clsx";

type DevExType = "normal" | "default" | "success" | "danger";
type StylingMode = "contained" | "outlined" | "text";
type Size = "sm" | "md" | "lg";
type PolymorphicAs = "button" | "a" | React.ComponentType<any>;

type CommonProps = {
  text?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: DevExType;
  stylingMode?: StylingMode;
  hint?: string;
  disabled?: boolean;
  width?: number | string;
  height?: number | string;
  accessKey?: string;
  tabIndex?: number;
  visible?: boolean;
  rtlEnabled?: boolean;
  loading?: boolean;
  size?: Size;
  fullWidth?: boolean;
  useSubmitBehavior?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  as?: PolymorphicAs;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  "data-testid"?: string;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps =
  & CommonProps
  & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">;

const toneClasses = (type: DevExType, styling: StylingMode) => {
  const base = "inline-flex items-center justify-center rounded-xl select-none transition-[box-shadow,transform,background-color,border-color] outline-none";
  const focus = "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--btn-focus)]";
  const disabled = "disabled:opacity-60 disabled:cursor-not-allowed";

  const contained = {
    normal: "bg-[var(--btn-bg)] text-[var(--btn-fg)] hover:brightness-95 active:brightness-90",
    default: "bg-[var(--btn-primary)] text-white hover:brightness-95 active:brightness-90",
    success: "bg-[var(--btn-success)] text-white hover:brightness-95 active:brightness-90",
    danger: "bg-[var(--btn-danger)]  text-white hover:brightness-95 active:brightness-90",
  } as const;

  const outlined = {
    normal: "border border-[var(--btn-border)] text-[var(--btn-text)] hover:bg-[var(--btn-surface)]/60",
    default: "border border-[var(--btn-primary)] text-[var(--btn-primary)] hover:bg-[var(--btn-primary)]/10",
    success: "border border-[var(--btn-success)] text-[var(--btn-success)] hover:bg-[var(--btn-success)]/10",
    danger: "border border-[var(--btn-danger)]  text-[var(--btn-danger)]  hover:bg-[var(--btn-danger)]/10",
  } as const;

  const text = {
    normal: "text-[var(--btn-text)] hover:bg-[var(--btn-surface)]/60",
    default: "text-[var(--btn-primary)] hover:bg-[var(--btn-primary)]/10",
    success: "text-[var(--btn-success)] hover:bg-[var(--btn-success)]/10",
    danger: "text-[var(--btn-danger)]  hover:bg-[var(--btn-danger)]/10",
  } as const;

  const map = styling === "contained" ? contained : styling === "outlined" ? outlined : text;
  return clsx(base, focus, disabled, map[type]);
};

const sizeClasses = (size: Size) => {
  switch (size) {
    case "sm": return "h-8 px-3 text-sm gap-1.5";
    case "lg": return "h-12 px-5 text-base gap-2.5";
    default: return "h-10 px-4 text-sm gap-2";
  }
};

export const BsButtonControl = forwardRef<HTMLElement, ButtonProps>(function BsButtonControl(
  {
    text, children, icon, endIcon, type = "normal", stylingMode = "contained",
    size = "md", hint, disabled, width, height, onClick, fullWidth,
    useSubmitBehavior, loading, as = "button", rtlEnabled = false,
    className, href, target, rel, visible, ...rest
  },
  ref
) {
  if (visible === false) return null;

  const style: React.CSSProperties = {
    ...(width !== undefined ? { width } : null),
    ...(height !== undefined ? { height } : null),
    ...(rtlEnabled ? { direction: "rtl" } : null),
  };

  const Comp: any = as;
  const isLink = as === "a" || (!!href && as === "button");
  const ariaBusy = loading ? { "aria-busy": true } : {};
  const title = hint;

  const content = (
    <>
      {loading && (
        <span
          aria-hidden
          className="inline-block animate-spin h-[1em] w-[1em] border-[2px] border-current border-t-transparent rounded-full"
        />
      )}
      {!loading && icon ? <span className="inline-flex items-center">{icon}</span> : null}
      {text && <span className="whitespace-nowrap">{text}</span>}
      {children}
      {!loading && endIcon ? <span className="inline-flex items-center">{endIcon}</span> : null}
    </>
  );

  const baseClasses = clsx("ui-button",
    toneClasses(type, stylingMode),
    sizeClasses(size),
    fullWidth && "w-full",
    loading && "pointer-events-none",
    "active:scale-[0.98]",
    className
  );


  const stylingClass = stylingMode === "contained"
    ? (type === "default" ? "ui-button--contained-default" :
      type === "success" ? "ui-button--contained-success" :
        type === "danger" ? "ui-button--contained-danger" : "ui-button")
    : (stylingMode === "outlined" ? "ui-button--outlined" : "ui-button--text");

  const commonProps = {
    ref,
    className: clsx(baseClasses, stylingClass),
    title,
    style,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      if (disabled || loading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    },
    ...ariaBusy,
    ...rest,
  };

  if (isLink) {
    return (
      <Comp
        {...commonProps}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-disabled={disabled || loading || undefined}
        role="button"
      >
        {content}
      </Comp>
    );
  }

  const nativeType: ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    useSubmitBehavior ? "submit" : "button";

  return (
    <Comp {...commonProps} type={nativeType} disabled={disabled || loading}>
      {content}
    </Comp>
  );
});