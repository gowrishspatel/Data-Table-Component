export function safeNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}
export function tryParseDate(value) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}