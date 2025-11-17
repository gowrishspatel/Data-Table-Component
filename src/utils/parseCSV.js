export function parseCSV(text) {
    const rows = [];
    let cur = '';
    let row = [];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const nxt = text[i + 1];
        if (ch === '"') {
            if (inQuotes && nxt === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            row.push(cur);
            cur = '';
        } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
            if (ch === '\r' && nxt === '\n') i++;
            row.push(cur);
            cur = '';
            rows.push(row);
            row = [];
        } else {
            cur += ch;
        }
    }
    if (cur !== '' || row.length) row.push(cur);
    if (row.length) rows.push(row);
    if (!rows.length) return { header: [], data: [] };
    const header = rows[0].map((h) => h.trim());
    const data = rows.slice(1).map((r) => {
        const obj = {};
        for (let i = 0; i < header.length; i++) obj[header[i] || `col_${i}`] = r[i] !== undefined ? r[i] : '';
        return obj;
    });
    // remove BOM if present
    if (header.length && header[0].charCodeAt(0) === 0xfeff) header[0] = header[0].slice(1);
    return { header, data };
}