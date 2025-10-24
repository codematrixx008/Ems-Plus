import React from 'react';
import { BsButtonControl } from '../../../../basecontrol';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
};
const DeleteConfirmModal3: React.FC<Props> = ({ open, onClose, onConfirm, count }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'grid', placeItems: 'center' }}>
      <div style={{ background: '#fff', padding: 16, width: 420, borderRadius: 8 }}>
        <h3>Delete</h3>
        <p>Are you sure you want to delete {count} record(s)?</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <BsButtonControl onClick={onClose}>Cancel</BsButtonControl>
          <BsButtonControl onClick={onConfirm} style={{ background: '#e53935', color: '#fff' }}>Delete</BsButtonControl>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmModal3;
