
export type ActionSender = 'toolbar' | 'grid' | 'row';

export type ActionIdentifier =
 | 'save' | 'cancel';

export type GridActionEvent = {
  sender: ActionSender;
  identifier: ActionIdentifier;
  value?: unknown;
};
