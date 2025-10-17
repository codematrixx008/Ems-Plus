import * as React from "react";
import { TopButtonsComponentProps } from "../utils/types";


import * as FileIcon from "react-icons/fi";

const { FiPhoneCall, FiTrash2, FiDownload } = FileIcon as unknown as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };

const PhoneButtons: React.FC<TopButtonsComponentProps> = ({ selectedIds, emit }) => {
  const one = selectedIds.length === 1;
  const any = selectedIds.length > 0;

  const iconButton =
    "btn flex items-center justify-center p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex gap-2">
      {/* 📞 Call */}
      <button
        className={iconButton}
        title="Call"
        disabled={!one}
        onClick={() => emit("custom", { kind: "call", id: selectedIds[0] })}
      >
        <FiPhoneCall />
      </button>

      {/* 🗑 Delete */}
      <button
        className={iconButton}
        title="Delete"
        disabled={!any}
        onClick={() => emit("delete", { ids: selectedIds })}
      >
        <FiTrash2 />
      </button>

      {/* ⬇️ XLSX Export */}
      <button
        className={iconButton}
        title="Export XLSX"
        onClick={() => emit("export:xlsx")}
      >
        <FiDownload />
      </button>
    </div>
  );
};

export default PhoneButtons;
