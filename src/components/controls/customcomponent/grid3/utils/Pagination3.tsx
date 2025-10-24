import React from "react";

import * as FileIcon from "react-icons/fi";

const { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } = FileIcon as unknown as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };

type Props = {
  total: number;
  pageNo: number;
  pageSize: number;
  pageSizeList: number[];
  onPageNo: (n: number, action: string) => void;
  onPageSize: (n: number) => void;
};

const Pagination3: React.FC<Props> = ({
  total,
  pageNo,
  pageSize,
  pageSizeList,
  onPageNo,
  onPageSize,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

  const btnStyle: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
  };

  const disabledStyle: React.CSSProperties = {
    opacity: 0.5,
    cursor: "not-allowed",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        fontSize: 14,
        boxShadow: "0 -2px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: Record count */}
      <div style={{ flex: 1, color: "#374151", fontWeight: 500 }}>
        Records: <strong>{total}</strong>
      </div>

      {/* Center: Page size dropdown */}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}
      >
        <label style={{ fontWeight: 500 }}>Page Size:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "#fff",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--main-theme)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
        >
          {pageSizeList.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Navigation buttons */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
        }}
      >
        <BsButtonControl
          disabled={pageNo === 1}
          onClick={() => onPageNo(1, "First")}
          style={{
            ...btnStyle,
            ...(pageNo === 1 ? disabledStyle : {}),
          }}
          title="First Page"
        >
          <FiChevronsLeft />
        </BsButtonControl>

        <BsButtonControl
          disabled={pageNo === 1}
          onClick={() => onPageNo(pageNo - 1, "Previous")}
          style={{
            ...btnStyle,
            ...(pageNo === 1 ? disabledStyle : {}),
          }}
          title="Previous Page"
        >
          <FiChevronLeft />
        </BsButtonControl>

        <span
          style={{
            minWidth: 60,
            textAlign: "center",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {pageNo} / {totalPages}
        </span>

        <BsButtonControl
          disabled={pageNo === totalPages}
          onClick={() => onPageNo(pageNo + 1, "Next")}
          style={{
            ...btnStyle,
            ...(pageNo === totalPages ? disabledStyle : {}),
          }}
          title="Next Page"
        >
          <FiChevronRight />
        </BsButtonControl>

        <BsButtonControl
          disabled={pageNo === totalPages}
          onClick={() => onPageNo(totalPages, "Last")}
          style={{
            ...btnStyle,
            ...(pageNo === totalPages ? disabledStyle : {}),
          }}
          title="Last Page"
        >
          <FiChevronsRight />
        </BsButtonControl>
      </div>
    </div>
  );
};

export default Pagination3;
