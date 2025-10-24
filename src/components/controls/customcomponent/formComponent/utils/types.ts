import { ActionIdentifier } from './actions';

export type TopButtonsComponentProps = {
  selectedIds: number[];
  emit: (identifier: ActionIdentifier, value?: unknown) => void;
};
