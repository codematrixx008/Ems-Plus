export const isDateLike = (v: any) => v instanceof Date || !Number.isNaN(Date.parse(v));

export const formatDate = (input: any, format?: string) => {
  if (!input || !format) return input;
  const d = new Date(input);
  if (Number.isNaN(+d)) return input;
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  switch (format) {
    case "MM-DD-YYYY": return `${mm}-${dd}-${yyyy}`;
    case "MM/DD/YYYY": return `${mm}/${dd}/${yyyy}`;
    case "YYYY-MM-DD": return `${yyyy}-${mm}-${dd}`;
    case "YYYY/MM/DD": return `${yyyy}/${mm}/${dd}`;
    case "DD-MM-YYYY": return `${dd}-${mm}-${yyyy}`;
    case "DD/MM/YYYY": return `${dd}/${mm}/${yyyy}`;
    default: return input;
  }
};
