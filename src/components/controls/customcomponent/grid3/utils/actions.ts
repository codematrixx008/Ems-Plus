
export type ActionSender = 'toolbar' | 'grid' | 'row';

export type ActionIdentifier =
  | 'add' | 'edit' | 'delete'
  | 'export:csv' | 'export:xlsx' | 'export:pdf'
  | 'open' | 'filter' | 'custom';

export type GridActionEvent = {
  sender: ActionSender;
  identifier: ActionIdentifier;
  value?: unknown;
};
