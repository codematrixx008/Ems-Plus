import * as React from "react";
import { TopButtonsComponentProps } from "../utils/types";

import * as FileIcon from "react-icons/fi";

const { FiPlus, FiEdit, FiTrash2, FiDownload } = FileIcon as unknown as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };

import './CrudCsvButtons3.css';

const CrudCsvButtons3: React.FC<TopButtonsComponentProps> = ({
  selectedIds,
  emit,
}) => {
  const one = selectedIds.length === 1;
  const any = selectedIds.length > 0;

  const iconButtonStyle =
    "btn flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex gap-2">
      {/* Add Button */}
      <BsButtonControl
        className={iconButtonStyle}
        title="Add"
        onClick={() => emit("add")}
      >
        <FiPlus />
      </BsButtonControl>

      {/* Edit Button */}
      <BsButtonControl
        className={iconButtonStyle}
        title="Edit"
        disabled={!one}
        onClick={() => emit("edit", { id: selectedIds[0] })}
      >
        <FiEdit />
      </BsButtonControl>

      {/* Delete Button */}
      <BsButtonControl
        className={iconButtonStyle}
        title="Delete"
        disabled={!any}
        onClick={() => emit("delete", { ids: selectedIds })}
      >
        <FiTrash2 />
      </BsButtonControl>

      {/* Export CSV Button */}
      <BsButtonControl
        className={iconButtonStyle}
        title="Export CSV"
        onClick={() => emit("export:csv")}
      >
        <FiDownload />
      </BsButtonControl>
    </div>
  );
};

export default CrudCsvButtons3;
