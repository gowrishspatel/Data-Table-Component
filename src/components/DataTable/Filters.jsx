import React from 'react';


function uniqueValues(rows, col) {
    const set = new Set(rows.map((r) => (r[col] || '').toString()).filter(Boolean));
    return Array.from(set).slice(0, 500).sort();
}


export default function Filters({ headers, config, rows, filters, setFilters, clearFilter, visibleColumns, toggleColumn }) {
    return (
        <div className="dt-filters-dropdown">
            <details>
                <summary>Filters & Columns</summary>
                <div className="filters-panel">
                    {/* Column Toggle Section */}
                    <div className="filters-section">
                        <h4>Visible Columns</h4>
                        <div className="col-list">
                            {headers.map(h => (
                                <label key={h}>
                                    <input type="checkbox" checked={visibleColumns && visibleColumns[h]} onChange={() => toggleColumn(h)} />
                                    {config[h] ? config[h].displayName : h}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="filters-section">
                        <h4>Filters</h4>
                        {headers.map((h) => {
                            const cfg = config[h]; 
                            if (!cfg || !cfg.filterable) return null;
                            const f = filters[h] || {};
                            return (
                                <div key={h} className="filter-row">
                                    <div className="filter-title">{cfg.displayName}</div>
                                    {cfg.filterable.type === 'text' && (
                                        <div>
                                            <select value={f.mode || 'contains'} onChange={(e) => setFilters(prev => ({ ...prev, [h]: { ...f, mode: e.target.value, type: 'text' } }))}>
                                                <option value="contains">Contains</option>
                                                <option value="equals">Equals</option>
                                            </select>
                                            <input value={f.value || ''} onChange={(e) => setFilters(prev => ({ ...prev, [h]: { ...f, value: e.target.value, type: 'text' } }))} />
                                            <button onClick={() => clearFilter(h)}>Clear</button>
                                        </div>
                                    )}
                                    {cfg.filterable.type === 'select' && (
                                        <div>
                                            <select value={f.value || ''} onChange={(e) => setFilters(prev => ({ ...prev, [h]: { value: e.target.value, type: 'select' } }))}>
                                                <option value="">--any--</option>
                                                {uniqueValues(rows, h).map((v) => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                            <button onClick={() => clearFilter(h)}>Clear</button>
                                        </div>
                                    )}
                                    {cfg.filterable.type === 'number' && (
                                        <div>
                                            <select value={f.mode || 'eq'} onChange={(e) => setFilters(prev => ({ ...prev, [h]: { ...f, mode: e.target.value, type: 'number' } }))}>
                                                <option value="eq">=</option>
                                                <option value="gt">&gt;</option>
                                                <option value="lt">&lt;</option>
                                            </select>
                                            <input value={f.value || ''} onChange={(e) => setFilters(prev => ({ ...prev, [h]: { ...f, value: e.target.value, type: 'number' } }))} />
                                            <button onClick={() => clearFilter(h)}>Clear</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </details>
        </div>
    );
}