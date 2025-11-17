import React from 'react';
export default function Pagination({ page, setPage, totalPages, pageSize, setPageSize, total }) {
    return (
        <div className="dt-footer">
            <div>Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</div>
            <div className="dt-pagination">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                <span>Page</span>
                <input value={page} onChange={(e) => setPage(Number(e.target.value || 1))} style={{ width: 50 }} />
                <span>of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                <label>Page size
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </label>
            </div>
        </div>
    );
}