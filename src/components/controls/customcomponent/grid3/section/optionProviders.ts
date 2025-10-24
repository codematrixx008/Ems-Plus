export type OptionItem = { value: string; label: string };
export type OptionPage = { items: OptionItem[]; nextCursor?: string | null };

export type LoadArgs = {
  term: string;
  cursor?: string | null;
  params?: Record<string, any>;
  row?: Record<string, any>;
};

export type OptionProvider = {
  load: (args: LoadArgs) => Promise<OptionPage>;
  resolve?: (value: string, row?: Record<string, any>) => Promise<OptionItem | null>;
};
