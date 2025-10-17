import React from 'react'
import { DialogButtonConfig, eDialogButtonType, openDialog } from './CommonDialogBox/DialogUtils';


const DialogBox = () => {

  const handleCloseDialog = (id: string) => {
    console.log("DialogBox handleCloseDialog", id);
  }

  const handleConfirmDialog = (id: string) => {
    console.log("DialogBox handleConfirmDialog", id);
  }
  const handleCancelDialog = (id: string) => {
    console.log("DialogBox handleCancelDialog", id);
  }

  const handleOpenDialog = (config: DialogButtonConfig[], title: string, message: string, senderId: string) => {
    openDialog({
      title,
      message,
      buttonConfig: config,
      senderId,
      onClose: (id) => handleCloseDialog(id),
      onConfirm: (id) => handleConfirmDialog(id),
      onCancel: (id) => handleCancelDialog(id)
    });
  };



  return (
    <div>

      <h5>Dialog Box Page</h5>

      <button onClick={() => handleOpenDialog(
        [{ buttonType: eDialogButtonType.OK }],
        "Save Item Criteria",
        "Saved Successfully",
        "saveItemCriteriaSuccessful"
      )}>
        Open Dialog</button>


    </div>
  )
}

export default DialogBox