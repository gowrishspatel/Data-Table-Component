import React from 'react';
export default function TableHeader({ headers, visible, config, sort, setSort }) {
    const toggleSort = (col) => {
        if (!config[col] || !config[col].sortable) return;
        if (sort.column !== col) setSort({ column: col, direction: 'asc' });
        else if (sort.direction === 'asc') setSort({ column: col, direction: 'desc' });
        else setSort({ column: null, direction: null });
    };
    return (
        <thead>
            <tr>
                {headers.map((h) => visible && visible[h] ? (
                    <th key={h} onClick={() => toggleSort(h)} style={{ cursor: config[h] && config[h].sortable ? 'pointer' : 'default' }}>
                        {config[h] ? config[h].displayName : h}
                        {sort.column === h && <span className={`sort ${sort.direction}`}>{sort.direction === 'asc' ? ' ▲' : ' ▼'}</span>}
                    </th>
                ) : null)}
            </tr>
        </thead>
    );
}