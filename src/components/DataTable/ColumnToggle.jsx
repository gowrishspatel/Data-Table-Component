import React from 'react';
export default function ColumnToggle({ headers, visible, onToggle, config }) {
    return (
        <div className="dt-col-toggle">
            <details>
                <summary>Columns</summary>
                <div className="col-list">
                    {headers.map(h => (
                        <label key={h}>
                            <input type="checkbox" checked={visible && visible[h]} onChange={() => onToggle(h)} />
                            {config[h] ? config[h].displayName : h}
                        </label>
                    ))}
                </div>
            </details>
        </div>
    );
}