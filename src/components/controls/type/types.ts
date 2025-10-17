
//Basic Shared Types

import clsx from "clsx";

export type Option = { id: string; name: string };
export type Draft = Partial<Option> & { name: string };
export type LoadFn = () => Promise<Option[]>;
export type SaveFn = (draft: Draft) => Promise<Option>;
export type UpdateFn = (id: string, draft: Draft) => Promise<Option>;


//Complex Shared Types

export type Size = "sm" | "md" | "lg";
export type Placement = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";

export type CommonProps = {
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
};

