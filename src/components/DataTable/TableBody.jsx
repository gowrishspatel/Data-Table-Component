import React from 'react';
import { tryParseDate, safeNumber } from '../../utils/helpers';


function renderCell(value, cfg) {
    if (!cfg) return value;
    const v = value == null ? '' : value.toString();
    if (cfg.format) {
        const f = cfg.format;
        if (f.type === 'text') {
            if (f.transform === 'uppercase') return v.toUpperCase();
            if (f.transform === 'capitalize') return v.replace(/(^|\s)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
        }
        if (f.type === 'number') {
            const n = safeNumber(v); if (n != null) return f.decimals != null ? Number(n).toFixed(f.decimals) : n.toString();
        }
        if (f.type === 'date') {
            const d = tryParseDate(v); if (d) return d.toLocaleDateString();
        }
    }
    return v;
}

export default function TableBody({ headers, rows, visible, config }) {
    if (!rows.length) return <tbody><tr><td colSpan={headers.length}>No results found.</td></tr></tbody>;
    return (
        <tbody>
            {rows.map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'even' : ''}>
                    {headers.map((h) => visible && visible[h] ? (
                        <td key={h}>{renderCell(r[h], config[h])}</td>
                    ) : null)}
                </tr>
            ))}
        </tbody>
    );
}