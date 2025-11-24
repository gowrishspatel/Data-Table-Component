import React, { useEffect, useMemo, useState } from 'react';
import { parseCSV } from '../../utils/parseCSV';
import useDebounce from '../../Hooks/Debounce';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Filters from './Filters';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import Loading from './Shared/Loading';
import ErrorBox from './Shared/ErrorBox';
import { exportToCsv } from '../../utils/csvExport';
import './DataTable.css';

const CSV_URL = 'https://raw.githubusercontent.com/venelinkochev/bin-list-data/master/bin-list-data.csv';

// Sample config (you can pass config as prop)
const SAMPLE_CONFIG = {
    columns: {},
    defaults: { searchable: false, filterable: false, sortable: false },
};

export default function DataTable({ csvUrl = CSV_URL, config = SAMPLE_CONFIG }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);

    const [visibleColumns, setVisibleColumns] = useState(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({ column: null, direction: null });
    const [pageSize, setPageSize] = useState(25);
    const [page, setPage] = useState(1);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(csvUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const text = await res.text();
                const { header, data } = parseCSV(text);
                if (cancelled) return;
                setHeaders(header);
                setRows(data);
                setVisibleColumns(header.reduce((acc, h) => ({ ...acc, [h]: true }), {}));
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => (cancelled = true);
    }, [csvUrl]);

    const columnConfig = useMemo(() => {
        const cc = {};
        headers.forEach((h) => {
            cc[h] = {
                key: h,
                displayName: (config.columns && config.columns[h] && config.columns[h].displayName) || h,
                searchable: (config.columns && config.columns[h] && config.columns[h].searchable) || config.defaults.searchable || false,
                filterable: (config.columns && config.columns[h] && config.columns[h].filterable) || config.defaults.filterable || false,
                sortable: (config.columns && config.columns[h] && config.columns[h].sortable) || config.defaults.sortable || false,
                format: (config.columns && config.columns[h] && config.columns[h].format) || null,
            };
        });
        return cc;
    }, [headers, config]);

    // processing: search, filters, sort
    const processed = useMemo(() => {
        let data = rows.slice();
        // search
        if (debouncedSearch) {
            const s = debouncedSearch.toLowerCase();
            const keys = Object.keys(columnConfig).filter((k) => columnConfig[k].searchable);
            if (keys.length === 0) {
                data = data.filter((r) => headers.some((h) => (r[h] || '').toString().toLowerCase().includes(s)));
            } else {
                data = data.filter((r) => keys.some((k) => (r[k] || '').toString().toLowerCase().includes(s)));
            }
        }
        // filters (AND)
        data = data.filter((r) => Object.keys(filters).every((k) => {
            const spec = filters[k];
            if (!spec || spec.value === '' || spec.value === undefined) return true;
            const raw = (r[k] || '').toString();
            if (spec.type === 'text') {
                if (spec.mode === 'equals') return raw.toLowerCase() === spec.value.toString().toLowerCase();
                return raw.toLowerCase().includes(spec.value.toString().toLowerCase());
            } else if (spec.type === 'select') {
                return raw === spec.value;
            } else if (spec.type === 'number') {
                const n = Number(raw);
                const v = Number(spec.value);
                if (isNaN(n) || isNaN(v)) return false;
                if (spec.mode === 'gt') return n > v;
                if (spec.mode === 'lt') return n < v;
                return n === v;
            }
            return true;
        }));

        // sort
        if (sort.column) {
            const col = sort.column;
            const dir = sort.direction === 'asc' ? 1 : -1;
            data.sort((a, b) => {
                const A = a[col] || '';
                const B = b[col] || '';
                const An = Number(A);
                const Bn = Number(B);
                if (!isNaN(An) && !isNaN(Bn)) return (An - Bn) * dir;
                const Ad = new Date(A);
                const Bd = new Date(B);
                if (!isNaN(Ad.getTime()) && !isNaN(Bd.getTime())) return (Ad - Bd) * dir;
                return A.toString().localeCompare(B.toString()) * dir;
            });
        }
        return data;
    }, [rows, debouncedSearch, filters, sort, columnConfig, headers]);


    // pagination
    const total = processed.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    useEffect(() => { if (page > totalPages) setPage(1); }, [page, totalPages]);
    const pageRows = useMemo(() => {
        const start = (page - 1) * pageSize; return processed.slice(start, start + pageSize);
    }, [processed, page, pageSize]);


    if (loading) return <Loading />;
    if (error) return <ErrorBox message={error} />;
    if (!headers.length) return <div>No data found</div>;

    const toggleColumn = (col) => setVisibleColumns((v) => ({ ...v, [col]: !v[col] }));
    const handleExport = () => exportToCsv('export.csv', headers.filter((h) => visibleColumns[h]), processed);


    return (
        <div className="dt-root">
            <div className="dt-toolbar">
                <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} />
                <div className="dt-actions">
                    <button onClick={handleExport}>Export CSV</button>
                    <Filters headers={headers} config={columnConfig} rows={rows} filters={filters} setFilters={setFilters} clearFilter={(k) => setFilters((p) => { const n = { ...p }; delete n[k]; return n; })} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
                </div>
            </div>


            <div className="dt-main">
                <section className="dt-table-area">
                    <table className="dt-table" role="table">
                        <TableHeader headers={headers} visible={visibleColumns} config={columnConfig} sort={sort} setSort={setSort} />
                        <TableBody headers={headers} rows={pageRows} visible={visibleColumns} config={columnConfig} />
                    </table>
                </section>
            </div>


            <Pagination page={page} setPage={setPage} totalPages={totalPages} pageSize={pageSize} setPageSize={setPageSize} total={total} />
        </div>
    );
}