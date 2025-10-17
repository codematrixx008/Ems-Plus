
import * as React from 'react';

type Props = {
  total: number;
  pageNo: number;
  pageSize: number;
  pageSizeList?: number[];
  onPageNo: (n: number) => void;
  onPageSize: (n: number) => void;
};

export default function Pagination({ total, pageNo, pageSize, pageSizeList=[5,10,20,50,100], onPageNo, onPageSize }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="footer">
      <div className="pagination">
        <button className="btn" onClick={()=>onPageNo(1)} disabled={pageNo<=1}>⏮</button>
        <button className="btn" onClick={()=>onPageNo(pageNo-1)} disabled={pageNo<=1}>◀</button>
        <span>Page {pageNo} / {totalPages}</span>
        <button className="btn" onClick={()=>onPageNo(pageNo+1)} disabled={pageNo>=totalPages}>▶</button>
        <button className="btn" onClick={()=>onPageNo(totalPages)} disabled={pageNo>=totalPages}>⏭</button>
      </div>
      <div>
        <label> Page size: </label>
        <select value={pageSize} onChange={(e)=>onPageSize(Number(e.target.value))}>
          {pageSizeList.map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    </div>
  );
}
