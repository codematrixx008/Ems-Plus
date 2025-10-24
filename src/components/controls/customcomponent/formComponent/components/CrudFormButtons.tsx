import * as React from "react";
import { TopButtonsComponentProps } from "../utils/types";
import * as FileIcon from "react-icons/fi";
const { FiSave, FiX } = FileIcon as unknown as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };
import './CrudFormButtons.css';

const CrudFormButtons: React.FC<TopButtonsComponentProps> = ({
  selectedIds,
  emit,
}) => {
  const one = selectedIds.length === 1;
  const any = selectedIds.length > 0;

  const iconButtonStyle =
    "btn flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex gap-2">
      {/* Save Button */}
      <BsButtonControl
        className={iconButtonStyle}
        title="Save"
        onClick={() => emit("save")}
      >
        <FiSave />
      </BsButtonControl>

     
      {/* Cancel Button */}
      <BsButtonControl
        className={iconButtonStyle}
        title="Cancel"
        onClick={() => emit("cancel")}
      >
        <FiX />
      </BsButtonControl>

      
    </div>
  );
};

export default CrudFormButtons;
