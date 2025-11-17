export function exportToCsv(filename = 'export.csv', columns = [], rows = []) {
    function esc(s) {
        if (s == null) return '';
        const str = s.toString();
        if (str.includes(',') || str.includes('"') || str.includes('\n')) return '"' + str.replace(/"/g, '""') + '"';
        return str;
    }
    const lines = [];
    lines.push(columns.map(esc).join(','));
    for (const r of rows) lines.push(columns.map((c) => esc(r[c])).join(','));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}